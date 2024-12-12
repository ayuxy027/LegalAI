import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { TypeAnimation } from 'react-type-animation';

// Types
type Sender = 'user' | 'ai';

interface Message {
  text: string;
  sender: Sender;
  isTyping?: boolean;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

interface MessageRendererProps {
  message: Message;
  index: number;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

interface ApiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>
    }
  }>
}

// Custom components for markdown rendering
const MarkdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  h2: ({ children }) => (
    <h2 className="pb-1 mt-3 mb-2 text-lg font-bold border-b text-primary border-secondary">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-2 mb-1 font-semibold text-md text-primary-dark">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="my-2 space-y-1 list-disc list-inside">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 space-y-1 list-decimal list-inside">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-gray-700">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="py-1 pl-3 my-2 text-sm italic border-l-4 rounded border-primary/30 bg-secondary/20">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto border rounded-lg border-secondary">
      <table className="min-w-full divide-y divide-secondary">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-sm font-semibold bg-secondary/30 text-primary-dark">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-sm border-t border-secondary/30">
      {children}
    </td>
  ),
  code: ({ children }) => (
    typeof children === 'string' && children.startsWith('inline') ?
    <code className="bg-secondary/30 px-1 py-0.5 rounded text-primary-dark text-sm">
      {children.slice(7)}
    </code> :
    <pre className="p-3 my-2 overflow-x-auto text-sm rounded-lg bg-secondary/20">
      {children}
    </pre>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 my-1.5 text-sm">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-primary-dark">
      {children}
    </strong>
  ),
};

const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  variant = 'default', 
  size = 'default', 
  children, 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center text-sm font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-full";
  const variants = {
    default: "bg-primary text-white hover:bg-primary-dark",
    ghost: "text-primary hover:bg-secondary",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 py-1 text-xs",
    lg: "h-12 px-6 py-3",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`flex h-12 w-full rounded-full border border-primary bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      {...props}
    />
  );
};

const ThinkingIndicator: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="flex justify-start"
  >
    <div className="bg-secondary p-3 rounded-2xl max-w-[70%]">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="flex items-center font-medium text-primary"
      >
        <svg className="w-5 h-5 mr-3 -ml-1 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Thinking...
      </motion.div>
    </div>
  </motion.div>
);

const MessageRenderer: React.FC<MessageRendererProps> = ({ message }) => {
  if (message.sender === 'user') {
    return (
      <div className="max-w-[80%] p-3 rounded-2xl shadow-md bg-gradient-to-br from-primary to-primary-dark text-white text-sm">
        {message.text}
      </div>
    );
  }

  return (
    <div className="max-w-[80%] p-4 rounded-2xl shadow-md bg-white text-gray-800 border border-secondary/50">
    {message.isTyping ? (
      <TypeAnimation
        sequence={[message.text]}
        speed={70}
        cursor={false}
        wrapper="div"
        repeat={0}
      />
    ) : (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={MarkdownComponents}
        className="prose-sm prose max-w-none"
      >
        {message.text}
      </ReactMarkdown>
    )}
  </div>
  );
};

const LegalAIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;
  const AI_PROMPT = import.meta.env.VITE_AI_PROMPT;

  const predefinedQuestions = [
    "Legal rights",
    "Court procedures",
    "Legal documents",
    "Criminal law",
    "Civil law",
    "Constitutional law",
  ];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');

    try {
      const response = await axios.post<ApiResponse>(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `${AI_PROMPT}\n\nUser query: ${input}`
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai', isTyping: true }]);
    } catch (error) {
      console.error('Error fetching response from API:', error);
      setMessages(prev => [...prev, { 
        text: "I apologize, there was an error processing your request. Please try again later.", 
        sender: 'ai',
        isTyping: true 
      }]);
    }

    setIsLoading(false);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="fixed z-50 bottom-4 right-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              width: isExpanded ? '550px' : '400px',
              height: isExpanded ? '85vh' : '650px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 25 }}
            className="flex flex-col overflow-hidden bg-white shadow-2xl rounded-3xl"
            style={{
              boxShadow: '0 10px 25px -5px rgba(200, 155, 0, 0.5), 0 8px 10px -6px rgba(200, 155, 0, 0.3)',
            }}
          >
            <motion.div
              className="flex items-center justify-between p-6 text-white cursor-move bg-gradient-to-r from-primary to-primary-dark rounded-t-3xl"
              whileHover={{ backgroundImage: 'linear-gradient(to right, #C89B00, #9C7F00)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 text-lg font-bold bg-white rounded-full shadow-inner text-primary">
                  AI
                </div>
                <div>
                  <h3 className="font-semibold text-md">Legal AI Assistant</h3>
                  <p className="text-sm text-secondary">Your legal guide</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleClearChat} className="text-white hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-white hover:text-black">
                  {isExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            </motion.div>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-background to-white">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <MessageRenderer
                      message={message}
                      index={index}
                      messages={messages}
                      setMessages={setMessages}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && <ThinkingIndicator />}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-6 bg-gradient-to-b from-white to-background rounded-b-3xl">
              <div className="flex mb-4 space-x-2">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about legal matters..."
                  className="flex-grow shadow-inner bg-background"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="transition-shadow rounded-full shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {predefinedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setInput(question)}
                    className="text-xs transition-colors border rounded-full border-primary hover:bg-secondary"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="p-4 text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-primary to-primary-dark hover:shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default LegalAIChatbot;