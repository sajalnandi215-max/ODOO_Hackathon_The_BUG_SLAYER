import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  AlertCircle, 
  FileSearch,
  DollarSign
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionRequired?: boolean;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'm1', 
      sender: 'bot', 
      text: "Hello! I am HelixAI, your automated HR copilot assistant. How can I assist you with talent acquisition, payroll checks, or leave audit analytics today?", 
      timestamp: '09:00' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const triggerAIResponse = (promptText: string) => {
    setIsTyping(true);
    
    // Custom replies matching pre-defined prompts
    let replyText = "I parsed your request. In this sandbox environment, you can run automated checks using the quick action prompts below.";
    
    if (promptText.toLowerCase().includes('resume')) {
      replyText = "🔍 **HelixAI Resume Screening Complete:**\n\nI evaluated applicants for **Senior Backend Developer (Node.js)**:\n- **James Thorne (Match: 92%)**: Strong Node.js competencies, has solved technical rounds cleanly. Minor gaps in caching.\n- **Elena Rostova (Match: 78%)**: Solid development background, but experience is mostly Django-based rather than Node/Express.\n\n*Verdict: Recommend proceeding to interview with James Thorne immediately.*";
    } else if (promptText.toLowerCase().includes('payroll')) {
      replyText = "💰 **HelixAI Payroll Anomaly Alert:**\n\nI ran anomaly detection protocols on June compensation files:\n- **Flagged:** Chloe Dubois (Sales) commissions were reported twice in the ledger due to syncing collisions in Salesforce endpoints.\n- **Variance:** engineering basic wage has risen by 4% matching index adjustments.\n\n*Action advised: Re-verify Salesforce sync records before next ledger disbursal.*";
    } else if (promptText.toLowerCase().includes('leave')) {
      replyText = "📅 **HelixAI Leave Pattern Audit:**\n\nI scanned the Q3 time-off planner:\n- **Leave cap overlap:** 3 engineers have applied for Casual Leave over July 10-15.\n- **Capacity check:** Active operational engineering bandwidth will drop by 22% during this window. Core modules roadmap might experience transient delays.\n\n*Action advised: Stagger approvals or enable hot-swap contractor support.*";
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `m-${Math.random()}`,
          sender: 'bot',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages(prev => [
      ...prev,
      {
        id: `m-${Math.random()}`,
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    
    setInputValue('');
    triggerAIResponse(userText);
  };

  const selectPrompt = (promptText: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: `m-${Math.random()}`,
        sender: 'user',
        text: promptText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    triggerAIResponse(promptText);
  };

  return (
    <>
      {/* Floating Sparkle clicker Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-650 text-white flex items-center justify-center shadow-lg shadow-indigo-600/35 hover:scale-105 transition-all duration-200"
      >
        {isOpen ? <X className="h-5.5 w-5.5" /> : <Sparkles className="h-5.5 w-5.5 animate-pulse" />}
      </button>

      {/* Slide-out chatbot Drawer panel */}
      {isOpen && (
        <div className="fixed right-6 bottom-20 z-50 w-96 h-[500px] rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-violet-600 to-indigo-650 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <div>
                <span className="font-outfit text-sm font-bold block leading-none">HelixAI Assistant</span>
                <span className="text-[9px] text-indigo-200">Sandbox cognitive model active</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div key={m.id} className={`flex items-start space-x-2.5 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5
                    ${isBot ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}>
                    {isBot ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-[11px] leading-relaxed max-w-[80%] whitespace-pre-line
                    ${isBot 
                      ? 'bg-slate-50 dark:bg-slate-900/35 border border-slate-200/10 text-slate-800 dark:text-slate-200' 
                      : 'bg-indigo-600 text-white shadow-sm'}`}>
                    {m.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start space-x-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 flex-shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/35 border border-slate-200/10 text-slate-400 font-mono text-[10px] animate-pulse">
                  HelixAI is thinking...
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-900 space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Suggested actions:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => selectPrompt("Screen resumes for Node.js job")}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border border-slate-200/30 rounded-lg text-[9px] font-semibold text-slate-600 dark:text-slate-350 transition-colors"
                >
                  <FileSearch className="h-3 w-3 text-indigo-500" />
                  <span>Resume screening</span>
                </button>
                <button
                  onClick={() => selectPrompt("Check payroll anomaly variance")}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border border-slate-200/30 rounded-lg text-[9px] font-semibold text-slate-600 dark:text-slate-350 transition-colors"
                >
                  <DollarSign className="h-3 w-3 text-rose-500" />
                  <span>Audit Payroll</span>
                </button>
                <button
                  onClick={() => selectPrompt("Detect WFH leave caps")}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border border-slate-200/30 rounded-lg text-[9px] font-semibold text-slate-600 dark:text-slate-350 transition-colors"
                >
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                  <span>Leave patterns</span>
                </button>
              </div>
            </div>
          )}

          {/* Input form */}
          <form 
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-150/40 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything or request report..."
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
