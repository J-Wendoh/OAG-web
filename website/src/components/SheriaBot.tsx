import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { callOpenAI, isOpenAIAvailable, apiLog } from '../utils/api-config';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isAI?: boolean;
  error?: boolean;
}

const SheriaBot: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAIMode, setIsAIMode] = useState(isOpenAIAvailable());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Comprehensive Kenyan law keywords
  const legalKeywords = [
    // Constitutional & Rights
    'constitution', 'rights', 'freedom', 'bill of rights', 'fundamental', 'liberty', 'equality',
    'discrimination', 'human rights', 'citizen', 'citizenship', 'voting', 'election',

    // Marriage & Family Law
    'marriage', 'wedding', 'spouse', 'husband', 'wife', 'divorce', 'separation',
    'customary', 'civil', 'religious', 'dowry', 'bride price', 'polygamy', 'monogamy',
    'ceremony', 'registration', 'certificate', 'vows', 'matrimony', 'union', 'christian',
    'hindu', 'islamic', 'mosque', 'church', 'registrar', 'consent', 'age', 'identity',
    'inheritance', 'spousal', 'family', 'children', 'custody', 'maintenance',

    // Employment & Labor
    'employment', 'job', 'work', 'salary', 'wages', 'contract', 'termination', 'dismissal',
    'labor', 'worker', 'employee', 'employer', 'workplace', 'safety', 'overtime', 'leave',
    'maternity', 'paternity', 'union', 'strike', 'grievance', 'compensation',

    // Property & Land
    'property', 'land', 'title', 'deed', 'ownership', 'lease', 'rent', 'landlord', 'tenant',
    'eviction', 'mortgage', 'sale', 'purchase', 'transfer', 'succession', 'inheritance',

    // Criminal Law
    'crime', 'criminal', 'arrest', 'police', 'court', 'bail', 'trial', 'sentence', 'prison',
    'theft', 'assault', 'fraud', 'corruption', 'bribery', 'murder', 'robbery',

    // Business & Commercial
    'business', 'company', 'partnership', 'license', 'permit', 'tax', 'contract', 'agreement',
    'debt', 'bankruptcy', 'intellectual property', 'trademark', 'copyright',

    // Legal Procedures
    'court', 'judge', 'lawyer', 'advocate', 'legal aid', 'procedure', 'appeal', 'petition',
    'case', 'hearing', 'evidence', 'witness', 'judgment', 'injunction'
  ];

  const legalResponses = [
    // Constitutional Rights
    {
      keywords: ['constitution', 'constitutional', 'bill of rights', 'fundamental rights'],
      response: '🇰🇪 The Constitution of Kenya (2010) is the supreme law of the land. It establishes fundamental rights and freedoms including:\n\n• Right to life, liberty and security\n• Freedom of expression, assembly and association\n• Right to equality and non-discrimination\n• Economic and social rights (education, health, housing)\n• Right to a fair trial and access to justice\n• Freedom of religion and conscience\n\nThese rights are protected by the courts and can only be limited in specific circumstances defined by law.\n\nPlease note that this is general legal information and should not replace professional legal advice from a qualified lawyer.'
    },
    {
      keywords: ['voting', 'election', 'citizen', 'citizenship'],
      response: '🗳️ Citizenship and Voting Rights in Kenya:\n\n**Citizenship**: Acquired by birth, registration, or naturalization. Citizens have the right to participate in political processes.\n\n**Voting Rights**: All citizens aged 18+ can register to vote. The Independent Electoral and Boundaries Commission (IEBC) manages elections.\n\n**Requirements**: Valid national ID, registration with IEBC, and being of sound mind.\n\nContact IEBC for voter registration and election information.\n\nPlease note that this is general legal information and should not replace professional legal advice from a qualified lawyer.'
    },

    // Marriage & Family Law
    {
      keywords: ['marriage', 'types', 'kinds', 'forms'],
      response: '💒 Marriage Laws in Kenya – There are five legally recognized types of marriage under the Marriage Act 2014:\n\n1. Civil Marriage – Conducted by the Registrar of Marriages\n2. Christian Marriage – Performed by licensed churches\n3. Hindu Marriage – Conducted within Hindu traditions\n4. Islamic Marriage – Governed by Islamic law\n5. Customary Marriage – Based on ethnic customs\n\nAll marriages must be voluntary, between persons aged 18+ years, and registered to be legally valid.\n\nPlease note that this is general legal information and should not replace professional legal advice from a qualified lawyer.'
    },
    // Employment & Labor Law
    {
      keywords: ['employment', 'job', 'work', 'labor', 'employee'],
      response: '💼 Employment Rights in Kenya (Employment Act 2007):\n\n• Right to fair wages and working conditions\n• Maximum 45 hours per week (8 hours daily)\n• Overtime compensation at 1.5x normal rate\n• Annual leave (21 days minimum)\n• Maternity leave (3 months)\n• Sick leave and medical benefits\n• Protection from unfair dismissal\n\n**Termination**: Requires proper notice or compensation. Unfair dismissal can be challenged at Employment and Labour Relations Court.\n\nPlease note that this is general legal information and should not replace professional legal advice from a qualified lawyer.'
    },
    {
      keywords: ['salary', 'wages', 'payment', 'overtime'],
      response: '💰 Wage and Payment Rights:\n\n• Minimum wage as set by government\n• Payment must be in legal tender\n• Overtime: 1.5x normal rate for extra hours\n• Deductions only with employee consent or court order\n• Payslips must be provided\n• Equal pay for equal work regardless of gender\n\nContact Ministry of Labour for current minimum wage rates and file complaints for wage violations.\n\nPlease note that this is general legal information and should not replace professional legal advice from a qualified lawyer.'
    },

    // Property & Land Law
    {
      keywords: ['property', 'land', 'title', 'ownership'],
      response: '🏠 Property and Land Rights in Kenya:\n\n**Types of Land Tenure**:\n• Freehold - absolute ownership\n• Leasehold - temporary ownership (99 years max)\n• Customary - community/family land\n\n**Land Registration**: All land must be registered. Title deeds prove ownership. Succession Act governs inheritance.\n\n**Disputes**: Land disputes handled by Environment and Land Court.\n\nVisit Ministry of Lands for registration and title services.\n\nPlease note that this is general legal information and should not replace professional legal advice from a qualified lawyer.'
    },
    {
      keywords: ['rent', 'landlord', 'tenant', 'lease', 'eviction'],
      response: '🏘️ Landlord-Tenant Rights (Rent Restriction Act):\n\n**Tenant Rights**:\n• Peaceful enjoyment of premises\n• Reasonable notice for entry\n• Protection from illegal eviction\n• Rent receipts and proper notices\n\n**Landlord Rights**:\n• Timely rent payment\n• Property maintenance by tenant\n• Access for repairs with notice\n\n**Eviction**: Requires court order except for specific circumstances. 30 days notice usually required.\n\nPlease note that this is general legal information and should not replace professional legal advice from a qualified lawyer.'
    },
    // Criminal Law & Justice
    {
      keywords: ['arrest', 'police', 'rights', 'criminal'],
      response: '⚖️ Your Rights When Arrested in Kenya:\n\n• Right to remain silent\n• Right to legal representation\n• Right to be informed of charges\n• Right to be brought before court within 24 hours\n• Right to bail (unless serious offenses)\n• Right to humane treatment\n• Right to contact family/lawyer\n\n**Important**: Do not resist arrest. Exercise your right to remain silent until you have legal representation.\n\nContact Legal Aid for free legal assistance.\n\nPlease note that this is general legal information and should not replace professional legal advice from a qualified lawyer.'
    },
    {
      keywords: ['bail', 'bond', 'court', 'trial'],
      response: '🏛️ Bail and Court Procedures:\n\n**Bail**: Right to reasonable bail except for capital offenses. Court considers:\n• Severity of offense\n• Flight risk\n• Public safety\n• Previous convictions\n\n**Court Process**: Arraignment → Plea → Pre-trial → Trial → Judgment\n\n**Legal Representation**: Right to lawyer at all stages. Legal Aid available for those who cannot afford private counsel.\n\nPlease note that this is general legal information and should not replace professional legal advice from a qualified lawyer.'
    },

    // Business & Commercial Law
    {
      keywords: ['business', 'company', 'registration', 'license'],
      response: '🏢 Business Registration in Kenya:\n\n**Business Types**:\n• Sole Proprietorship\n• Partnership\n• Limited Company\n• Cooperative Society\n\n**Registration**: Through Registrar of Companies or County Government for single business permits.\n\n**Requirements**: Business name search, registration forms, fees, compliance certificates.\n\n**Licenses**: Vary by business type and location. Contact relevant ministry or county government.\n\nPlease note that this is general legal information and should not replace professional legal advice from a qualified lawyer.'
    },
    {
      keywords: ['contract', 'agreement', 'debt', 'payment'],
      response: '📄 Contract Law in Kenya:\n\n**Valid Contract Requirements**:\n• Offer and acceptance\n• Consideration (payment/benefit)\n• Legal capacity of parties\n• Legal purpose\n• Free consent\n\n**Breach of Contract**: Can seek damages, specific performance, or contract cancellation through courts.\n\n**Debt Recovery**: Small Claims Court for amounts under KSh 1 million. Higher amounts in High Court.\n\nPlease note that this is general legal information and should not replace professional legal advice from a qualified lawyer.'
    },

    // Legal Procedures & Access to Justice
    {
      keywords: ['legal aid', 'lawyer', 'advocate', 'court'],
      response: '⚖️ Access to Justice in Kenya:\n\n**Legal Aid**: Free legal services for those who cannot afford private lawyers. Contact National Legal Aid Service.\n\n**Court System**:\n• Magistrate Courts (minor cases)\n• High Court (serious cases)\n• Court of Appeal\n• Supreme Court (final appeal)\n\n**Legal Representation**: Right to lawyer in criminal cases. Civil cases - advisable but not mandatory.\n\n**Alternative Dispute Resolution**: Mediation, arbitration available for faster resolution.\n\nPlease note that this is general legal information and should not replace professional legal advice from a qualified lawyer.'
    }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = isAIMode
        ? '🇰🇪⚖️ Habari! I\'m Sheria, your AI-powered legal assistant specializing in Kenyan law and serving as the virtual assistant to the Office of the Attorney General of Kenya.\n\nI can help you understand:\n• Constitutional rights and freedoms\n• Marriage and family law\n• Employment and labor rights\n• Property and land laws\n• Criminal justice procedures\n• Court processes and legal aid\n• Business and commercial law\n\nAsk me anything about Kenyan law!'
        : '📘 Hi! I\'m Sheria, your legal assistant specializing in Kenyan law. I can help you understand various legal topics including marriage laws, constitutional rights, employment law, and more. Ask me anything about Kenyan law!';

      setMessages([{
        id: '1',
        text: welcomeMessage,
        sender: 'bot',
        timestamp: new Date(),
        isAI: isAIMode
      }]);
    }
  }, [isOpen, t, messages.length, isAIMode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      let botResponse: string;
      let isAI = false;

      if (isAIMode) {
        try {
          botResponse = await callOpenAI(currentInput);
          isAI = true;
          apiLog('OpenAI response received successfully');
        } catch (error) {
          apiLog('OpenAI failed, falling back to rule-based response:', error);
          botResponse = generateBotResponse(currentInput);
          isAI = false;
        }
      } else {
        botResponse = generateBotResponse(currentInput);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        isAI: isAI
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      apiLog('Error in handleSendMessage:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '⚠️ I\'m experiencing technical difficulties. Please try again later or ask about Kenyan law topics that I can help with using my built-in knowledge base covering constitutional rights, employment law, property law, criminal law, and more.',
        sender: 'bot',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // Check if the input contains legal keywords
    const hasLegalKeywords = legalKeywords.some(keyword =>
      lowerInput.includes(keyword)
    );

    // Handle non-legal questions
    if (!hasLegalKeywords) {
      return '🇰🇪⚖️ I appreciate your question, but my expertise is specifically in Kenyan law and legal matters. Let\'s keep our conversation focused on helping you understand your rights and the laws that protect you here in Kenya!\n\nI can help you with:\n• Constitutional rights and freedoms\n• Marriage and family law\n• Employment and labor rights\n• Property and land laws\n• Criminal justice procedures\n• Business and commercial law\n• Court processes and legal aid\n\nWhat legal question can I help you with today?';
    }

    // Find the most relevant response based on keyword matching
    const relevantResponse = legalResponses.find(response =>
      response.keywords.some(keyword => lowerInput.includes(keyword))
    );

    if (relevantResponse) {
      return relevantResponse.response;
    }

    // Default comprehensive legal response
    return '🇰🇪⚖️ I\'m here to help you understand Kenyan law! I can provide information about:\n\n• **Constitutional Rights**: Your fundamental rights and freedoms under the 2010 Constitution\n• **Family Law**: Marriage, divorce, inheritance, and family matters\n• **Employment Law**: Worker rights, contracts, and labor disputes\n• **Property Law**: Land ownership, rental agreements, and property rights\n• **Criminal Law**: Your rights when arrested and court procedures\n• **Business Law**: Company registration, contracts, and commercial matters\n• **Access to Justice**: Legal aid, court procedures, and dispute resolution\n\nPlease ask me about a specific legal topic, and I\'ll provide detailed information based on Kenyan law.\n\nPlease note that this is general legal information and should not replace professional legal advice from a qualified lawyer.';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  return (
    <>
      {/* Floating Action Button - Glass-morphism design */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with Sheria Bot"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#DC143C] via-[#006600] to-[#DC143C] rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Main button */}
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-4 shadow-2xl hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-center">
              {isAIMode ? (
                <Sparkles className="w-6 h-6 text-white drop-shadow-lg" />
              ) : (
                <MessageCircle className="w-6 h-6 text-white drop-shadow-lg" />
              )}
            </div>
          </div>

          {/* AI indicator badge */}
          {isAIMode && (
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-[#DC143C] to-[#006600] text-white text-xs px-2 py-0.5 rounded-full border border-white/30 shadow-lg">
              AI
            </div>
          )}
        </div>
      </motion.button>

      {/* Chat Modal - Glass-morphism Design */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-end p-2 md:p-4">
            {/* Enhanced backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm h-[85vh] max-h-[600px] flex flex-col md:mb-16 md:mr-2 overflow-hidden"
            >
              {/* Solid white container for better readability */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl h-full flex flex-col overflow-hidden">
                {/* Modern Header with Kenya flag gradient */}
                <div className="relative bg-gradient-to-r from-[#DC143C] via-[#000000] to-[#006600] text-white p-4 flex-shrink-0 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                          {isAIMode ? (
                            <Sparkles className="w-5 h-5 text-[#DC143C]" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-[#DC143C]" />
                          )}
                        </div>
                        {isAIMode && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white animate-pulse" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold tracking-wide">Sheria</h3>
                        <p className="text-sm text-white/90 font-medium">
                          {isAIMode ? 'AI Legal Assistant' : 'Kenyan Law Expert'}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/20 rounded-full transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>



                {/* Messages with white background for readability */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-gray-50">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[85%]`}>
                        {message.sender === 'bot' && (
                          <div className="relative">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#006600] to-[#DC143C] rounded-full flex items-center justify-center flex-shrink-0 border border-white/30 shadow-lg">
                              {message.isAI ? (
                                <Sparkles className="w-4 h-4 text-white" />
                              ) : message.error ? (
                                <AlertCircle className="w-4 h-4 text-white" />
                              ) : (
                                <BookOpen className="w-4 h-4 text-white" />
                              )}
                            </div>
                            {message.isAI && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white animate-pulse" />
                            )}
                          </div>
                        )}
                        <div
                          className={`relative p-4 rounded-2xl border shadow-lg ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-br from-[#DC143C] to-[#006600] text-white border-gray-300'
                              : message.error
                              ? 'bg-red-50 text-red-800 border-red-200'
                              : 'bg-white text-gray-800 border-gray-200'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-line text-sm">{message.text}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            {message.isAI && (
                              <div className="flex items-center space-x-1 text-xs opacity-70">
                                <Sparkles className="w-3 h-3" />
                                <span>AI</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {message.sender === 'user' && (
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-300 shadow-lg">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#006600] to-[#DC143C] rounded-full flex items-center justify-center border border-gray-300 shadow-lg">
                          {isAIMode ? (
                            <Sparkles className="w-4 h-4 text-white" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-lg">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input section with white background */}
                <div className="relative p-4 bg-white border-t border-gray-200 flex-shrink-0">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about your constitutional rights, employment law, property rights, marriage law, criminal justice..."
                      className="flex-1 px-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#DC143C] focus:border-[#DC143C] transition-all duration-200 focus:bg-white"
                    />
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-gradient-to-r from-[#DC143C] to-[#006600] text-white p-3 rounded-xl hover:from-[#B91C3C] hover:to-[#059669] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SheriaBot;