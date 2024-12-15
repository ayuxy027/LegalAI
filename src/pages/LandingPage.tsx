import React, { useEffect, useCallback, useMemo } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { Scale, Shield, Brain, ArrowRight, Users, MessageSquare, Clock, Lock } from 'lucide-react';

// Import the image using a more type-safe approach
import homeimg from '../assets/homeimg.png';

// Define types for our data structures
interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface Statistic {
  value: string;
  label: string;
}

interface Benefit {
  icon: JSX.Element;
  text: string;
}

const LandingPage: React.FC = () => {
  const controls = useAnimation();

  const startAnimation = useCallback(() => {
    controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 }
    }));
  }, [controls]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  // Memoize data structures to prevent unnecessary re-renders
  const features: Feature[] = useMemo(() => [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Legal Analysis",
      description: "Advanced machine learning algorithms provide instant legal insights and case analysis"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Document Management",
      description: "Bank-grade encryption for all your sensitive legal documents"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description: "Seamless communication between clients, lawyers, and legal staff"
    }
  ], []);

  const statistics: Statistic[] = useMemo(() => [
    { value: "98%", label: "Success Rate" },
    { value: "50K+", label: "Cases Handled" },
    { value: "24/7", label: "Support" },
    { value: "100+", label: "Legal Experts" }
  ], []);

  const benefits: Benefit[] = useMemo(() => [
    { icon: <Clock />, text: "Save up to 70% of your time on legal research" },
    { icon: <Shield />, text: "Enterprise-grade security for your data" },
    { icon: <Users />, text: "Collaborate seamlessly with your team" },
    { icon: <Lock />, text: "GDPR and HIPAA compliant" }
  ], []);

  // Define animation variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="container px-4 pt-20 pb-32 mx-auto sm:px-6 lg:px-8"
        >
          <div className="flex flex-col items-center max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-3 mb-6 rounded-full bg-primary/10"
            >
              <Scale className="w-8 h-8 text-primary sm:w-10 sm:h-10" />
            </motion.div>
            <motion.h1 
              className="mb-6 text-4xl font-bold text-transparent sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-primary-dark bg-clip-text"
              variants={fadeInUp}
            >
              Legal Innovation Meets Artificial Intelligence
            </motion.h1>
            <motion.p 
              className="mb-8 text-lg text-gray-600 sm:text-xl lg:text-2xl"
              variants={fadeInUp}
            >
              Transform your legal practice with cutting-edge AI technology. 
              Streamline workflows, enhance decision-making, and deliver superior legal services.
            </motion.p>
            <motion.div 
              className="flex flex-col gap-4 sm:flex-row"
              variants={fadeInUp}
            >
              <button className="flex items-center justify-center w-full gap-2 px-6 py-3 text-sm font-medium text-white rounded-full sm:w-auto btn btn-primary md:text-base lg:px-8 lg:py-4">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full px-6 py-3 text-sm font-medium rounded-full sm:w-auto btn btn-outline md:text-base lg:px-8 lg:py-4">
                Watch Demo
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/20"
              initial={{ 
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%'
              }}
              animate={{ 
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%'
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-white sm:py-20 lg:py-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div 
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 transition-shadow bg-white shadow-lg rounded-xl hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                custom={index}
                animate={controls}
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-600 sm:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-primary/5 sm:py-20 lg:py-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                custom={index}
                animate={controls}
              >
                <div className="mb-2 text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">{stat.value}</div>
                <div className="text-sm text-gray-600 sm:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white sm:py-20 lg:py-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div 
            className="grid items-center gap-12 lg:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Why Choose Legal AI?</h2>
              <div className="space-y-4">
                {benefits.map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-3"
                    custom={index}
                    animate={controls}
                  >
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm sm:text-base">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div 
              className="relative h-[300px] sm:h-[400px] lg:h-[500px]"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 overflow-hidden bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl">
                <img src={homeimg} alt="Legal AI dashboard" className="object-cover w-full h-full" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary sm:py-20 lg:py-24">
        <div className="container px-4 mx-auto text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Ready to Transform Your Legal Practice?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-sm text-white/80 sm:text-base lg:text-lg">
              Join thousands of legal professionals who are already using Legal AI to streamline their practice.
            </p>
            <button className="px-6 py-3 text-sm font-medium bg-white rounded-full btn text-primary hover:bg-gray-100 sm:text-base lg:px-8 lg:py-4">
              Start Free Trial
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white bg-gray-900 sm:py-16 lg:py-20">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* About Section */}
            <div>
              <Scale className="w-8 h-8 mb-4 text-primary sm:w-10 sm:h-10" />
              <p className="text-sm text-gray-400 sm:text-base">
                At Legal AI, we empower legal professionals by leveraging AI to streamline research, documentation, and case management within the Indian legal ecosystem.
              </p>
            </div>

            {/* Product Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold sm:text-xl">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400 sm:text-base">
                <li className="cursor-pointer hover:text-primary">Case Research Tool</li>
                <li className="cursor-pointer hover:text-primary">Legal Document Drafting</li>
                <li className="cursor-pointer hover:text-primary">Case Management</li>
                <li className="cursor-pointer hover:text-primary">Analytics Dashboard</li>
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold sm:text-xl">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400 sm:text-base">
                <li className="cursor-pointer hover:text-primary">About Us</li>
                <li className="cursor-pointer hover:text-primary">Careers</li>
                <li className="cursor-pointer hover:text-primary">Press</li>
                <li className="cursor-pointer hover:text-primary">Contact</li>
              </ul>
            </div>

            {/* Resources Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold sm:text-xl">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400 sm:text-base">
                <li className="cursor-pointer hover:text-primary">Blog</li>
                <li className="cursor-pointer hover:text-primary">Legal Insights</li>
                <li className="cursor-pointer hover:text-primary">Case Studies</li>
                <li className="cursor-pointer hover:text-primary">Help Center</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-12 text-center text-gray-400 border-t border-gray-800">
            <p className="text-sm sm:text-base">© {new Date().getFullYear()} Legal AI. All rights reserved.</p>
            <p className="text-sm sm:text-base">Made with ❤️ by Team PartTimeHumans</p>
            <p className="text-sm sm:text-base">
              Follow us on 
              <a href="https://x.com/mai3dalvi" className="mx-1 text-primary hover:underline">X</a>&
              <a href="https://www.linkedin.com/in/maitridalvi13/" className="mx-1 text-primary hover:underline">LinkedIn</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;