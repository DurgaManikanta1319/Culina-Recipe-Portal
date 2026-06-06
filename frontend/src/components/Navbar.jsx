import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Utensils, Home, BookOpen, PlusSquare, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null; // Don't show navbar if not logged in

    const NavLinks = () => (
        <>
            <Link to="/" className="flex items-center space-x-1 hover:text-orange-200 transition">
                <Home size={18} /> <span>Home</span>
            </Link>
            <Link to="/recipes" className="flex items-center space-x-1 hover:text-orange-200 transition">
                <BookOpen size={18} /> <span>Recipes</span>
            </Link>
            <Link to="/create-recipe" className="flex items-center space-x-1 hover:text-orange-200 transition">
                <PlusSquare size={18} /> <span>Create</span>
            </Link>
            <Link to="/kitchen" className="flex items-center space-x-1 hover:text-orange-200 transition">
                <User size={18} /> <span>My Kitchen</span>
            </Link>
            <Link to="/community" className="flex items-center space-x-1 hover:text-orange-200 transition">
                <Utensils size={18} /> <span>Community</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-red-200 transition bg-orange-700 px-3 py-1 rounded-md">
                <LogOut size={18} /> <span>Logout</span>
            </button>
        </>
    );

    return (
        <nav className="bg-orange-500 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tighter">
                            <Utensils className="h-8 w-8 text-white" />
                            <span>Culina</span>
                        </Link>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <NavLinks />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-orange-200 focus:outline-none">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-orange-600 px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col gap-3 pb-4">
                    <NavLinks />
                </div>
            )}
        </nav>
    );
};

export default Navbar;
