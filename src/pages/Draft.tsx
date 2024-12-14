import React, { useState, useCallback, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Showdown from 'showdown';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { generateDocument } from '../routes/route';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  File, 
  Loader, 
  AlertCircle, 
  CheckCircle,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';

// Enhanced Type Definitions
type TemplateType = 'Contract' | 'Agreement' | 'Will' | 'Affidavit';

interface FormInputs {
  prompt: string;
  template: TemplateType;
  contractType: string;
  agreementType: string;
  willType: string;
  affidavitType: string;
}

const LegalDocumentGenerator: React.FC = () => {
  // Improved State Management
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [generationStatus, setGenerationStatus] = useState<{
    pdf: boolean;
    docx: boolean;
  }>({ pdf: false, docx: false });
  const [apiError, setApiError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Performance Optimization: Memoized Converter
  const converter = useMemo(() => new Showdown.Converter(), []);
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<FormInputs>();

  // Memoized Markdown Removal Function
  const removeMarkdown = useCallback((text: string): string => {
    const start = text.indexOf("```jsx");
    const end = text.lastIndexOf("```");
    return start !== -1 && end > start ? text.slice(start + 6, end) : text;
  }, []);

  // Optimized Submission Handler
  const onSubmit: SubmitHandler<FormInputs> = useCallback(async (data) => {
    const { prompt, template } = data;

    if (!prompt || !template) {
      setApiError("Prompt and template are required.");
      return;
    }

    // Dynamic Type Selection
    const subtypeKey = `${template.toLowerCase()}Type` as keyof FormInputs;
    const selectedSubtype = data[subtypeKey];

    if (!selectedSubtype) {
      setApiError(`Please select a ${template} type.`);
      return;
    }

    setLoading(true);
    setApiError(null);
    setGenerationStatus({ pdf: false, docx: false });

    try {
      const response = await generateDocument({
        prompt,
        template,
        contractType: template === 'Contract' ? selectedSubtype : undefined,
        agreementType: template === 'Agreement' ? selectedSubtype : undefined,
        willType: template === 'Will' ? selectedSubtype : undefined,
        affidavitType: template === 'Affidavit' ? selectedSubtype : undefined,
      });
      setCode(removeMarkdown(response.code));
    } catch (error) {
      console.error("Error:", error);
      setApiError("An error occurred while generating the document. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [removeMarkdown]);

  // Memoized PDF Download Handler
  const handleDownloadPDF = useCallback(async (): Promise<void> => {
    const element = document.getElementById("pdf-content");
    if (!element) {
      setApiError("Could not generate PDF. Please try again.");
      return;
    }

    const options = {
      margin: 1,
      filename: "legal_document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    try {
      await html2pdf().from(element).set(options).save();
      setGenerationStatus(prev => ({ ...prev, pdf: true }));
    } catch (error) {
      console.error("PDF generation error:", error);
      setApiError("Failed to generate PDF. Please try again.");
    }
  }, []);

  // Memoized DOCX Download Handler
  const handleDownloadDocx = useCallback((): void => {
    if (!code) {
      setApiError("No content to generate DOCX. Please generate content first.");
      return;
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: code.split("\n").map(line => 
          new Paragraph({ children: [new TextRun(line)] })
        ),
      }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "legal_document.docx");
      setGenerationStatus(prev => ({ ...prev, docx: true }));
    }).catch(error => {
      console.error("DOCX generation error:", error);
      setApiError("Failed to generate DOCX. Please try again.");
    });
  }, [code]);

  // Memoized Reset Function
  const resetForm = useCallback(() => {
    setCode('');
    setApiError(null);
    setGenerationStatus({ pdf: false, docx: false });
  }, []);

  const template = watch("template");

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
            <span>Legal Document Generator</span>
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
              onClick={resetForm}
              className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
          <div className="p-6">
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-6"
            >
              <motion.div layout>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                  Enter description
                </label>
                <textarea
                  id="prompt"
                  {...register("prompt", { required: "Description is required" })}
                  placeholder="Provide detailed information, including names, dates, conditions, and any relevant context..."
                  className="block w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary min-h-[100px]"
                />
                {errors.prompt && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.prompt.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div layout>
                <label htmlFor="template" className="block text-sm font-medium text-gray-700">
                  Choose Template
                </label>
                <select
                  id="template"
                  {...register("template", { required: "Template is required" })}
                  className="block w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  onChange={(e) => {
                    setValue("template", e.target.value as TemplateType);
                    setValue("contractType", "");
                    setValue("agreementType", "");
                    setValue("willType", "");
                    setValue("affidavitType", "");
                  }}
                >
                  <option value="">Choose Template</option>
                  <option value="Contract">Contract</option>
                  <option value="Agreement">Agreement</option>
                  <option value="Will">Will</option>
                  <option value="Affidavit">Affidavit</option>
                </select>
              </motion.div>

              <AnimatePresence>
                {template === "Contract" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <label htmlFor="contractType" className="block text-sm font-medium text-gray-700">
                      Contract Type
                    </label>
                    <select
                      id="contractType"
                      {...register("contractType", { required: "Contract type is required" })}
                      className="block w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select Contract Type</option>
                      <option value="NDA">Non-Disclosure Agreement (NDA)</option>
                      <option value="Employment">Employment Contract</option>
                      <option value="Sales">Sales Contract</option>
                      <option value="Lease">Lease Agreement</option>
                      <option value="Service">Service Agreement</option>
                      <option value="Partnership">Partnership Agreement</option>
                      <option value="Purchase">Purchase Agreement</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex items-center justify-center w-full px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5 mr-2" />
                )}
                {loading ? 'Generating...' : 'Generate Document'}
              </motion.button>
            </motion.form>

            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center p-4 mt-4 space-x-2 text-red-700 bg-red-100 border border-red-400 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>{apiError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 mt-6 space-y-4 border-2 border-gray-200 rounded-lg"
              >
                <div className="w-full h-5 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="w-3/4 h-5 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="w-1/2 h-5 bg-gray-200 rounded-md animate-pulse"></div>
              </motion.div>
            )}

            <AnimatePresence>
              {!loading && code && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6"
                >
                  <div
                    id="pdf-content"
                    dangerouslySetInnerHTML={{ __html: converter.makeHtml(code) }}
                    className="p-6 bg-white border-2 border-gray-200 rounded-lg shadow-lg"
                  />

                  <div className="flex gap-4 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownloadPDF}
                      className="flex items-center justify-center flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownloadDocx}
                      className="flex items-center justify-center flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-secondary hover:bg-secondary/90"
                    >
                      <File className="w-5 h-5 mr-2" />
                      Download DOCX
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {(generationStatus.pdf || generationStatus.docx) && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center justify-center mt-4 space-x-2 text-green-600"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Document generated successfully!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(LegalDocumentGenerator);