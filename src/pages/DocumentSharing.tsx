import React, { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Download } from 'lucide-react';

// Enhanced type definitions
type FileType = File & { preview?: string };

interface FileInfo {
    name: string;
    size: number;
    type: string;
    downloadUrl: string; // For received documents
}

enum ProcessingStatus {
    Idle = 'idle',
    Uploading = 'uploading',
    Completed = 'completed',
    Error = 'error'
}

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

const DocumentSharing: React.FC = () => {
    const [file, setFile] = useState<FileType | null>(null);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.Idle);
    const [senderEmail, setSenderEmail] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [receivedDocuments, setReceivedDocuments] = useState<FileInfo[]>([ // Example received docs
        { name: 'CaseDetails.pdf', size: 102400, type: 'application/pdf', downloadUrl: '#' },
        { name: 'HearingNotes.docx', size: 204800, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', downloadUrl: '#' }
    ]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelection = useCallback((selectedFile: File) => {
        const typedFile = selectedFile as FileType;
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

    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFileSelection(selectedFile);
        }
    }, [handleFileSelection]);

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
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
                className="bg-white rounded-xl shadow-2xl w-[80%] h-[75vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <motion.div 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50"
                >
                    <div>
                        <h1 className="flex items-center space-x-2 text-3xl font-bold text-primary">
                            <FileText className="w-8 h-8 text-primary" />
                            <span>Document Sharing</span>
                        </h1>
                        <p className="mt-2 text-gray-600">Securely share files between judges and lawyers using blockchain functionalities.</p>
                    </div>
                </motion.div>

                {/* Content Area */}
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <div className="flex flex-col items-center justify-center p-6">
                        <AnimatePresence>
                            {!file && (
                                <motion.div
                                    key="file-upload"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center justify-center w-full h-64 transition-colors duration-200 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-primary"
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-12 h-12 mb-4 text-gray-400" />
                                    <p className="mb-2 text-gray-600">Drag and drop your file here</p>
                                    <p className="text-sm text-gray-400">or</p>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 mt-2 text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark"
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
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full"
                                >
                                    {/* File Details */}
                                    <div className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <FileText className="w-8 h-8 text-primary" />
                                            <div>
                                                <p className="font-medium">{fileInfo.name}</p>
                                                <p className="text-sm text-gray-500">{formatFileSize(fileInfo.size)}</p>
                                            </div>
                                        </div>
                                        <motion.button 
                                            whileHover={{ rotate: 90 }}
                                            onClick={removeFile} 
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="w-6 h-6" />
                                        </motion.button>
                                    </div>
                                    {/* Sender Email Input */}
                                    <div className="mb-4">
                                        <label htmlFor="senderEmail" className="block mb-2 font-medium text-gray-700">Enter Your Email Id</label>
                                        <input
                                            id="senderEmail"
                                            type="email"
                                            value={senderEmail}
                                            onChange={(e) => setSenderEmail(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                            placeholder="example@example.com"
                                        />
                                    </div>

                                    {/* Send Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={sendFile}
                                        className="w-full py-3 text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark"
                                    >
                                        Send File
                                    </motion.button>

                                    {status === ProcessingStatus.Error && (
                                        <div className="mt-4 text-red-500">{errorMessage}</div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Received Documents */}
                    <div className="p-6">
                        <h2 className="mb-4 text-2xl font-bold text-primary">Received Documents Till Now</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {receivedDocuments.map((doc, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-medium text-gray-700">{doc.name}</p>
                                            <p className="text-sm text-gray-500">{formatFileSize(doc.size)}</p>
                                        </div>
                                        <a href={doc.downloadUrl} download className="text-primary hover:text-primary-dark">
                                            <Download className="w-6 h-6" />
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