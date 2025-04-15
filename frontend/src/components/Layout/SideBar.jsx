import React, { useEffect, useState } from 'react';
import { MessageCircle, Settings, User, Edit, Trash2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";

import { setSessions, removeSession } from '../../store/sessionSlice'; // Import the setSessions action

const SideBar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sessions = useSelector( ( state ) => state.sessions ); // Access sessions from Redux store


    const [ loading, setLoading ] = useState( true );



    const handleSessionClick = ( session ) => {
        navigate( `/chat/${session.id}`, {
            state: {
                sessionId: session.id,
                isNewSession: false
            }
        } );
    };


    useEffect( () => {
        const fetchSessions = async () => {
            const token = localStorage.getItem( 'token' );
            try {
                const response = await axios.get( 'http://localhost:8000/api/session/user-sessions', {
                    headers: { Authorization: `Bearer ${token}` }
                } );

                console.log( "Reponse coming", response )
                // Dispatch action to set sessions in Redux store
                dispatch( setSessions( response.data.data ) );
            } catch ( error ) {
                console.error( 'Error fetching sessions:', error );
            }
        };

        fetchSessions();
    }, [ dispatch ] );


    const createdChats = useSelector( ( state ) => state.chat.createdChats );


    // Check if user is authenticated
    const token = localStorage.getItem( 'token' );
    const isAuthenticated = Boolean( token ); // Convert to boolean for clarity

    const handleDeleteChat = ( chatId ) => {
        dispatch( { type: 'DELETE_CHAT', payload: chatId } );
    };

    const settingsItems = [
        {
            icon: User,
            name: 'Profile',
            path: '/profile',
        },
        {
            icon: Settings,
            name: 'Settings',
            path: '/settings',
        }
    ];

    const NavItem = ( { icon: Icon, name, path } ) => {
        const isActive = location.pathname === path;
        return (
            <Link
                to={path}
                className={`flex items-center px-4 py-3 rounded-lg mb-1.5 transition-colors duration-200
                    ${isActive ? 'bg-[#A2AA7B] text-white' : 'text-[#5C6748] hover:bg-[#D7E0BD]/20'}`}
            >
                <Icon size={20} className="mr-2" />
                <span className="text-base font-medium">{name}</span>
            </Link>
        );
    };


    console.log( "new session", sessions )



    const handleDeleteSession = async ( sessionId ) => {
        const token = localStorage.getItem( 'token' );
        try {
            await axios.delete( `http://localhost:8000/api/session/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            } );
            // Dispatch action to remove session from Redux store
            dispatch( removeSession( sessionId ) );


            if ( sessions.length > 1 ) {
                // If there are more sessions, navigate to the most recent session or the last active session
                const mostRecentSession = sessions.filter( session => session.id !== sessionId ).reduce( ( latest, session ) => {
                    return new Date( session.createdAt ) > new Date( latest.createdAt ) ? session : latest;
                } );
                navigate( `/chat/${mostRecentSession.id}` );
            } else {
                // If no sessions left, navigate to /assessment page
                navigate( '/assessment' );
            }


            navigate( "/assessment" )
        } catch ( error ) {
            console.error( 'Error deleting session:', error );
        }
    };


    return (
        <aside className="relative flex flex-col h-screen w-64 p-3 bg-white/85 backdrop-blur-lg border-r border-[#E7EAE5]">
            {/* Main Container with Flex Column */}
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="flex items-center justify-center shrink-0">
                    <img
                        src="/src/assets/logo2.png"
                        alt="SkinSmart AI Logo"
                        className="sidebar-logo"
                    />
                </div>

                {/* Chat Section */}
                <div className="flex-grow overflow-y-auto pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-[#5C6748]">Chat</h2>
                        <Link to="/assessment">
                            <Edit size={18} className="text-[#5C6748] hover:text-[#D7E0BD] transition-colors duration-200" />
                        </Link>
                    </div>

                    {/* Created Chats List */}



                    <div className="space-y-2 ml-2">
                        {sessions.length > 0 ? (
                            sessions.map( ( session ) => {
                                const isSessionActive = location.pathname === `/chat/${session.id}`;
                                const sessionName = `Session - ${new Date( session.createdAt ).toLocaleDateString()}`;

                                return (
                                    <div
                                        key={session.id}
                                        className="group flex items-center justify-between py-2 px-3 rounded-md cursor-pointer transition-colors duration-200"
                                    >
                                        {/* Session Name Section */}
                                        <div
                                            onClick={() => handleSessionClick( session )} // Separate click for session loading
                                            className={`flex-1 text-sm truncate
                            ${isSessionActive ? 'bg-[#A2AA7B] text-white' : 'hover:bg-[#D7E0BD]/10'}`
                                            }
                                        >
                                            <span className={`${isSessionActive ? 'text-white' : 'text-[#5C6748]'}`}>
                                                {sessionName}
                                            </span>
                                        </div>

                                        {/* Delete Button Section */}
                                        <button
                                            onClick={( e ) => {
                                                e.stopPropagation(); // Prevent triggering session click when deleting
                                                handleDeleteSession( session.id );
                                            }}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                            aria-label="Delete session"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            } )
                        ) : (
                            <p className="text-sm text-[#5C6748] text-center mt-4">
                                No sessions available. Start by creating a new assessment!
                            </p>
                        )}
                    </div>



                </div>

                {/* Settings Section - Only visible if authenticated */}
                {isAuthenticated && (
                    <div className="mt-auto pt-4 border-t border-[#E7EAE5]">
                        <h2 className="text-lg font-medium text-[#5C6748] mb-3">ACCOUNT</h2>
                        <div className="space-y-1">
                            {settingsItems.map( ( item, index ) => (
                                <NavItem key={index} {...item} />
                            ) )}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default SideBar;
