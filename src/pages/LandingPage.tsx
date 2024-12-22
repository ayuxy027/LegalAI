import React, { useEffect, useCallback, useMemo } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import {
  Scale,
  Shield,
  Brain,
  ArrowRight,
  Users,
  MessageSquare,
  Clock,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import homeimg from "../assets/homeimg.png";

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
  const navigate = useNavigate();
  const controls = useAnimation();

  const startAnimation = useCallback(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }));
  }, [controls]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const features: Feature[] = useMemo(
    () => [
      {
        icon: <Brain className="w-6 h-6" />,
        title: "AI-Powered Legal Analysis",
        description:
          "Advanced machine learning algorithms provide instant legal insights and case analysis",
      },
      {
        icon: <Shield className="w-6 h-6" />,
        title: "Secure Document Management",
        description:
          "Bank-grade encryption for all your sensitive legal documents",
      },
      {
        icon: <MessageSquare className="w-6 h-6" />,
        title: "Real-time Collaboration",
        description:
          "Seamless communication between clients, lawyers, and legal staff",
      },
    ],
    []
  );

  const statistics: Statistic[] = useMemo(
    () => [
      { value: "98%", label: "Success Rate" },
      { value: "50K+", label: "Cases Handled" },
      { value: "24/7", label: "Support" },
      { value: "100+", label: "Legal Experts" },
    ],
    []
  );

  const benefits: Benefit[] = useMemo(
    () => [
      {
        icon: <Clock />,
        text: "Save up to 70% of your time on legal research",
      },
      { icon: <Shield />, text: "Enterprise-grade security for your data" },
      { icon: <Users />, text: "Collaborate seamlessly with your team" },
      { icon: <Lock />, text: "GDPR and HIPAA compliant" },
    ],
    []
  );

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 shadow-lg">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <div className="text-2xl font-bold text-primary">Legal AI</div>
          <ul className="flex  space-x-6 text-gray-600">
            <li
              className="cursor-pointer hover:text-primary mt-2"
              onClick={() => scrollToSection("features")}
            >
              Features
            </li>
            <li
              className="cursor-pointer hover:text-primary mt-2"
              onClick={() => scrollToSection("statistics")}
            >
              Statistics
            </li>
            <li
              className="cursor-pointer hover:text-primary mt-2"
              onClick={() => scrollToSection("benefits")}
            >
              Benefits
            </li>
            <li
              className="cursor-pointer hover:text-primary mt-2"
              onClick={() => scrollToSection("footer")}
            >
              Contact
            </li>
            <li
              className="cursor-pointer px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark"
              onClick={() => navigate("/login")}
            >
              Login
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="container px-4 pt-20 pb-32 mx-auto"
        >
          <div className="flex flex-col items-center max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-3 mb-6 rounded-full bg-primary/10"
            >
              <Scale className="w-10 h-10 text-primary" />
            </motion.div>
            <motion.h1
              className="mb-6 text-5xl font-bold text-transparent md:text-7xl bg-gradient-to-r from-primary to-primary-dark bg-clip-text"
              variants={fadeInUp}
            >
              Legal Innovation Meets Artificial Intelligence
            </motion.h1>
            <motion.p
              className="mb-8 text-xl text-gray-600"
              variants={fadeInUp}
            >
              Transform your legal practice with cutting-edge AI technology.
              Streamline workflows, enhance decision-making, and deliver
              superior legal services.
            </motion.p>
            <motion.div className="flex gap-4" variants={fadeInUp}>
              <button className="flex items-center gap-2 px-8 py-3 rounded-full btn btn-primary">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-3 rounded-full btn btn-outline">
                Watch Demo
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <motion.div
            className="grid gap-8 md:grid-cols-3"
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
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="py-20 bg-primary/5">
        <div className="container px-4 mx-auto">
          <motion.div
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
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
                <div className="mb-2 text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <motion.div
            className="grid items-center gap-12 md:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="ml-8">
              <h2 className="mb-6 text-4xl font-bold">Why Choose Legal AI?</h2>
              <div className="space-y-4">
                {benefits.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    custom={index}
                    animate={controls}
                  >
                    <div className="text-primary">{item.icon}</div>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              className="relative h-[400px]"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 overflow-hidden bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl">
                <img
                  src={homeimg}
                  alt="Legal AI dashboard"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container px-4 mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="mb-6 text-4xl font-bold text-white">
              Ready to Transform Your Legal Practice?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/80">
              Join thousands of legal professionals who are already using Legal
              AI to streamline their practice.
            </p>
            <button className="px-8 py-3 bg-white rounded-full btn text-primary hover:bg-gray-100">
              Start Free Trial
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="py-12 text-white bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            {/* About Section */}
            <div>
              <Scale className="w-10 h-10 mb-4 text-primary" />
              <p className="text-gray-400">
                At Legal AI, we empower legal professionals by leveraging AI to
                streamline research, documentation, and case management within
                the Indian legal ecosystem.
              </p>
            </div>

            {/* Product Section */}
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="cursor-pointer hover:text-primary">
                  Case Research Tool
                </li>
                <li className="cursor-pointer hover:text-primary">
                  Legal Document Drafting
                </li>
                <li className="cursor-pointer hover:text-primary">
                  Case Management
                </li>
                <li className="cursor-pointer hover:text-primary">
                  Analytics Dashboard
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="cursor-pointer hover:text-primary">About Us</li>
                <li className="cursor-pointer hover:text-primary">Careers</li>
                <li className="cursor-pointer hover:text-primary">Press</li>
                <li className="cursor-pointer hover:text-primary">Contact</li>
              </ul>
            </div>

            {/* Resources Section */}
            <div>
              <h3 className="mb-4 font-semibold">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="cursor-pointer hover:text-primary">Blog</li>
                <li className="cursor-pointer hover:text-primary">
                  Legal Insights
                </li>
                <li className="cursor-pointer hover:text-primary">
                  Case Studies
                </li>
                <li className="cursor-pointer hover:text-primary">
                  Help Center
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-12 text-center text-gray-400 border-t border-gray-800">
            <p>© {new Date().getFullYear()} Legal AI. All rights reserved.</p>
            <p>Made with ❤️ by Team PartTimeHumans</p>
            <p>
              Follow us on
              <a
                href="https://x.com/mai3dalvi"
                className="mx-1 text-primary hover:underline"
              >
                X
              </a>
              &
              <a
                href="https://www.linkedin.com/in/maitridalvi13/"
                className="mx-1 text-primary hover:underline"
              >
                LinkedIn
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
