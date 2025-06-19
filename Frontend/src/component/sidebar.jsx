// import { NavLink, useNavigate } from 'react-router-dom';
// import { useUser } from '../contexts/UserContext';
// import logoImage from '../assets/src/Logo.png';
// import home from '../assets/src/home.svg';
// import game from '../assets/src/game.svg';
// import chat from '../assets/src/chat.svg';
// import settings from '../assets/src/setting.svg';
// import logout from '../assets/src/logout.svg';
// import calculator from '../assets/src/calculator.svg'

// const Sidebar = ({ isOpen, setIsOpen }) => {
//     const { user, logout: contextLogout } = useUser();
//     const navigate = useNavigate();

//     const handleLogout = async () => {
//         await contextLogout();
//         navigate('/auth/login');
//     };

//    const navLinks = [
//     { to: "/", icon: home, label: "Home" },
//     { to: "/calculator", icon: calculator, label: "calculator" },
//     { to: "/settings", icon: settings, label: "Settings" },
// 	];

//     const SidebarContent = () => (
//         <div className="w-[100px] bg-slate-800 flex flex-col h-full shadow-lg">
//             <div className="mb-4 flex justify-center p-4">
//                 <img src={logoImage} alt="Pong Logo" className="w-10 h-10" />
//             </div>

//             <nav className="flex flex-col items-center gap-8 p-2">
//                 {navLinks.map((link) => (
//                     <NavLink
//                         key={link.to}
//                         to={link.to}
//                         onClick={() => setIsOpen(false)}
//                         className={({ isActive }) => `flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200 
//                             ${isActive 
//                                 ? 'bg-[#608BC1]' 
//                                 : 'hover:bg-[#608BC1]/80'}`}
//                     >
//                         <img src={link.icon} alt={link.label} className="w-25 h-25" />
//                     </NavLink>
//                 ))}
//             </nav>

//             <div className="mt-auto p-2 border-t border-gray/50">
//                 <div className='flex items-center gap-2'>
//                 </div>
//                 <button
//                     onClick={handleLogout}
//                     className="w-full mt-2 flex items-center gap-4 px-4 py-3 text-[#133E87] 
//                         bg-slate-800 hover:bg-[#608BC1] hover:text-white
//                         rounded-lg transition-colors duration-200"
//                 >
//                     <img src={logout} alt="logout" className="w-15" />
//                 </button>
//             </div>
//         </div>
//     );

//     return (
//         <>
//             <div className="h-screen shadow-2xl hidden md:flex">
//                 <SidebarContent />
//             </div>

//             {isOpen && (
//                 <div className="fixed inset-0  z-40 md:hidden">
//                     <div className="h-screen w-[80px]">
//                         <SidebarContent />
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Home, Calculator, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import logoImage from '../assets/src/Logo.png';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout: contextLogout } = useUser();
    const navigate = useNavigate();
    const [hoveredItem, setHoveredItem] = useState(null);

    const handleLogout = async () => {
        await contextLogout();
        navigate('/auth/login');
    };

    const navLinks = [
        { 
            to: "/", 
            icon: Home, 
            label: "Home",
            color: "from-blue-500 to-blue-600",
            hoverColor: "hover:shadow-blue-500/25"
        },
        { 
            to: "/calculator", 
            icon: Calculator, 
            label: "Calculator",
            color: "from-emerald-500 to-emerald-600",
            hoverColor: "hover:shadow-emerald-500/25"
        },
        { 
            to: "/settings", 
            icon: Settings, 
            label: "Settings",
            color: "from-purple-500 to-purple-600",
            hoverColor: "hover:shadow-purple-500/25"
        },
    ];

    const SidebarContent = () => (
        <div className="w-[100px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col h-full shadow-2xl border-r border-slate-700/50 backdrop-blur-xl">
            {/* Header avec logo animé */}
            <div className="mb-6 flex justify-center p-4 relative">
                <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                    <img 
                        src={logoImage} 
                        alt="Logo" 
                        className="relative w-12 h-12 rounded-full ring-2 ring-white/10 group-hover:ring-white/30 transition-all duration-300 group-hover:scale-110" 
                    />
                </div>
            </div>

            {/* Navigation avec effets avancés */}
            <nav className="flex flex-col items-center gap-4 p-2 flex-1">
                {navLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                        <div key={link.to} className="relative group">
                            <NavLink
                                to={link.to}
                                onClick={() => setIsOpen(false)}
                                onMouseEnter={() => setHoveredItem(index)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className={({ isActive }) => `
                                    relative flex items-center justify-center w-14 h-14 rounded-2xl
                                    transition-all duration-300 ease-out transform
                                    hover:scale-110 hover:-translate-y-1
                                    ${isActive 
                                        ? `bg-gradient-to-r ${link.color} shadow-lg ${link.hoverColor} shadow-lg` 
                                        : 'bg-slate-700/50 hover:bg-slate-600/70 backdrop-blur-sm'
                                    }
                                    border border-slate-600/30 hover:border-slate-500/50
                                    group-hover:shadow-2xl
                                `}
                            >
                                {/* Effet de brillance */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <IconComponent 
                                    size={22} 
                                    className="relative z-10 text-white group-hover:text-white transition-all duration-300" 
                                />
                            </NavLink>

                            {/* Tooltip */}
                            <div className={`
                                absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg
                                border border-slate-600/50 shadow-xl backdrop-blur-sm
                                transition-all duration-300 z-50 whitespace-nowrap
                                ${hoveredItem === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}
                            `}>
                                {link.label}
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600/50"></div>
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Section logout avec style premium */}
            <div className="mt-auto p-4 border-t border-slate-700/50 bg-gradient-to-t from-slate-900/50 to-transparent">
                <div className="flex items-center justify-center mb-3">
                    <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
                </div>
                
                <div className="relative group">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center p-3 text-slate-300 
                            bg-slate-800/50 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20
                            rounded-xl transition-all duration-300 transform hover:scale-105
                            border border-slate-700/50 hover:border-red-500/30
                            backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-red-500/10"
                    >
                        {/* Effet de brillance sur hover */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <LogOut 
                            size={20} 
                            className="relative z-10 group-hover:text-red-400 transition-colors duration-300 group-hover:rotate-12 transform" 
                        />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="h-screen shadow-2xl hidden md:flex relative">
                <SidebarContent />
                
                {/* Effet de lumière ambiante */}
                <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* Mobile Sidebar */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Overlay avec blur */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    
                    {/* Sidebar mobile */}
                    <div className="relative h-screen w-[90px] transform transition-transform duration-300 ease-out">
                        <SidebarContent />
                        
                        {/* Bouton de fermeture */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute -right-12 top-4 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors duration-200 shadow-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;