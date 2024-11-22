import React from 'react';
import { MessageCircle, Settings, User, Droplet, Sprout } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SideBar = () => {
    const location = useLocation();

    const menuItems = [
        {
            icon: MessageCircle,
            name: 'AI Chat',
            path: '/',
            color: '#5C6748', // Darker green for better legibility
            activeColor: '#D7E0BD' // Soft green for active state
        },
        {
            icon: Sprout,
            name: 'Skin Analysis',
            path: '/analysis',
            color: '#5C6748',
            activeColor: '#D7E0BD'
        }
    ];

    const settingsItems = [
        {
            icon: User,
            name: 'Profile',
            path: '/profile',
            color: '#5C6748',
            activeColor: '#D7E0BD'
        },
        {
            icon: Settings,
            name: 'Settings',
            path: '/settings',
            color: '#5C6748',
            activeColor: '#D7E0BD'
        }
    ];

    const NavItem = ({ icon: Icon, name, path, color, activeColor }) => (
        <Link
            to={path}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '6px',
                backgroundColor: location.pathname === path ? activeColor : 'transparent',
                color: location.pathname === path ? '#FFFFFF' : color,
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500'
            }}
        >
            <Icon size={20} style={{ marginRight: '8px' }} />
            {name}
        </Link>
    );

    return (
        <div style={{
            backgroundColor: '#FFFFFFD9', // Semi-transparent white
            backdropFilter: 'blur(10px)',
            width: '250px',
            height: '100vh',
            padding: '20px',
            border: '1px solid rgb(231 234 229)'
            
        }}>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <Droplet size={30} style={{ color: '#5C6748', marginRight: '10px' }} />
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(to right, #E6EAD3, #D1D9B3)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    SkinSmart AI
                </h1>
            </div>

            <div>
                <h2 style={{ fontSize: '18px', color: '#5C6748', marginBottom: '10px' }}>MENU</h2>
                {menuItems.map((item, index) => <NavItem key={index} {...item} />)}
            </div>

            <div style={{ marginTop: '20px' }}>
                <h2 style={{ fontSize: '18px', color: '#5C6748', marginBottom: '10px' }}>ACCOUNT</h2>
                {settingsItems.map((item, index) => <NavItem key={index} {...item} />)}
            </div>
        </div>
    );
};

export default SideBar;
