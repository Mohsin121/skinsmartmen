const passport = require("passport");
const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");

const { auth } = require("../../middlewares");
const {
  ResponseHandler,
  sendEmail,
} = require("../../utils");

const router = express.Router();

router.use(passport.initialize());

// Generate a verification token and expiration time
const generateVerificationToken = () => {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    expiresAt: Date.now() + 60 * 60 * 1000, // Expires in 1 hour
  };
};


router.get("/context", auth.required, auth.user, async (request, response) => {
  try {
    if (request.user.status === "inactive")
      return ResponseHandler.badRequest(
        response,
        "You've been blocked by the admin! Contact support to unblock."
      );
    return ResponseHandler.ok(response, request.user.toAuthJSON());
  } catch (error) {
    console.log(error, "error");
    return ResponseHandler.badRequest(response, error);
  }
});

router.post("/signup", async (request, response) => {
  const { name, email, password } = request.body; // received the data from frontend and destructured the data comes in the body
  try {
   if(!name ||  !email || !password ) {
    return ResponseHandler.badRequest(response, "All fields are required"); // if any of field is missing it will through error
   }
      // finding the coming email from the database as unique 
    const exsUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (exsUser)
      return ResponseHandler.badRequest(response, "User already exists"); // if email found means that user is already in the database so it will throw an error

    // if user is not in the database then create a new user
    let user = new User({
      fullName: name,
      email: email.trim().toLowerCase(),
      status: "active",
    });

    // set their password through the set password method which i have written in schema
    user.setPassword(password);
        
    await user.save();// now in this step it will register the user  will all information which we have created
    return ResponseHandler.ok(
      response,
      "User registered successfully!"
    );
  } catch (err) {
    console.log(err, "err");
    return ResponseHandler.badRequest(response, err);
  }
});

router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    if(!email || !password) { 
      return ResponseHandler.badRequest(response, "Email and password is required");
    
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user)
      return ResponseHandler.badRequest(
        response,
        "Either incorrect username or password "
      );

  

    if (user.authType !== "google" && !user.hash)
      return ResponseHandler.badRequest(
        response,
        "Account setup incomplete! Please complete signup first."
      );

    if (!user.validPassword(password))
      return ResponseHandler.badRequest(response, "Invalid credentials");

    return ResponseHandler.ok(response,   user.toAuthJSON() );
  } catch (err) {
    console.log(err, "error");
    return ResponseHandler.badRequest(response, err);
  }
});



// 📌 Send Verification Link
router.post("/send/verify-link/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return ResponseHandler.badRequest(res, "User not found");

    // Generate new verification token
    const { token, expiresAt } = generateVerificationToken();
    user.verifyToken = token;
    user.verifyTokenExpires = expiresAt;
    await user.save();

    // Send verification email
    const verifyLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    console.log("verifyLink", verifyLink) 
    sendEmail(user, "Verify Your Email", {
      verifyAccount: true,
      link: verifyLink,
    });

    return ResponseHandler.ok(res, "Verification link sent successfully");
  } catch (error) {
    return ResponseHandler.badRequest(res, error.message);
  }
});



// 📌 Verify Email Link
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const {password} = req.body;

console.log("token", token)
console.log("password", password)


  try {
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpires: { $gt: Date.now() },
    });

    if (!user) return ResponseHandler.badRequest(res, "Invalid or expired token");

    // Mark the user as verified
    user.verifyToken = null;
    user.verifyTokenExpires = null;

    user.setPassword(password);
    await user.save();

    return ResponseHandler.ok(res, "Email verified successfully");
  } catch (error) {
    return ResponseHandler.badRequest(res, error.message);
  }
});

router.post("/set-new-password", async (request, response) => {
  try {
    const { email, otp, password } = request.body;
    if (!otp) {
      return ResponseHandler.badRequest(
        response,
        "Otp not found please reset password again"
      );
    }
    if (!password || !email?.trim())
      return ResponseHandler.badRequest(
        response,
        "Missing required parameters"
      );

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      authType: "local",
    });
    if (!user) return ResponseHandler.badRequest(response, "User not found!");

    if (user.otp == otp && user.otpExpires > Date.now()) {
      user.setPassword(password);
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return ResponseHandler.ok(response, "Password reset successfully!");
    } else {
      return ResponseHandler.badRequest(response, "Invalid Token");
    }
  } catch (err) {
    console.log(err, "err");
    return ResponseHandler.badRequest(response, err);
  }
});

module.exports = router;
