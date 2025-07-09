import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, BookOpen } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const SheriaBot: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const marriageLawKeywords = [
    'marriage', 'wedding', 'spouse', 'husband', 'wife', 'divorce', 'separation',
    'customary', 'civil', 'religious', 'dowry', 'bride price', 'polygamy', 'monogamy',
    'ceremony', 'registration', 'certificate', 'vows', 'matrimony', 'union', 'christian',
    'hindu', 'islamic', 'mosque', 'church', 'registrar', 'consent', 'age', 'identity',
    'inheritance', 'spousal', 'rights', 'legal aid', 'counseling', 'forms', 'process'
  ];

  const marriageLawResponses = [
    {
      keywords: ['types', 'kinds', 'forms'],
      response: '📘 Marriage Laws in Kenya – There are five legally recognized types of marriage under the Marriage Act 2014:\n\n1. Civil Marriage – Conducted by the Registrar of Marriages at a government office\n2. Christian Marriage – Performed by licensed churches and ministers\n3. Hindu Marriage – Conducted within Hindu traditions by authorized officiants\n4. Islamic Marriage – Governed by Islamic law, typically solemnized in a mosque\n5. Customary Marriage – Based on ethnic group customs in Kenya\n\nAll marriages must be voluntary, between opposite sex persons aged 18+ years.'
    },
    {
      keywords: ['customary', 'traditional'],
      response: 'Customary marriage in Kenya is based on the customs of an ethnic group and must be conducted according to the customary law of the community to which the parties belong. The marriage must be registered within 3 months of the ceremony to be legally valid.'
    },
    {
      keywords: ['civil', 'government', 'registrar'],
      response: 'Civil marriage is conducted by the Registrar of Marriages at a government office. Both parties must be above 18 years, give free consent, not be closely related, and provide proof of identity. Registration makes the union legally binding.'
    },
    {
      keywords: ['christian', 'church'],
      response: 'Christian marriage is performed by licensed churches and ministers. The ceremony must follow Christian traditions and be conducted by an authorized religious officiant. Registration with the Registrar of Marriages is still required.'
    },
    {
      keywords: ['islamic', 'muslim', 'mosque'],
      response: 'Islamic marriage is governed by Islamic law and customs, typically solemnized in a mosque by an authorized Islamic officiant. The marriage follows Islamic traditions while still requiring registration under Kenyan law.'
    },
    {
      keywords: ['hindu'],
      response: 'Hindu marriage is conducted within Hindu traditions by authorized officiants. The ceremony follows Hindu customs and rituals while meeting the legal requirements under the Marriage Act 2014.'
    },
    {
      keywords: ['registration', 'register', 'forms'],
      response: 'Marriage registration requires:\n• Proof of identity\n• Notice of intention\n• Ceremony details\n• Both parties present\n• Witnesses\n\nRegistration makes the union legally binding and provides access to inheritance rights, spousal benefits, and legal protection. Visit the Registrar of Marriages office to begin the process.'
    },
    {
      keywords: ['age', 'minimum', '18'],
      response: 'The minimum age for marriage in Kenya is 18 years for both men and women. All marriages must be voluntary and require free consent from both parties. Any marriage involving a person under 18 is considered child marriage and is illegal.'
    },
    {
      keywords: ['divorce', 'separation'],
      response: 'Divorce in Kenya can be granted on grounds including adultery, cruelty, desertion, or irretrievable breakdown of marriage. The process requires filing a petition in the Family Court. Legal aid and counseling services are available to assist with the process.'
    },
    {
      keywords: ['polygamy', 'multiple wives'],
      response: 'Polygamy is allowed under customary and Islamic law in Kenya, but not under civil or Christian marriage. A man can have multiple wives under customary law if permitted by his community\'s traditions.'
    },
    {
      keywords: ['rights', 'benefits', 'inheritance'],
      response: 'Marriage registration provides access to:\n• Inheritance rights\n• Spousal rights and benefits\n• Legal protection\n• Government benefits\n• Property rights\n• Medical decision-making rights\n\nThese rights are only available for legally registered marriages.'
    },
    {
      keywords: ['help', 'assistance', 'legal aid'],
      response: 'Sheria can assist with:\n• Understanding marriage registration requirements\n• Forms and steps to begin the process\n• Rights and responsibilities within marriage\n• Where to seek help (legal aid, counseling, etc.)\n\nFor immediate assistance, contact the National Legal Aid Service or visit your nearest Registrar of Marriages office.'
    },
    {
      keywords: ['requirements', 'documents', 'proof'],
      response: 'Marriage requirements include:\n• Both parties aged 18+ years\n• Free consent from both parties\n• Proof of identity (ID cards/passports)\n• Notice of intention to marry\n• Not closely related\n• Opposite sex persons\n• Witnesses present at ceremony\n• Registration within required timeframe'
    }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        text: '📘 Hi! I\'m Sheria, your AI legal assistant specializing in Kenyan Marriage Laws. I can help you understand the Marriage Act 2014, registration requirements, types of marriage, and your rights. Ask me anything about marriage law in Kenya!',
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, t, messages.length]);

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
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Check if the input contains marriage law keywords
    const hasMarriageKeywords = marriageLawKeywords.some(keyword => 
      lowerInput.includes(keyword)
    );

    if (!hasMarriageKeywords) {
      return '⚠️ This section of the AI is still under development for non-marriage related questions. Please try again later.\n\nI specialize in Kenyan Marriage Laws. Feel free to ask about:\n• Marriage registration\n• Types of marriage\n• Requirements and documents\n• Rights and benefits\n• Legal procedures';
    }

    // Find the most relevant response
    const relevantResponse = marriageLawResponses.find(response =>
      response.keywords.some(keyword => lowerInput.includes(keyword))
    );

    if (relevantResponse) {
      return relevantResponse.response;
    }

    // Default comprehensive marriage law response
    return '📘 Marriage in Kenya is governed by the Marriage Act 2014, which recognizes five types of marriage:\n\n1. Civil Marriage\n2. Christian Marriage\n3. Hindu Marriage\n4. Islamic Marriage\n5. Customary Marriage\n\nAll marriages must be voluntary, between opposite sex persons aged 18+ years, and registered to be legally valid.\n\nWhat specific aspect of marriage law would you like to know more about?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'Types of marriage in Kenya',
    'Marriage registration process',
    'Marriage age requirements',
    'Customary marriage rules'
  ];

  return (
    <>
      {/* Bot Button - Small floating widget */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-kenya-green-700 text-white p-3 rounded-full shadow-lg hover:bg-kenya-green-800 transition-all duration-300 hover:scale-110 border-2 border-kenya-red-500"
        aria-label="Chat with Sheria Bot"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* Chat Modal - Fully Responsive and Contained */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-end p-2 md:p-4">
            {/* Backdrop for mobile */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-sm h-[85vh] max-h-[600px] flex flex-col md:mb-16 md:mr-2 overflow-hidden"
            >
              {/* Compact Header */}
              <div className="bg-gradient-to-r from-kenya-green-700 to-kenya-green-800 text-white p-3 rounded-t-xl flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <BookOpen className="w-3 h-3" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Sheria Bot</h3>
                      <p className="text-xs text-white/80">Marriage Law Expert</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Questions */}
              <div className="p-2 bg-gray-50 border-b flex-shrink-0">
                <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
                <div className="grid grid-cols-1 gap-1">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(question)}
                      className="text-xs bg-white border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 transition-colors text-left truncate"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages - Scrollable with proper height */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-1 max-w-[85%]`}>
                      {message.sender === 'bot' && (
                        <div className="w-5 h-5 bg-kenya-green-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <BookOpen className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      <div
                        className={`p-2 rounded-lg text-xs break-words ${
                          message.sender === 'user'
                            ? 'bg-kenya-green-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-line">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-5 h-5 bg-kenya-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-1">
                      <div className="w-5 h-5 bg-kenya-green-700 rounded-full flex items-center justify-center">
                        <BookOpen className="w-2.5 h-2.5 text-white" />
                      </div>
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Compact Input - Fixed at bottom */}
              <div className="p-2 border-t border-gray-200 flex-shrink-0">
                <div className="flex space-x-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about marriage laws..."
                    className="flex-1 px-2 py-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-kenya-green-500 focus:border-kenya-green-500 transition-colors"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-kenya-green-700 text-white p-2 rounded hover:bg-kenya-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send className="w-3 h-3" />
                  </button>
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