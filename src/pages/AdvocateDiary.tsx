import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Bell, 
  Plus, 
  Search, 
  MoreVertical, 
  CalendarIcon,
  Maximize2,
  Minimize2,
  RotateCcw,
} from 'lucide-react';

// Type definitions
interface Case {
  id: string;
  title: string;
  court: string;
  nextHearing: string;
  status: 'upcoming' | 'completed' | 'pending';
  documents: string[];
}

interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
}

const mockCases: Case[] = [
  {
    id: '1',
    title: 'Smith vs. Tech Corp',
    court: 'Supreme Court',
    nextHearing: '2025-03-15',
    status: 'upcoming',
    documents: ['Complaint.pdf', 'Evidence A.pdf', 'Witness Statement.pdf']
  },
  {
    id: '2',
    title: 'Johnson Property Dispute',
    court: 'High Court',
    nextHearing: '2025-04-02',
    status: 'pending',
    documents: ['Property Deed.pdf', 'Survey Report.pdf']
  },
  {
    id: '3',
    title: 'Corporate Merger Review',
    court: 'Commercial Court',
    nextHearing: '2025-03-20',
    status: 'upcoming',
    documents: ['Merger Agreement.pdf', 'Financial Reports.pdf']
  }
];

const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'File Motion for Smith Case',
    date: '2025-03-10',
    time: '09:00',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Client Meeting - Johnson',
    date: '2025-03-12',
    time: '14:30',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Document Review',
    date: '2025-03-14',
    time: '11:00',
    priority: 'low'
  }
];

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const AdvocateDiary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cases' | 'calendar' | 'reminders'>('cases');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const priorityColors = {
    high: 'bg-primary/10 text-primary',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  const statusColors = {
    upcoming: 'bg-primary/10 text-primary',
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  const handleCaseClick = (caseId: string) => {
    setSelectedCase(selectedCase === caseId ? null : caseId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-secondary/10"
    >
      <motion.div 
        layout
        className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out 
          ${isExpanded ? 'w-full h-full' : 'w-[90%] h-[85vh]'}`}
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50"
        >
          <h2 className="flex items-center space-x-2 text-2xl font-bold text-primary">
            <FileText className="w-6 h-6 text-primary" />
            <span>Advocate Diary</span>
          </h2>
          <div className="flex space-x-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)} 
              className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100"
            >
              {isExpanded ? 
                <Minimize2 className="w-5 h-5 text-gray-600" /> : 
                <Maximize2 className="w-5 h-5 text-gray-600" />
              }
            </motion.button>
            <motion.button 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-col h-[calc(100%-4rem)]">
          {/* Search and Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-gray-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search cases, documents, or reminders..."
                  className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 text-white rounded-lg bg-primary hover:bg-primary/90"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Case
              </motion.button>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex px-4 space-x-4 border-b"
          >
            {[
              { id: 'cases', label: 'Cases', icon: FileText },
              { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
              { id: 'reminders', label: 'Reminders', icon: Bell }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center px-4 py-2 space-x-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-6 p-6 md:grid-cols-3">
              {/* Cases List */}
              <div className="md:col-span-2">
                <AnimatePresence>
                  {mockCases.map((case_) => (
                    <motion.div
                      key={case_.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 mb-4 transition-all duration-200 border rounded-lg hover:shadow-md"
                      onClick={() => handleCaseClick(case_.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-primary">{case_.title}</h3>
                          <p className="text-sm text-gray-600">{case_.court}</p>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </motion.button>
                      </div>
                      
                      <div className="flex items-center mt-4 space-x-4">
                        <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                          statusColors[case_.status]
                        }`}>
                          {case_.status.charAt(0).toUpperCase() + case_.status.slice(1)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          Next Hearing: {formatDate(case_.nextHearing)}
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedCase === case_.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4"
                          >
                            <p className="mb-2 text-sm font-medium text-gray-700">Documents:</p>
                            <div className="flex flex-wrap gap-2">
                              {case_.documents.map((doc, index) => (
                                <motion.span
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex items-center px-2 py-1 text-xs rounded-full text-primary bg-primary/10"
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  {doc}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Reminders Panel */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Calendar Widget */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h2 className="mb-4 text-xl font-semibold text-primary">Calendar</h2>
                  <div className="p-4 text-center border rounded-lg">
                    <Calendar className="w-full" />
                  </div>
                </div>

                {/* Upcoming Reminders */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h2 className="mb-4 text-xl font-semibold text-primary">Upcoming Reminders</h2>
                  <AnimatePresence>
                    {mockReminders.map((reminder) => (
                      <motion.div
                        key={reminder.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between p-3 mb-3 transition-colors border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <h3 className="font-medium text-primary">{reminder.title}</h3>
                          <div className="flex items-center mt-1 space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(reminder.date)} at {reminder.time}</span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                          priorityColors[reminder.priority]
                        }`}>
                          {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-4 text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-5 h-5" />
                    Add Reminder
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvocateDiary;