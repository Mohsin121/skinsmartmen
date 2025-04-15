import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { MessageCircle } from "lucide-react";
import Markdown from "react-markdown";

import rehypeRaw from 'rehype-raw';
const Chat = () => {
  const location = useLocation();
  const { sessionId } = location.state;
  const [ messages, setMessages ] = useState( [] );
  const [ loading, setLoading ] = useState( false );
  const [ userInput, setUserInput ] = useState( '' );
  const messagesEndRef = useRef( null );

  useEffect( () => {
    const initializeChat = async () => {
      const token = localStorage.getItem( "token" );

      try {
        setLoading( true );
        // First get the session
        const sessionResponse = await axios.get(
          `http://localhost:8000/api/session/${sessionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sessionMessages = sessionResponse.data.data.messages;

        // If it's a new session and there are no messages, get initial response
        if ( location.state?.isNewSession && sessionMessages.length === 0 ) {
          const response = await axios.post(
            `http://localhost:8000/api/session/initial-response/${sessionId}`,
            { formData: location.state.formData },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessages( response.data.data.messages );
        } else {
          // Use existing messages
          setMessages( sessionMessages );
        }
      } catch ( error ) {
        console.error( "Error initializing chat:", error );
      } finally {
        setLoading( false );
      }
    };

    initializeChat();
  }, [ sessionId, location.state ] );

  const sendMessage = async ( e ) => {
    e.preventDefault();
    if ( !userInput.trim() ) return;

    const token = localStorage.getItem( "token" );
    const newMessage = { question: userInput, isUser: true };

    // Add user message immediately
    setMessages( ( prev ) => [ ...prev, newMessage ] );

    // Add loading message
    const loadingMessage = {
      answer: "...",
      isLoading: true,
      isUser: false
    };
    setMessages( ( prev ) => [ ...prev, loadingMessage ] );

    setUserInput( '' );
    scrollToBottom();

    try {
      const response = await axios.post(
        `http://localhost:8000/api/session`,
        {
          message: userInput,
          sessionId: sessionId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Replace loading message with actual response
      setMessages( ( prev ) => [
        ...prev.slice( 0, -1 ), // Remove loading message
        { answer: response.data.data.answer, isUser: false } // Add AI response
      ] );
    } catch ( error ) {
      console.error( "Error sending message:", error );
      // Replace loading message with error
      setMessages( ( prev ) => [
        ...prev.slice( 0, -1 ),
        { answer: "Sorry, there was an error processing your request." }
      ] );
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView( { behavior: "smooth" } );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Messages Display */}
        <div className="h-[600px] overflow-y-auto p-4">
          {messages.map( ( message, index ) => (

            <div

              key={index}

              className={`mb-4 ${message.question ? 'text-right' : 'text-left'}`}

            >

              {message.question && (

                <div

                  className="inline-block p-3 rounded-lg mb-4 bg-blue-500 text-white"

                >

                  {message.question}

                </div>

              )}

              {message.answer && (

                <div

                  className="max-w-[70%] p-3 rounded-lg bg-gray-200 text-gray-800 text-start"

                  dangerouslySetInnerHTML={{

                    __html: message.answer

                  }}


                />
                // <Markdown rehypePlugins={[ rehypeRaw ]}>{message.answer}</Markdown>

              )}

            </div>

          ) )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={( e ) => setUserInput( e.target.value )}
              className="flex-1 p-2 border rounded-lg"
              placeholder="Type your message..."
              disabled={loading}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              disabled={loading}
            >
              <MessageCircle size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
