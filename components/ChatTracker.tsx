import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, Message, UserRole } from '../types';
import { analyzeChatSafety } from '../services/geminiService';
import { Send, ShieldCheck, AlertTriangle, User as UserIcon, Store } from 'lucide-react';

interface ChatTrackerProps {
  sessions: ChatSession[];
  currentRole: UserRole;
  onSendMessage: (sessionId: string, text: string) => void;
}

const ChatTracker: React.FC<ChatTrackerProps> = ({ sessions, currentRole, onSendMessage }) => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(sessions.length > 0 ? sessions[0].id : null);
  const [inputText, setInputText] = useState('');
  const [safetyStatus, setSafetyStatus] = useState<{isSafe: boolean, warning?: string}>({ isSafe: true });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages]);

  // Monitor chat for safety whenever messages change
  useEffect(() => {
    if (activeSession && activeSession.messages.length > 0) {
        const checkSafety = async () => {
            const lastFewMessages = activeSession.messages.slice(-5).map(m => m.text);
            const status = await analyzeChatSafety(lastFewMessages);
            setSafetyStatus(status);
        }
        checkSafety();
    }
  }, [activeSession?.messages]);

  const handleSend = () => {
    if (!inputText.trim() || !activeSessionId) return;
    onSendMessage(activeSessionId, inputText);
    setInputText('');
  };

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <Store size={48} className="text-gray-400" />
        </div>
        <p className="text-xl font-medium">No active negotiations.</p>
        <p className="text-sm">Start haggling on a product!</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden mt-6 border border-gray-200">
      
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-bold text-gray-700">Active Deals</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.map(session => (
            <div 
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition ${activeSessionId === session.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800">{session.otherPartyName}</h3>
                <span className="text-xs text-gray-400">Now</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{session.productTitle}</p>
              <p className="text-xs text-gray-400 mt-1 truncate">
                {session.messages[session.messages.length - 1]?.text || 'Started a chat'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeSession ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat Header with Safety Status */}
          <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{activeSession.productTitle}</h3>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                Chatting with {activeSession.otherPartyName}
              </span>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${safetyStatus.isSafe ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700 animate-pulse'}`}>
                {safetyStatus.isSafe ? <ShieldCheck size={14}/> : <AlertTriangle size={14}/>}
                {safetyStatus.isSafe ? "Secure Connection" : "Safety Alert"}
            </div>
          </div>

          {/* Safety Warning Banner */}
          {!safetyStatus.isSafe && safetyStatus.warning && (
              <div className="bg-red-50 p-2 text-center text-xs text-red-600 border-b border-red-100 font-medium">
                  System Monitor: {safetyStatus.warning}
              </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {/* System Intro */}
             <div className="flex justify-center my-4">
                <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                    Transaction monitored by CampusGuard AI
                </span>
             </div>

            {activeSession.messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                    msg.sender === 'me' 
                      ? 'bg-green-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                  <div className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-green-200' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              <button 
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 transition shadow-md"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-400">Select a chat to start talking</p>
        </div>
      )}
    </div>
  );
};

export default ChatTracker;