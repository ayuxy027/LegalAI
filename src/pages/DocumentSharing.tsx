import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Upload, FileText, X, Download } from 'lucide-react';

// Enhanced type definitions
type FileType = File & { preview?: string };

interface FileInfo {
    name: string;
    size: number;
    type: string;
    downloadUrl: string;
}

enum ProcessingStatus {
    Idle = 'idle',
    Uploading = 'uploading',
    Completed = 'completed',
    Error = 'error'
}

// Utility functions
const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Animation variants
const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

const DocumentSharing: React.FC = () => {
    const [file, setFile] = useState<FileType | null>(null);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.Idle);
    const [senderEmail, setSenderEmail] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [receivedDocuments] = useState<FileInfo[]>([
        { name: 'CaseDetails.pdf', size: 102400, type: 'application/pdf', downloadUrl: '#' },
        { name: 'HearingNotes.docx', size: 204800, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', downloadUrl: '#' }
    ]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelection = useCallback((selectedFile: File) => {
        const typedFile: FileType = selectedFile;
        typedFile.preview = URL.createObjectURL(selectedFile);

        setFile(typedFile);
        setFileInfo({
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
            downloadUrl: ''
        });
        setStatus(ProcessingStatus.Idle);
        setErrorMessage('');
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFileSelection(selectedFile);
        }
    }, [handleFileSelection]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelection(droppedFile);
        }
    }, [handleFileSelection]);

    const removeFile = useCallback(() => {
        if (file?.preview) {
            URL.revokeObjectURL(file.preview);
        }

        setFile(null);
        setFileInfo(null);
        setStatus(ProcessingStatus.Idle);
        setErrorMessage('');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [file]);

    const sendFile = async () => {
        if (!file || !senderEmail) {
            setErrorMessage('Please select a file and enter a recipient email address.');
            return;
        }

        try {
            setStatus(ProcessingStatus.Uploading);

            // Simulate file sending
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setStatus(ProcessingStatus.Completed);
            alert(`File sent to ${senderEmail} successfully.`);
        } catch (error) {
            setStatus(ProcessingStatus.Error);
            setErrorMessage('Failed to send the file. Please try again.');
            console.log(error)
        }
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
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] md:h-[75vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <motion.div 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center justify-between p-4 border-b border-gray-200 md:flex-row md:p-6 bg-gray-50"
                >
                    <div className="mb-4 text-center md:text-left md:mb-0">
                        <h1 className="flex items-center justify-center space-x-2 text-2xl font-bold md:justify-start md:text-3xl text-primary">
                            <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                            <span>Document Sharing</span>
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 md:text-base">Securely share files between judges and lawyers using blockchain functionalities.</p>
                    </div>
                </motion.div>

                {/* Content Area */}
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <div className="flex flex-col items-center justify-center p-4 md:p-6">
                        <AnimatePresence mode="wait">
                            {!file && (
                                <motion.div
                                    key="file-upload"
                                    variants={fadeInUp}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="flex flex-col items-center justify-center w-full h-48 transition-colors duration-200 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer md:h-64 hover:border-primary"
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-10 h-10 mb-4 text-gray-400 md:w-12 md:h-12" />
                                    <p className="mb-2 text-sm text-gray-600 md:text-base">Drag and drop your file here</p>
                                    <p className="text-xs text-gray-400 md:text-sm">or</p>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-3 py-1 mt-2 text-sm text-white transition-colors duration-200 rounded-md md:px-4 md:py-2 md:text-base bg-primary hover:bg-primary-dark"
                                    >
                                        Select File
                                    </motion.button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".txt,.pdf,.doc,.docx"
                                    />
                                </motion.div>
                            )}

                            {file && fileInfo && (
                                <motion.div 
                                    variants={fadeInUp}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="w-full"
                                >
                                    {/* File Details */}
                                    <div className="flex items-center justify-between p-3 mb-4 bg-gray-100 rounded-lg md:p-4">
                                        <div className="flex items-center space-x-2 md:space-x-4">
                                            <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium md:text-base">{fileInfo.name}</p>
                                                <p className="text-xs text-gray-500 md:text-sm">{formatFileSize(fileInfo.size)}</p>
                                            </div>
                                        </div>
                                        <motion.button 
                                            whileHover={{ rotate: 90 }}
                                            onClick={removeFile} 
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="w-5 h-5 md:w-6 md:h-6" />
                                        </motion.button>
                                    </div>
                                    {/* Sender Email Input */}
                                    <div className="mb-4">
                                        <label htmlFor="senderEmail" className="block mb-2 text-sm font-medium text-gray-700 md:text-base">Enter Your Email Id</label>
                                        <input
                                            id="senderEmail"
                                            type="email"
                                            value={senderEmail}
                                            onChange={(e) => setSenderEmail(e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg md:px-4 md:py-2 md:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            placeholder="example@example.com"
                                        />
                                    </div>

                                    {/* Send Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={sendFile}
                                        className="w-full py-2 text-sm text-white transition-colors duration-200 rounded-md md:py-3 md:text-base bg-primary hover:bg-primary-dark"
                                    >
                                        Send File
                                    </motion.button>

                                    {status === ProcessingStatus.Error && (
                                        <div className="mt-4 text-sm text-red-500 md:text-base">{errorMessage}</div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Received Documents */}
                    <div className="p-4 md:p-6">
                        <h2 className="mb-4 text-xl font-bold md:text-2xl text-primary">Received Documents Till Now</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {receivedDocuments.map((doc, index) => (
                                <motion.div 
                                    key={index}
                                    variants={fadeInUp}
                                    initial="initial"
                                    animate="animate"
                                    className="p-3 bg-gray-100 rounded-lg shadow md:p-4 hover:shadow-lg"
                                >
                                    <div className="flex items-center justify-between mb-2 md:mb-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 md:text-base">{doc.name}</p>
                                            <p className="text-xs text-gray-500 md:text-sm">{formatFileSize(doc.size)}</p>
                                        </div>
                                        <a href={doc.downloadUrl} download className="text-primary hover:text-primary-dark">
                                            <Download className="w-5 h-5 md:w-6 md:h-6" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DocumentSharing;

