import React from 'react';
import { MessageCircle, Settings, User, Edit, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const SideBar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const createdChats = useSelector((state) => state.chat.createdChats);

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const isAuthenticated = Boolean(token); // Convert to boolean for clarity

    const handleDeleteChat = (chatId) => {
        dispatch({ type: 'DELETE_CHAT', payload: chatId });
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

    const NavItem = ({ icon: Icon, name, path }) => {
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
                        {createdChats.length > 0 ? (
                            createdChats.map((chat) => {
                                const isChatActive = location.pathname === `/chat/${chat.id}`;
                                
                                return (
                                    <div 
                                        key={chat.id}
                                        className={`group flex items-center justify-between py-2 px-3 rounded-md 
                                            transition-colors duration-200
                                            ${isChatActive 
                                                ? 'bg-[#A2AA7B] text-white' 
                                                : 'hover:bg-[#D7E0BD]/10'
                                            }`}
                                    >
                                        <Link 
                                            to={`/chat/${chat.id}`}
                                            className={`flex-1 text-sm truncate
                                                ${isChatActive 
                                                    ? 'text-white' 
                                                    : 'text-[#5C6748]'
                                                }`}
                                        >
                                            {chat.name}
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteChat(chat.id)}
                                            className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                                ${isChatActive ? 'hover:text-red-300' : ''}`}
                                            aria-label="Delete chat"
                                        >
                                            <Trash2 
                                                size={16} 
                                                className={`${
                                                    isChatActive 
                                                        ? 'text-white hover:text-red-300' 
                                                        : 'text-red-500 hover:text-red-600'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-[#5C6748] text-center mt-4">No chats available. Start by creating a new chat!</p>
                        )}
                    </div>
                </div>

                {/* Settings Section - Only visible if authenticated */}
                {isAuthenticated && (
                    <div className="mt-auto pt-4 border-t border-[#E7EAE5]">
                        <h2 className="text-lg font-medium text-[#5C6748] mb-3">ACCOUNT</h2>
                        <div className="space-y-1">
                            {settingsItems.map((item, index) => (
                                <NavItem key={index} {...item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default SideBar;
