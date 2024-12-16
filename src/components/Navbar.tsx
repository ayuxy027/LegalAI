import React, { useState, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Scale, Menu, X, LogIn, UserPlus } from 'lucide-react';

interface NavItem {
  label: string;
  id: string;
  path: string;
}

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: ReadonlyArray<NavItem> = useMemo(() => [
    { label: 'Summarisation', id: 'summarisation', path: '/summarisation' },
    { label: 'Transcript', id: 'transcript', path: '/transcript' },
    { label: 'Document Query', id: 'doc-query', path: '/query' },
    { label: 'Draft', id: 'draft', path: '/draft' },
    { label: 'Advocate Diary', id: 'advocate-diary', path: '/advocate-diary' },
    { label: 'Document Sharing', id: 'document-sharing', path: '/document-sharing' },
  ], []);

  const handleScroll = useCallback(() => {
    setIsScrolled(scrollY.get() > 20);
  }, [scrollY]);

  useMotionValueEvent(scrollY, "change", handleScroll);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-lg shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left"
          style={{ scaleX: scrollY }}
        />

        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Scale className="w-8 h-8 text-primary" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-primary-dark bg-clip-text"
              >
                Legal AI
              </motion.span>
            </Link>

            <div className="items-center hidden space-x-8 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`text-gray-700 hover:text-primary ${
                    location.pathname === item.path ? 'font-semibold text-primary' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="items-center hidden space-x-4 md:flex">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-primary hover:bg-primary-dark"
              >
                <LogIn className="inline-block w-4 h-4 mr-2" />
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-md text-primary border-primary hover:bg-primary hover:text-white"
              >
                <UserPlus className="inline-block w-4 h-4 mr-2" />
                Sign Up
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 md:hidden"
              onClick={toggleMobileMenu}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                  >
                    <Menu className="w-6 h-6 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 z-40 bg-white shadow-lg top-16"
          >
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`block py-2 text-gray-700 hover:text-primary ${
                    location.pathname === item.path ? 'font-semibold text-primary' : ''
                  }`}
                  onClick={toggleMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col pt-2 space-y-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 text-sm font-medium text-white transition-colors rounded-md bg-primary hover:bg-primary-dark"
                >
                  <LogIn className="inline-block w-4 h-4 mr-2" />
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 text-sm font-medium transition-colors bg-white border rounded-md text-primary border-primary hover:bg-primary hover:text-white"
                >
                  <UserPlus className="inline-block w-4 h-4 mr-2" />
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;