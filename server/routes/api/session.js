let mongoose = require( "mongoose" );
let router = require( "express" ).Router();
const axios = require( "axios" );
let {
    OkResponse,
    BadRequestResponse,
    UnauthorizedResponse,
} = require( "express-http-response" );
const { default: fetch } = require( "node-fetch" );
const { auth } = require( "../../middlewares" );
const { ResponseHandler } = require( "../../utils" );
let User = mongoose.model( "User" );
let Session = mongoose.model( "Session" );
const { openai } = require( "../../utils/openGpt" );




router.get(
    "/user-sessions",
    auth.required,
    auth.user,
    async ( req, res, next ) => {
        console.log( "Reqyest user coming", req.user )
        try {
            const sessions = await Session.find( { sender: req.user._id } )
                .sort( { createdAt: -1 } ); // Sort by newest first
            return ResponseHandler.ok( res, sessions );
        } catch ( err ) {
            return ResponseHandler.badRequest( res, err.message );
        }
    }
);


// Add 
// this new route to get messages for a specific session
router.get(
    "/:sessionId",
    auth.required,
    auth.user,
    async ( req, res, next ) => {
        try {
            const { sessionId } = req.params;

            // Find the session by ID
            const session = await Session.findById( sessionId );
            if ( !session ) {
                return ResponseHandler.badRequest( res, "Session not found" );
            }

            // Return the messages from the session
            return ResponseHandler.ok( res, { messages: session.messages } );
        } catch ( err ) {
            return ResponseHandler.badRequest( res, err.message );
        }
    }
);



router.post(
    "/save",
    auth.required,
    auth.user,
    async ( req, res, next ) => {
        console.log( "Saving session", req.body );
        try {
            if ( !req.body ) {
                return ResponseHandler.badRequest( res, "Missing required parameters" );
            }

            const { form } = req.body;

            const {
                skinType,
                mainConcern,
                additionalSkinConcerns,
                alcoholConsumption,
                climateType,
                currentRoutine,
                dietType,
                exerciseFrequency,
                shavingFrequency,
                skinTextureDescription,
                productUsageFrequency,
                razorBurnIssues,
                stressLevel,
                sunExposure,
                waterIntake,
                workEnvironment,
                specificSkinIssues
            } = form;

            // Create new session with assessment data
            const newSession = await Session( {
                sender: req.user._id,
                assesment: {
                    skinType,
                    mainConcern,
                    additionalSkinConcerns,
                    alcoholConsumption,
                    climateType,
                    currentRoutine,
                    dietType,
                    exerciseFrequency,
                    shavingFrequency,
                    skinTextureDescription,
                    productUsageFrequency,
                    razorBurnIssues,
                    stressLevel,
                    sunExposure,
                    waterIntake,
                    workEnvironment, specificSkinIssues
                },
                messages: [] // Initialize with empty messages array
            } );

            await newSession.save();

            return ResponseHandler.ok( res, newSession );
        } catch ( err ) {
            console.log( "Error coming", err.message )
            return ResponseHandler.badRequest( res, err.message );
        }
    }
);

router.post( "/", auth.required, auth.user, async ( req, res, next ) => {
    const { sessionId } = req.body;
    const { message } = req.body;

    try {
        // Validate input
        if ( !sessionId || !message ) {
            return ResponseHandler.badRequest( res, "Missing sessionId or message" );
        }

        // Check message length to prevent token overflow
        if ( message.length > 500 ) {
            return ResponseHandler.badRequest( res, "Message is too long. Please limit your question to 500 characters." );
        }

        const foundSession = await Session.findById( sessionId );
        if ( !foundSession ) return ResponseHandler.badRequest( res, "Session not found" );

        // Properly format previous messages with correct roles
        // Limit to 3 message pairs (3 user + 3 assistant) to prevent token overflow
        const previousMessages = foundSession.messages.slice( -6 ).map( msg => ( {
            role: msg.question ? "user" : "assistant",
            content: msg.question || msg.answer
        } ) );

        const { assesment } = foundSession;

        const systemPrompt = `
You are an AI Medical Assistant specializing in skincare for men in Pakistan. Your role is to provide personalized skincare advice based on the user's assessment data and their ongoing queries.

### Key Principles:
1. **Solution-First Approach**:
   - Prioritize providing helpful solutions rather than asking excessive questions.
   - Use the assessment data already provided to formulate your responses.
   - Only ask essential follow-up questions when critical information is missing.

2. **Question Guidelines**:
   - Limit follow-up questions to 1-2 per response maximum.
   - Make it clear that answering questions is optional: "If you'd like to share..."
   - If the user doesn't answer a question, proceed with generalized advice based on what you know.

3. **Product Recommendations**:
   - Recommend specific products available in Pakistan that match the user's skin type and concerns.
   - Always include: product name, key ingredients, how to use, potential side effects.
   - Include price ranges when possible (budget, mid-range, premium options).
   - Focus on products from brands like: Pond's, Garnier, Nivea, Clean & Clear, L'Oreal Men Expert, Neutrogena.

4. **Response Structure**:
   - Begin with direct advice/solutions based on their query and assessment data.
   - Each step in routines should be on its own line with a clear number.
   - Product recommendations should appear on a separate line from the step description.
   - Use proper headings for Morning Routine, Evening Routine, and Weekly Treatments.
   - Keep responses concise, under 300 words when possible.

5. **Avoiding Hallucination**:
   - If you're uncertain about a specific product's availability in Pakistan, stick to well-known international brands that are commonly available.
   - If the user asks about a specific skin condition that requires professional diagnosis, recommend they consult a dermatologist.
   - Don't make up ingredients or effects that you're not certain about.
   - Only recommend products that you know are available in Pakistan.
   - If you don't know the answer, it's better to say "I don't have enough information" than to guess.

6. **Stay On Topic**:
   - Only provide advice related to men's skincare, skin health, and related lifestyle factors.
   - If asked about topics unrelated to skincare, politely respond with: "I'm a specialized skincare assistant for men in Pakistan. I'd be happy to help with any questions about skincare routines, products, or specific skin issues. Is there something about your skin that I can assist with?"
   - Do not provide medical diagnosis or treatment for conditions requiring professional medical care.
   - For non-skincare questions, gently redirect the conversation back to skincare without answering the off-topic question.

### User's Assessment Data:
Skin Type: ${assesment.skinType || "Not specified"}
Main Concern: ${assesment.mainConcern || "Not specified"}
Additional Concerns: ${assesment.additionalSkinConcerns || "None mentioned"}
Specific Issues: ${assesment.specificSkinIssues?.join( ", " ) || "None specified"}
Current Routine: ${assesment.currentRoutine || "Not specified"}
Shaving Frequency: ${assesment.shavingFrequency || "Not specified"}
Climate: ${assesment.climateType || "Not specified"}
Work Environment: ${assesment.workEnvironment || "Not specified"}
Exercise Frequency: ${assesment.exerciseFrequency || "Not specified"}
Diet Type: ${assesment.dietType || "Not specified"}
Stress Level: ${assesment.stressLevel || "Not specified"}
Water Intake: ${assesment.waterIntake || "Not specified"}
Sun Exposure: ${assesment.sunExposure || "Not specified"}
Razor Burn Issues: ${assesment.razorBurnIssues || "Not specified"}
Product Usage Frequency: ${assesment.productUsageFrequency || "Not specified"}
Skin Texture: ${assesment.skinTextureDescription || "Not specified"}
Alcohol Consumption: ${assesment.alcoholConsumption || "Not specified"}

Remember: Your primary goal is to provide practical skincare solutions suitable for men in Pakistan, not to gather excessive information. Keep responses concise and to the point.

### User's Current Question:
"${message}"
`;

        // Calculate approximate token count to prevent exceeding limits
        const estimatedTokenCount = calculateTokens( systemPrompt ) + calculateTokens( JSON.stringify( previousMessages ) );

        // If token count is too high, trim previous messages
        let trimmedPreviousMessages = previousMessages;
        if ( estimatedTokenCount > 3000 ) {
            // Keep only the most recent messages
            trimmedPreviousMessages = previousMessages.slice( -4 );
        }

        const response = await openai.chat.completions.create( {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                ...trimmedPreviousMessages,
                { role: "user", content: message }
            ],
            max_tokens: 700, // Limit response length
            temperature: 0.7  // Lower temperature for more predictable responses
        } );

        const rawResponseText = response.choices[ 0 ].message.content;

        // Improved formatting function
        const formattedResponse = formatApiResponse( rawResponseText );

        // Add messages to session
        // Add user message
        foundSession.messages.push( {
            question: message,
            answer: null,
            isUser: true
        } );

        // Add assistant response
        foundSession.messages.push( {
            question: null,
            answer: formattedResponse,
            isUser: false
        } );

        // Limit session history to prevent it from growing too large
        if ( foundSession.messages.length > 50 ) {
            // Keep only the 30 most recent messages
            foundSession.messages = foundSession.messages.slice( -30 );
        }

        await foundSession.save();

        return ResponseHandler.ok( res, {
            answer: formattedResponse,
            sessionId: foundSession._id
        } );

    } catch ( err ) {
        console.error( "Error in chat route:", err );
        return ResponseHandler.badRequest( res, "Error processing your request" );
    }
} );

// Rough token estimation function (3.5 tokens per word)
function calculateTokens( text ) {
    return text.split( /\s+/ ).length * 3.5;
}

function formatApiResponse( responseText ) {
    // Replace standard line breaks with HTML breaks
    let formattedText = responseText.replace( /\n\n/g, '<br/><br/>' );
    formattedText = formattedText.replace( /\n/g, '<br/>' );

    // STEP 1: Handle all generic ** formatting first (before specific patterns)
    // This finds any text between ** markers and replaces with <strong> tags
    formattedText = formattedText.replace(
        /\*\*([^*]+)\*\*/g,
        '<strong>$1</strong>'
    );

    // STEP 2: Format numbered step headers (now just checking for strong tags followed by colon)
    formattedText = formattedText.replace(
        /(\d+)\.\s+<strong>([^<:]+):<\/strong>/g,
        '$1. <strong>$2:</strong>'
    );

    // STEP 3: Format product names - look for product names mentioned after "like" or "such as"
    formattedText = formattedText.replace(
        /(like|such as)\s+([A-Z][a-zA-Z\s&]+?)(\.|,|<br\/>|\s(?=[A-Z]))/g,
        '$1 <strong>"$2"</strong>$3'
    );

    // Format section headings that are on their own line and followed by numbered steps
    formattedText = formattedText.replace(
        /<strong>([^<:]+):<\/strong>(?=<br\/>[\s\S]*?\d+\.)/g,
        '<h3 class="font-bold text-lg text-green-800 mt-4 mb-2">$1:</h3>'
    );

    // Format recommended product names with a more generic approach
    formattedText = formattedText.replace(
        /<strong>Recommended Product:<\/strong>\s+([^<]+?)(?=<br\/>|$)/g,
        '<strong>Recommended Product:</strong> <strong>"$1"</strong>'
    );

    // Format product recommendations in a highlighted box
    formattedText = formattedText.replace(
        /Product Recommendations:(.*?)(?=<br\/><br\/>|$)/gs,
        '<div class="product-rec-box p-4 bg-green-50 border border-green-200 rounded-lg my-3"><strong>Product Recommendations:</strong>$1</div>'
    );

    // Highlight important warnings or notes
    formattedText = formattedText.replace(
        /(Note:|Warning:|Important:)(.*?)(?=<br\/><br\/>|$)/gs,
        '<div class="note-box p-3 bg-yellow-50 border border-yellow-200 rounded-lg my-2"><strong>$1</strong>$2</div>'
    );

    // Create better structure for instructions/how to use sections
    formattedText = formattedText.replace(
        /<strong>(How to Use|Usage Instructions|Application):<\/strong>(.*?)(?=<br\/><strong>|$)/gs,
        '<div class="instruction-box p-3 bg-blue-50 border border-blue-200 rounded-lg my-2"><h3 class="font-bold text-lg text-blue-800 mb-2">$1:</h3>$2</div>'
    );

    // Create better structure for side effects sections
    formattedText = formattedText.replace(
        /<strong>(Potential Side Effects|Side Effects|Cautions):<\/strong>(.*?)(?=<br\/><strong>|$)/gs,
        '<div class="side-effects-box p-3 bg-yellow-50 border border-yellow-200 rounded-lg my-2"><h3 class="font-bold text-lg text-yellow-800 mb-2">$1:</h3>$2</div>'
    );

    // Create headers for markdown sections (# heading)
    formattedText = formattedText.replace(
        /^(#{1,3})\s+(.+?)(?=<br\/>|$)/gm,
        '<h3 class="font-bold text-lg text-green-800 mt-4 mb-2">$2</h3>'
    );

    // Format morning/evening routine headers
    formattedText = formattedText.replace(
        /(Morning Routine:|Evening Routine:|Weekly Treatments:|Daily Routine:)(?=<br\/>|$)/gm,
        '<h3 class="font-bold text-lg text-green-800 mt-4 mb-2">$1</h3>'
    );

    // Better format for numbered steps with styled number bullets
    formattedText = formattedText.replace(
        /(\d+)\.\s+(?!<strong>)([^<]+)(?=<br\/>|$)/g,
        '<div class="routine-step my-2"><span class="step-number inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-700 text-white mr-2">$1</span>$2'
    );

    // Add closing tags for routine steps
    formattedText = formattedText.replace( /<br\/><div class="routine-step/g, '</div><div class="routine-step' );

    // Add final closing tag if needed
    if ( formattedText.includes( '<div class="routine-step' ) && !formattedText.endsWith( '</div>' ) ) {
        formattedText += '</div>';
    }

    return `<div class="chat-response">${formattedText}</div>`;
}



// Add this new route for initial response
router.post(
    "/initial-response/:sessionId",
    auth.required,
    auth.user,
    async ( req, res, next ) => {
        try {
            const { sessionId } = req.params;

            // Get session with assessment data
            const session = await Session.findById( sessionId );
            if ( !session ) {
                return ResponseHandler.badRequest( res, "Session not found" );
            }

            const { assesment } = session;

            // Format specific skin issues for better readability
            const specificIssuesText = assesment.specificSkinIssues && assesment.specificSkinIssues.length > 0
                ? `${assesment.specificSkinIssues.join( ', ' )}`
                : '';

            // Generate immediate recommendations based on main concern and skin type
            let initialRecommendations = '';

            // Tailor initial recommendations based on user's main concern
            if ( assesment.mainConcern === 'Acne' ) {
                initialRecommendations = `
<div class="quick-recommendations p-4 bg-green-50 border border-green-200 rounded-lg my-4">
<strong>Quick Recommendations for Acne Concerns:</strong><br/>
1. <strong>Cleanser:</strong> Neutrogena Oil-Free Acne Wash (contains salicylic acid to clear pores)<br/>
2. <strong>Treatment:</strong> Clean & Clear Advantage Spot Treatment (for targeted application)<br/>
3. <strong>Moisturizer:</strong> Simple Oil-Free Moisturizer (won't clog pores)<br/>
4. <strong>Habit:</strong> Change pillowcases 2-3 times weekly to reduce bacteria contact
</div>`;
            }
            else if ( assesment.mainConcern === 'Aging' ) {
                initialRecommendations = `
<div class="quick-recommendations p-4 bg-green-50 border border-green-200 rounded-lg my-4">
<strong>Quick Recommendations for Aging Concerns:</strong><br/>
1. <strong>Cleanser:</strong> L'Oreal Men Expert Anti-Aging Face Wash<br/>
2. <strong>Treatment:</strong> Pond's Age Miracle Day Cream (contains retinol alternatives)<br/>
3. <strong>Protection:</strong> Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 50+<br/>
4. <strong>Habit:</strong> Apply moisturizer immediately after washing while skin is still slightly damp
</div>`;
            }
            else if ( assesment.mainConcern === 'Sensitivity' ) {
                initialRecommendations = `
<div class="quick-recommendations p-4 bg-green-50 border border-green-200 rounded-lg my-4">
<strong>Quick Recommendations for Sensitive Skin:</strong><br/>
1. <strong>Cleanser:</strong> Cetaphil Gentle Skin Cleanser (fragrance-free, non-irritating)<br/>
2. <strong>Moisturizer:</strong> QV Face Sensitive Moisturizer (hypoallergenic)<br/>
3. <strong>Shaving:</strong> Gillette SkinGuard Sensitive Razor with Nivea Sensitive Shaving Gel<br/>
4. <strong>Habit:</strong> Patch test new products on your inner arm for 24 hours before facial application
</div>`;
            }
            else if ( assesment.mainConcern === 'Uneven Tone' ) {
                initialRecommendations = `
<div class="quick-recommendations p-4 bg-green-50 border border-green-200 rounded-lg my-4">
<strong>Quick Recommendations for Uneven Skin Tone:</strong><br/>
1. <strong>Cleanser:</strong> Garnier Men PowerWhite Anti-Pollution Double Action Face Wash<br/>
2. <strong>Treatment:</strong> Fair & Lovely Men (contains niacinamide for brightening)<br/>
3. <strong>Protection:</strong> Vaseline Healthy Bright Sun + Pollution Protection SPF 30<br/>
4. <strong>Habit:</strong> Exfoliate gently twice weekly to remove dead skin cells
</div>`;
            }
            else if ( assesment.mainConcern === 'Oiliness' ) {
                initialRecommendations = `
<div class="quick-recommendations p-4 bg-green-50 border border-green-200 rounded-lg my-4">
<strong>Quick Recommendations for Oily Skin:</strong><br/>
1. <strong>Cleanser:</strong> Himalaya Purifying Neem Face Wash (controls excess oil)<br/>
2. <strong>Treatment:</strong> Clean & Clear Oil Control Film (for midday oil absorption)<br/>
3. <strong>Moisturizer:</strong> Neutrogena Hydro Boost Water Gel (oil-free hydration)<br/>
4. <strong>Habit:</strong> Use clay masks weekly to deep clean and reduce sebum production
</div>`;
            }
            else {
                initialRecommendations = `
<div class="quick-recommendations p-4 bg-green-50 border border-green-200 rounded-lg my-4">
<strong>Quick Recommendations Based on Your Profile:</strong><br/>
1. <strong>Cleanser:</strong> A gentle face wash suited for your ${assesment.skinType || "skin type"}<br/>
2. <strong>Protection:</strong> Daily sunscreen with at least SPF 30<br/>
3. <strong>Hydration:</strong> Lightweight moisturizer appropriate for Pakistani climate<br/>
4. <strong>Habit:</strong> Drink at least 8 glasses of water daily for skin hydration from within
</div>`;
            }

            // Generate initial response based on assessment data with immediate recommendations
            const initialResponse = {
                question: null,
                answer: `<div class="initial-assessment">
<h3 class="font-bold text-lg text-green-800 mb-3">Your Skin Assessment Analysis</h3>

Based on your assessment, here's what I understand about your skin profile:<br/><br/>

<div class="profile-summary p-4 bg-blue-50 border border-blue-100 rounded-lg mb-4">
<strong>Skin Type:</strong> ${assesment.skinType || "Not specified"}<br/>
<strong>Main Concern:</strong> ${assesment.mainConcern || "Not specified"}<br/>
${specificIssuesText ? `<strong>Specific Issues:</strong> ${specificIssuesText}<br/>` : ''}
<strong>Current Routine:</strong> ${assesment.currentRoutine || "Not specified"}<br/>
<strong>Environment:</strong> ${assesment.workEnvironment || "Not specified"} work environment, ${assesment.climateType || "unspecified"} climate<br/>
<strong>Lifestyle:</strong> ${assesment.exerciseFrequency || "Unspecified"} exercise, ${assesment.stressLevel || "unspecified"} stress levels
</div>

${initialRecommendations}

<h3 class="font-bold text-lg text-green-800 mt-4 mb-2">What would you like to focus on?</h3>

You can ask me about:
<ul class="list-disc pl-5 mt-2">
<li>Detailed recommendations for your ${assesment.mainConcern || "skin concerns"}</li>
<li>Daily skincare routine suggestions for your skin type</li>
<li>Specific products available in Pakistan for your concerns</li>
<li>How to address ${specificIssuesText || "your specific skin issues"}</li>
<li>Diet and lifestyle adjustments for better skin</li>
</ul>

How can I help you improve your skin today?
</div>`,
                isUser: false
            };

            // Add this as the first message
            session.messages.push( initialResponse );
            await session.save();

            return ResponseHandler.ok( res, { messages: session.messages } );
        } catch ( err ) {
            console.error( "Error generating initial response:", err );
            return ResponseHandler.badRequest( res, err.message );
        }
    }
);

// Add this route for continuing the chat
router.post(
    "/chat/:sessionId",
    auth.required,
    auth.user,
    async ( req, res, next ) => {
        try {
            const { sessionId } = req.params;
            const { message } = req.body;

            const session = await Session.findById( sessionId );
            if ( !session ) {
                return next( new BadRequestResponse( "Session not found" ) );
            }

            // Here you would typically process the message with your AI service
            // For now, let's just echo back a simple response
            const response = {
                question: message,
                answer: "Thank you for your message. I'm processing your request..."
            };

            session.messages.push( response );
            await session.save();

            return next( new OkResponse( response ) );
        } catch ( err ) {
            return next( new BadRequestResponse( err.message ) );
        }
    }
);


router.delete( "/:id", async ( req, res, next ) => {
    try {
        const sessionId = req.params.id;

        console.log( "Session ID coming", sessionId );

        // Use findByIdAndDelete to find and delete the session in one step
        const session = await Session.findByIdAndDelete( sessionId );

        console.log( "Session found and deleted:", session );

        if ( !session ) {
            return next( new BadRequestResponse( "Session not found", 422 ) );
        }

        return ResponseHandler.ok( res, "Session deleted successfully" );
    } catch ( err ) {
        return ResponseHandler.badRequest( res, err );
    }
} );





module.exports = router;
