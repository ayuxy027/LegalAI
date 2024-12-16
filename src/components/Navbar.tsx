import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Scale, Menu, X, LogIn, UserPlus, Shield, Users, Gavel } from 'lucide-react';

// Strict Role Type Definition
type UserRole = 'User' | 'Lawyer' | 'Judge';

// Type Guard for User Role
function isValidRole(role: unknown): role is UserRole {
  return ['User', 'Lawyer', 'Judge'].includes(role as UserRole);
}

// Strict Navigation Item Interface
interface NavItem {
  readonly label: string;
  readonly id: string;
  readonly path: string;
  readonly roles: ReadonlyArray<UserRole>;
}

// Type-safe Local Storage Interaction
const getRoleFromStorage = (): UserRole => {
  console.log('Attempting to retrieve role from localStorage');
  const storedRole = localStorage.getItem('role');
  console.log('Retrieved role from localStorage:', storedRole);
  return isValidRole(storedRole) ? storedRole : 'User';
};

const Navbar: React.FC = () => {
  // Strict State Management
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const initialRole = getRoleFromStorage();
    console.log('Initial role set:', initialRole);
    return initialRole;
  });

  // Router Hooks
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();

  // Immutable and Type-Safe Navigation Items
  const navItems: ReadonlyArray<NavItem> = useMemo(() => {
    console.log('Initializing navigation items');
    return [
      { 
        label: 'Summarisation', 
        id: 'summarisation', 
        path: '/summarisation', 
        roles: ['Lawyer', 'Judge', 'User'] 
      },
      { 
        label: 'Transcript', 
        id: 'transcript', 
        path: '/transcript', 
        roles: ['Lawyer', 'Judge'] 
      },
      { 
        label: 'Document Query', 
        id: 'doc-query', 
        path: '/query', 
        roles: ['Lawyer', 'Judge'] 
      },
      { 
        label: 'Draft', 
        id: 'draft', 
        path: '/draft', 
        roles: ['Lawyer'] 
      },
      { 
        label: 'Advocate Diary', 
        id: 'advocate-diary', 
        path: '/advocate-diary', 
        roles: ['Lawyer'] 
      },
      { 
        label: 'Document Sharing', 
        id: 'document-sharing', 
        path: '/document-sharing', 
        roles: ['Lawyer', 'Judge'] 
      },
    ];
  }, []);

  // Role Storage and Synchronization Effect
  useEffect(() => {
    console.log('Role synchronization effect triggered');
    const storedRole = localStorage.getItem('role');
    
    console.log('Stored role check:', storedRole);
    // Strict type checking before setting role
    if (isValidRole(storedRole)) {
      console.log('Setting role from localStorage:', storedRole);
      setCurrentRole(storedRole);
    } else {
      console.warn('Invalid role found in localStorage:', storedRole);
    }
  }, []);

  // Scroll Event Handler with Strict Type Safety
  const handleScroll = useCallback((): void => {
    const currentScrollY = scrollY.get();
    console.log('Current scroll position:', currentScrollY);
    setIsScrolled(currentScrollY > 20);
  }, [scrollY]);

  // Attach scroll event with motion value event
  useMotionValueEvent(scrollY, "change", handleScroll);

  // Mobile Menu Toggle
  const toggleMobileMenu = useCallback((): void => {
    console.log('Toggling mobile menu');
    setIsMobileMenuOpen(prevState => {
      console.log('Mobile menu state changed:', !prevState);
      return !prevState;
    });
  }, []);

  // Filtered Navigation Items Based on Role
  const filteredNavItems = useMemo((): ReadonlyArray<NavItem> => {
    console.log('Filtering nav items for role:', currentRole);
    const filtered = navItems.filter(item => item.roles.includes(currentRole));
    console.log('Filtered nav items:', filtered.map(item => item.label));
    return filtered;
  }, [navItems, currentRole]);

  // Strict Role Change Handler
  const handleRoleChange = useCallback((role: UserRole): void => {
    console.log('Attempting to change role to:', role);
    
    // Validate role before setting
    if (isValidRole(role)) {
      console.log('Role is valid. Proceeding with change.');
      try {
        localStorage.setItem('role', role);
        console.log('Role stored in localStorage successfully');
        
        setCurrentRole(role);
        console.log('Current role updated');
        
        // Close mobile menu
        setIsMobileMenuOpen(false);
        console.log('Mobile menu closed');
        
        // Type-safe route mapping
        const defaultRoutes: Readonly<Record<UserRole, string>> = {
          'Lawyer': '/advocate-diary',
          'Judge': '/transcript',
          'User': '/summarisation'
        };
        
        const targetRoute = defaultRoutes[role];
        console.log('Navigating to default route:', targetRoute);
        navigate(targetRoute);
      } catch (error) {
        console.error('Error changing role:', error);
      }
    } else {
      console.warn('Invalid role attempted:', role);
    }
  }, [navigate]);

  // Role Selection Button Renderer
  const RoleButton: React.FC<{
    role: UserRole;
    icon: React.ElementType;
  }> = React.memo(({ role, icon: Icon }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        console.log(`Role button clicked: ${role}`);
        handleRoleChange(role);
      }}
      className={`p-2 rounded-full ${
        currentRole === role 
          ? 'bg-primary text-white' 
          : 'bg-gray-200 text-gray-700'
      }`}
      title={`${role} Role`}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  ));

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
            {/* Logo Section */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              onClick={() => console.log('Logo clicked, navigating to home')}
            >
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

            {/* Desktop Navigation */}
            <div className="items-center hidden space-x-8 md:flex">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`text-gray-700 hover:text-primary ${
                    location.pathname === item.path ? 'font-semibold text-primary' : ''
                  }`}
                  onClick={() => console.log(`Navigating to: ${item.path}`)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth and Role Selection */}
            <div className="items-center hidden space-x-4 md:flex">
              {/* Role Selection Dropdown */}
              <div className="flex items-center space-x-2">
                <RoleButton role="User" icon={Users} />
                <RoleButton role="Lawyer" icon={Shield} />
                <RoleButton role="Judge" icon={Gavel} />
              </div>

              {/* Login and Signup Buttons */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('Login button clicked');
                  navigate('/login');
                }}
                className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-primary hover:bg-primary-dark"
              >
                <LogIn className="inline-block w-4 h-4 mr-2" />
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('Signup button clicked');
                  navigate('/signup');
                }}
                className="px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-md text-primary border-primary hover:bg-primary hover:text-white"
              >
                <UserPlus className="inline-block w-4 h-4 mr-2" />
                Sign Up
              </motion.button>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 md:hidden"
              onClick={() => {
                console.log('Mobile menu toggle clicked');
                toggleMobileMenu();
              }}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 z-40 bg-white shadow-lg top-16"
            onAnimationStart={() => console.log('Mobile menu animation started')}
            onAnimationComplete={() => console.log('Mobile menu animation completed')}
          >
            <div className="px-4 py-2 space-y-2">
              {/* Role Selection for Mobile */}
              <div className="flex justify-center pb-4 space-x-4 border-b border-gray-200">
                <RoleButton role="User" icon={Users} />
                <RoleButton role="Lawyer" icon={Shield} />
                <RoleButton role="Judge" icon={Gavel} />
              </div>

              {/* Mobile Navigation Items */}
              {filteredNavItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`block py-2 text-gray-700 hover:text-primary ${
                    location.pathname === item.path ? 'font-semibold text-primary' : ''
                  }`}
                  onClick={() => {
                    console.log(`Mobile navigation to: ${item.path}`);
                    toggleMobileMenu();
                  }}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col pt-2 space-y-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    console.log('Mobile login button clicked');
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
                    console.log('Mobile signup button clicked');
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