// src/components/Navbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link} from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { 
  Scale, 
  Menu, 
  X,
  ChevronDown, 
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Users,
  FileText,
  Sparkles,
  Archive,
  Clock,
  Star
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifications = [
    { id: 1, title: 'New case assigned', time: '2m ago', unread: true },
    { id: 2, title: 'Document review pending', time: '1h ago', unread: true },
    { id: 3, title: 'Meeting scheduled', time: '3h ago', unread: false },
  ];
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  const { scrollY } = useScroll();
  const searchRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll animation logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const navItems = [
    {
      label: 'Solutions',
      id: 'solutions',
      dropdownItems: [
        { 
          label: 'For Judges', 
          path: '/judge', 
          icon: <Scale className="w-4 h-4" />,
          description: 'Streamline case management and decision making'
        },
        { 
          label: 'For Lawyers', 
          path: '/lawyer', 
          icon: <BookOpen className="w-4 h-4" />,
          description: 'Enhanced legal research and document preparation'
        },
        { 
          label: 'For Users', 
          path: '/user', 
          icon: <User className="w-4 h-4" />,
          description: 'Easy access to legal services and case tracking'
        },
      ]
    },
    {
      label: 'Resources',
      id: 'resources',
      dropdownItems: [
        { 
          label: 'Documentation', 
          path: '/docs', 
          icon: <BookOpen className="w-4 h-4" />,
          description: 'Detailed guides and API documentation'
        },
        { 
          label: 'Community', 
          path: '/community', 
          icon: <Users className="w-4 h-4" />,
          description: 'Join our growing legal tech community'
        },
        { 
          label: 'Tutorials', 
          path: '/tutorials', 
          icon: <MessageSquare className="w-4 h-4" />,
          description: 'Learn through interactive tutorials'
        },
      ]
    },
    { 
      label: 'Pricing',
      id: 'pricing',
      features: [
        { icon: <Star />, label: 'Premium Features' },
        { icon: <Clock />, label: 'Real-time Support' },
        { icon: <Archive />, label: 'Unlimited Storage' },
      ]
    },
  ];

  const searchResults = [
    { type: 'page', title: 'Dashboard', path: '/dashboard' },
    { type: 'doc', title: 'Legal Documentation', path: '/docs' },
    { type: 'feature', title: 'AI Analysis', path: '/features' },
  ].filter(result => 
    searchQuery && result.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const DropdownContent = ({ item }: { item: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute left-0 w-64 mt-2 overflow-hidden bg-white rounded-lg shadow-lg top-full"
    >
      <div className="p-4">
        <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-400 uppercase">
          {item.label}
        </h3>
        <div className="space-y-4">
          {item.dropdownItems?.map((dropdownItem: any, idx: number) => (
            <Link
              key={idx}
              to={dropdownItem.path}
              className="flex items-start p-2 transition-colors rounded-lg group hover:bg-gray-50"
            >
              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 transition-colors rounded-lg bg-primary/10 group-hover:bg-primary/20">
                {dropdownItem.icon}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{dropdownItem.label}</p>
                <p className="text-xs text-gray-500">{dropdownItem.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {item.features && (
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            {item.features.map((feature: any, idx: number) => (
              <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                {feature.icon}
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

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
        {/* Progress Indicator */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left"
          style={{ scaleX: scrollY }}
        />

        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo with animation */}
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

            {/* Desktop Navigation with Mega Menu */}
            <div className="items-center hidden space-x-8 md:flex">
              {navItems.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setActiveTab(item.id)}
                  onMouseLeave={() => setActiveTab(null)}
                >
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-primary">
                    <span>{item.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      activeTab === item.id ? 'rotate-180' : ''
                    }`} />
                  </button>

                  <AnimatePresence>
                    {activeTab === item.id && <DropdownContent item={item} />}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Section with Notifications and Profile */}
            <div className="items-center hidden space-x-4 md:flex">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 transition-colors rounded-full hover:bg-gray-100"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </motion.button>

              {/* Notifications */}
              <div ref={notificationRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 rounded-full hover:bg-gray-100"
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 py-2 mt-2 bg-white rounded-lg shadow-lg w-80"
                    >
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                            notification.unread ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center p-2 space-x-2 rounded-full hover:bg-gray-100"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-lg shadow-lg"
                    >
                      {[
                        { label: 'Profile', icon: <User className="w-4 h-4" /> },
                        { label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                        { label: 'Help', icon: <HelpCircle className="w-4 h-4" /> },
                        { label: 'Logout', icon: <LogOut className="w-4 h-4" /> },
                      ].map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 5 }}
                          className="flex items-center w-full px-4 py-2 space-x-2 text-gray-700 hover:bg-gray-50"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

      {/* Search Modal with Enhanced UX */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20 bg-black/50"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: -50 }}
              className="w-full max-w-2xl bg-white rounded-lg shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-center px-4 py-2 space-x-2 bg-gray-100 rounded-lg">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="Search anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>

                {searchResults.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {searchResults.map((result, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center p-2 space-x-2 rounded-lg cursor-pointer hover:bg-gray-100"
                      >
                        {result.type === 'page' && <BookOpen className="w-4 h-4 text-blue-500" />}
                        {result.type === 'doc' && <FileText className="w-4 h-4 text-green-500" />}
                        {result.type === 'feature' && <Sparkles className="w-4 h-4 text-purple-500" />}
                        <span>{result.title}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && (
                  <div className="mt-4 text-center text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;