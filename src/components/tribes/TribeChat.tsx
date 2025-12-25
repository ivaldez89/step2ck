'use client';

import { useState, useRef, useEffect } from 'react';
import type { TribeMessage } from '@/types/tribes';
import { formatTribeTime } from '@/lib/storage/tribeStorage';
import { TrophyIcon, ChatBubbleIcon } from '@/components/icons/MedicalIcons';

interface TribeChatProps {
  messages: TribeMessage[];
  onSendMessage: (content: string) => void;
  currentUserId?: string;
  isMember: boolean;
}

export function TribeChat({
  messages,
  onSendMessage,
  currentUserId = 'current-user',
  isMember,
}: TribeChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isMember) return;

    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map((p) => p[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderMessage = (message: TribeMessage) => {
    const isCurrentUser = message.senderId === currentUserId;
    const isSystem = message.type === 'system' || message.type === 'achievement';

    if (isSystem) {
      return (
        <div key={message.id} className="flex justify-center my-3">
          <div
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-1 ${
              message.type === 'achievement'
                ? 'bg-gradient-to-r from-[#C4A77D]/20 to-[#A89070]/20 text-[#8B7355] border border-[#C4A77D]/30'
                : 'bg-[#F5EFE6] dark:bg-slate-700 text-[#6B5344] dark:text-slate-300'
            }`}
          >
            {message.type === 'achievement' && <TrophyIcon className="w-4 h-4" />}
            {message.content}
          </div>
        </div>
      );
    }

    return (
      <div
        key={message.id}
        className={`flex gap-3 mb-4 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-medium ${
            isCurrentUser
              ? 'bg-gradient-to-br from-[#5B7B6D] to-[#6B8B7D]'
              : 'bg-gradient-to-br from-[#8B7355] to-[#A89070]'
          }`}
        >
          {message.senderAvatar || getInitials(message.senderName)}
        </div>

        {/* Message content */}
        <div className={`max-w-[75%] ${isCurrentUser ? 'text-right' : ''}`}>
          {!isCurrentUser && (
            <p className="text-xs text-[#6B5344]/70 dark:text-slate-400 mb-1">{message.senderName}</p>
          )}
          <div
            className={`inline-block px-4 py-2 rounded-2xl ${
              isCurrentUser
                ? 'bg-gradient-to-r from-[#5B7B6D] to-[#6B8B7D] text-white rounded-br-sm'
                : 'bg-[#F5EFE6] dark:bg-slate-700 text-[#3D5A4C] dark:text-white rounded-bl-sm'
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
          <p className="text-xs text-[#6B5344]/60 dark:text-slate-500 mt-1">
            {formatTribeTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#D4C4B0]/50 dark:border-slate-700 overflow-hidden flex flex-col h-[500px] shadow-sm shadow-[#3D5A4C]/5">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#D4C4B0]/50 dark:border-slate-700 bg-[#F5EFE6] dark:bg-slate-700/50">
        <h3 className="font-semibold text-[#3D5A4C] dark:text-white">Tribe Chat</h3>
        <p className="text-sm text-[#6B5344]/70 dark:text-slate-400">{messages.length} messages</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          <>
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-[#6B5344]/70 dark:text-slate-400">
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <ChatBubbleIcon className="w-12 h-12" />
              </div>
              <p>No messages yet</p>
              <p className="text-sm">Be the first to say hello!</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      {isMember ? (
        <form onSubmit={handleSubmit} className="p-3 border-t border-[#D4C4B0]/50 dark:border-slate-700 bg-[#F5EFE6] dark:bg-slate-700/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-[#D4C4B0]/50 dark:border-slate-600 rounded-full text-[#3D5A4C] dark:text-white placeholder-[#6B5344]/50 dark:placeholder-slate-400 focus:ring-2 focus:ring-[#5B7B6D] focus:border-[#5B7B6D] focus:outline-none"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-gradient-to-r from-[#5B7B6D] to-[#6B8B7D] text-white rounded-full hover:from-[#4A6B5D] hover:to-[#5B7B6D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 border-t border-[#D4C4B0]/50 dark:border-slate-700 bg-[#F5EFE6] dark:bg-slate-700/50 text-center">
          <p className="text-[#6B5344]/70 dark:text-slate-400 text-sm">
            Join this tribe to participate in the chat
          </p>
        </div>
      )}
    </div>
  );
}
