'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getConversations,
  getMessages,
  sendMessage,
  markConversationRead,
  getTotalUnreadCount,
  formatMessageTime,
  getInitials,
  getDemoUser,
  type Conversation,
  type Message,
} from '@/lib/storage/chatStorage';

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversations on mount
  useEffect(() => {
    setConversations(getConversations());
    setUnreadCount(getTotalUnreadCount());
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when conversation opens
  useEffect(() => {
    if (selectedConversation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedConversation]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        panelRef.current &&
        bubbleRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !bubbleRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const openConversation = useCallback((convo: Conversation) => {
    setSelectedConversation(convo);
    setMessages(getMessages(convo.id));
    markConversationRead(convo.id);

    // Update local state
    setConversations(prev =>
      prev.map(c => c.id === convo.id ? { ...c, unreadCount: 0 } : c)
    );
    setUnreadCount(prev => Math.max(0, prev - convo.unreadCount));
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = sendMessage(selectedConversation.id, newMessage.trim());
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation list
    setConversations(prev =>
      prev.map(c =>
        c.id === selectedConversation.id
          ? { ...c, lastMessage: message, updatedAt: message.timestamp }
          : c
      ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );

    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // In real app, this would be a websocket message
    }, 2000);
  }, [newMessage, selectedConversation]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getParticipantName = (convo: Conversation): string => {
    const otherParticipant = convo.participants.find(p => p !== 'current-user');
    return otherParticipant ? convo.participantNames[otherParticipant] : 'Unknown';
  };

  const getParticipantInfo = (convo: Conversation) => {
    const otherParticipant = convo.participants.find(p => p !== 'current-user');
    if (otherParticipant) {
      const demoUser = getDemoUser(otherParticipant);
      if (demoUser) {
        return demoUser;
      }
    }
    return null;
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        ref={bubbleRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 via-cyan-500 to-indigo-500 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center group"
        aria-label="Open messages"
      >
        {/* Icon */}
        <svg
          className={`w-6 h-6 text-white transition-transform duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>

        {/* Close icon when open */}
        <svg
          className={`w-6 h-6 text-white absolute transition-transform duration-300 ${isOpen ? 'scale-100 rotate-0' : 'scale-0 rotate-90'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Pulse animation */}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-25" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-6 z-50 w-96 h-[32rem] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300"
        >
          {selectedConversation ? (
            // Conversation View
            <>
              {/* Conversation Header */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-3 flex-1">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                      {(() => {
                        const info = getParticipantInfo(selectedConversation);
                        if (info) {
                          return getInitials(info.firstName, info.lastName);
                        }
                        return '?';
                      })()}
                    </div>
                    {/* Online indicator */}
                    {getParticipantInfo(selectedConversation)?.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {getParticipantName(selectedConversation)}
                    </h3>
                    <p className="text-xs text-white/80">
                      {getParticipantInfo(selectedConversation)?.currentYear} • {getParticipantInfo(selectedConversation)?.school}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-800/50">
                {messages.map((msg) => {
                  const isMe = msg.senderId === 'current-user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                          isMe
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-br-md'
                            : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                          {formatMessageTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Conversations List
            <>
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500">
                <h2 className="text-lg font-bold text-white">Messages</h2>
                <p className="text-sm text-white/80">Connect with your tribe</p>
              </div>

              {/* Search */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-1">No messages yet</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Start a conversation with a fellow student!</p>
                  </div>
                ) : (
                  conversations.map((convo) => {
                    const participantInfo = getParticipantInfo(convo);
                    return (
                      <button
                        key={convo.id}
                        onClick={() => openConversation(convo)}
                        className="w-full p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800"
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                            {participantInfo ? getInitials(participantInfo.firstName, participantInfo.lastName) : '?'}
                          </div>
                          {participantInfo?.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                              {getParticipantName(convo)}
                            </h3>
                            <span className="text-xs text-slate-400 flex-shrink-0">
                              {convo.lastMessage ? formatMessageTime(convo.lastMessage.timestamp) : ''}
                            </span>
                          </div>

                          {participantInfo && (
                            <p className="text-xs text-teal-600 dark:text-teal-400 mb-1">
                              {participantInfo.currentYear} • {participantInfo.specialty}
                            </p>
                          )}

                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm truncate ${convo.unreadCount > 0 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                              {convo.lastMessage?.senderId === 'current-user' && (
                                <span className="text-teal-500 mr-1">You:</span>
                              )}
                              {convo.lastMessage?.content || 'No messages yet'}
                            </p>

                            {convo.unreadCount > 0 && (
                              <span className="flex-shrink-0 w-5 h-5 bg-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {convo.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* New Message Button */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                <button className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Message
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
