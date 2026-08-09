import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, MessageSquare } from 'lucide-react';
import { LandInputs } from '../types';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

interface AiLandAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentInputs?: LandInputs;
}

export const AiLandAdvisorDrawer: React.FC<AiLandAdvisorDrawerProps> = ({
  isOpen,
  onClose,
  currentInputs
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello! I am TerraVal AI, your real estate land appraisal & development consultant. Ask me any question about land valuation, zoning laws, soil perc tests, utility connection costs, or subdivision strategies!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSend = async (promptText?: string) => {
    const textToSend = promptText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!promptText) setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/land-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          landContext: currentInputs
        })
      });

      const data = await response.json();
      const aiReply = data.reply || 'I received your request but could not generate a response.';

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Error connecting to AI land advisor: ${err.message || 'Server error'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "What are the typical costs for a private septic system and well?",
    "How does steep slope topography affect construction budget?",
    "How do I determine if my land parcel can be subdivided?",
    "What is the value impact of adding paved road access?"
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-slideLeft">
      
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-white">TerraVal AI Advisor</h3>
            <p className="text-[11px] text-emerald-400 font-medium">Land & Zoning Consultant</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Chat Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
              msg.sender === 'user'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 border border-slate-700 text-emerald-400'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`p-4 rounded-2xl max-w-[82%] text-xs leading-relaxed space-y-1 ${
              msg.sender === 'user'
                ? 'bg-emerald-500 text-slate-950 font-medium shadow-md'
                : 'bg-slate-950 border border-slate-800 text-slate-200'
            }`}>
              <p className="whitespace-pre-line">{msg.text}</p>
              <span className={`block text-[9px] text-right ${msg.sender === 'user' ? 'text-slate-900/70' : 'text-slate-500'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Analyzing land appraisal parameters...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <p className="text-[10px] text-slate-500 font-semibold mb-2">Suggested Land Questions:</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="text-[10px] bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-slate-300 px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask about land valuation, zoning, well/septic..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
          />

          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
