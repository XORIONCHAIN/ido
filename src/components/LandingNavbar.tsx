import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaBars } from "react-icons/fa"; // Added FaBars for hamburger menu
import logo from '/logo.svg';

const LandingNavbar = ({ isOpen, setIsOpen, navItems, handleNavClick, navigate }) => (
  <section className="py-4 md:py-8 fixed w-full top-0 z-50 glass-card">
    <div className="container max-w-5xl mx-auto px-4">
      <div className="border border-border rounded-[27px] md:rounded-full glass-card max-w-5xl mx-auto">
        <div className="grid grid-cols-3 p-2 px-4 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer col-span-2 md:col-span-1" onClick={() => navigate('/')}>
            <img src={logo} alt="company-logo" className="h-8 w-auto md:h-7" />
            <span className="text-xl font-semibold text-white">XORION</span>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden flex justify-end">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              <FaBars size={24} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-center items-center col-span-1">
            <nav className="flex gap-4 font-medium">
              {navItems.map((link) => (
                <a
                  href={link.href}
                  key={link.name}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Explore Button */}
          <div className="hidden md:flex justify-end col-span-1">
            <button
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-400 text-white rounded-full px-6 py-2 font-semibold shadow backdrop-blur-xl hover:from-purple-500 hover:to-pink-500 transition-all border border-white/10"
              onClick={() => navigate('/explorer')}
            >
              Explore
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col items-center gap-4 py-4 bg-gray-900/90">
                {navItems.map((link) => (
                  <a
                    href={link.href}
                    key={link.name}
                    onClick={(e) => {
                      handleNavClick(e, link.href);
                      setIsOpen(false);
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors text-lg"
                  >
                    {link.name}
                  </a>
                ))}
                <button
                  className="w-full max-w-[200px] bg-gradient-to-r from-pink-500 via-purple-500 to-pink-400 text-white rounded-full py-2 font-semibold shadow hover:from-purple-500 hover:to-pink-500 transition-all border border-white/10"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/explorer');
                  }}
                >
                  Explore
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </section>
);

export default LandingNavbar;