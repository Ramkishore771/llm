import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  RotateCcw,
  Send,
  Brain,
  Sparkles,
  User,
  Bot,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Conversation, ChatMessage } from '../types';

export const AIChatPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.uid || 'guest';
  const storageKey = `llm_conversations_${userId}`;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user conversations
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed: Conversation[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setConversations(parsed);
          setActiveConvId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error('Failed to parse conversations', e);
      }
    }

    // Default initial conversation
    const initial: Conversation = {
      id: 'conv_' + Date.now(),
      userId,
      title: 'LLM Fundamentals Q&A',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        {
          id: 'msg_welcome',
          role: 'assistant',
          content:
            'Hello! I am your personal LLM study mentor. Ask me any question about Transformers, Attention mechanisms, Tokenization, RAG pipelines, or interview problems!',
          timestamp: Date.now(),
        },
      ],
    };
    setConversations([initial]);
    setActiveConvId(initial.id);
  }, [userId, storageKey]);

  // Persist conversations
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(conversations));
    }
  }, [conversations, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConvId, loading]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: 'conv_' + Date.now(),
      userId,
      title: 'New Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        {
          id: 'msg_' + Date.now(),
          role: 'assistant',
          content:
            'How can I help you explore or build with Large Language Models today?',
          timestamp: Date.now(),
        },
      ],
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
  };

  const handleDeleteConversation = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter((c) => c.id !== convId);
    setConversations(updated);
    if (activeConvId === convId) {
      if (updated.length > 0) {
        setActiveConvId(updated[0].id);
      } else {
        handleNewConversation();
      }
    }
  };

  const handleStartRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConvId(conv.id);
    setEditTitleText(conv.title);
  };

  const handleSaveRename = (convId: string) => {
    if (editTitleText.trim()) {
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, title: editTitleText.trim() } : c))
      );
    }
    setEditingConvId(null);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || loading || !activeConversation) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...activeConversation.messages, userMsg];
    setInputMessage('');
    setLoading(true);

    // Update conversation with user message immediately
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              messages: updatedMessages,
              updatedAt: Date.now(),
              // Update title if it's the first real question
              title:
                c.title === 'New Conversation' || c.messages.length <= 1
                  ? userMsg.content.slice(0, 30) + (userMsg.content.length > 30 ? '...' : '')
                  : c.title,
            }
          : c
      )
    );

    try {
      const formattedForApi = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await apiService.chat(
        formattedForApi,
        'You are an expert AI and LLM research mentor. Be concise, mathematically accurate, and educational.'
      );

      const assistantMsg: ChatMessage = {
        id: 'msg_res_' + Date.now(),
        role: 'assistant',
        content: res.text,
        timestamp: Date.now(),
        model: res.model,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: Date.now() }
            : c
        )
      );
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: `Error: ${err.message || 'Unable to generate response. Please check backend connection.'}`,
        timestamp: Date.now(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? { ...c, messages: [...c.messages, errorMsg], updatedAt: Date.now() }
            : c
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.content);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerateLast = async () => {
    if (!activeConversation || activeConversation.messages.length < 2 || loading) return;
    const history = [...activeConversation.messages];
    const lastUserIndex = [...history].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIndex === -1) return;

    // Remove the last assistant response
    const trimmed = history.slice(0, history.length - lastUserIndex);
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversation.id ? { ...c, messages: trimmed } : c))
    );

    setLoading(true);
    try {
      const formattedForApi = trimmed.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await apiService.chat(
        formattedForApi,
        'You are an expert AI and LLM research mentor. Be concise, mathematically accurate, and educational.'
      );

      const assistantMsg: ChatMessage = {
        id: 'msg_regen_' + Date.now(),
        role: 'assistant',
        content: res.text,
        timestamp: Date.now(),
        model: res.model,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: Date.now() }
            : c
        )
      );
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-[#0a0d14] overflow-hidden">
      {/* Sidebar: Conversation History */}
      <div className="w-full md:w-72 bg-[#0c121e] border-r border-[#1f293d] flex flex-col shrink-0">
        <div className="p-3 border-b border-[#1f293d]">
          <button
            onClick={handleNewConversation}
            className="w-full py-2.5 px-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 font-semibold text-xs flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Session</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            const isEditing = editingConvId === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition group ${
                  isActive
                    ? 'bg-sky-500/20 text-white font-semibold border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden flex-1 mr-2">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitleText}
                      onChange={(e) => setEditTitleText(e.target.value)}
                      onBlur={() => handleSaveRename(conv.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(conv.id)}
                      autoFocus
                      className="bg-black/60 text-white text-xs px-1.5 py-0.5 rounded outline-none border border-sky-500 w-full"
                    />
                  ) : (
                    <span className="truncate">{conv.title}</span>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                  <button
                    onClick={(e) => handleStartRename(conv, e)}
                    className="p-1 hover:text-white"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    className="p-1 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* User Privacy indicator */}
        <div className="p-3 border-t border-[#1f293d] text-[11px] text-slate-500 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Private User Workspace</span>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0d14]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeConversation?.messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isCopied = copiedId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md'
                      : 'bg-[#151d2e] border border-sky-500/30 text-sky-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1 max-w-[85%]">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans ${
                      isUser
                        ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-tr-none shadow-md'
                        : 'bg-[#121929] border border-[#1f293d] text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Actions under assistant message */}
                  {!isUser && (
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 pl-1 pt-0.5">
                      <button
                        onClick={() => handleCopyMessage(msg)}
                        className="hover:text-slate-300 flex items-center gap-1"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <span>•</span>
                      <button
                        onClick={handleRegenerateLast}
                        className="hover:text-slate-300 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-3xl">
              <div className="w-8 h-8 rounded-xl bg-[#151d2e] border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-[#121929] border border-[#1f293d] text-slate-400 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>Generating pedagogical response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form at bottom */}
        <div className="p-4 border-t border-[#1f293d] bg-[#0c121e]">
          <form
            onSubmit={handleSendMessage}
            className="max-w-3xl mx-auto flex items-center gap-2 bg-[#141b2c] border border-[#232f48] focus-within:border-sky-500 rounded-2xl p-2 transition"
          >
            <input
              type="text"
              placeholder="Ask an AI concept question (e.g. 'Explain RoPE positional embeddings')..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm px-3 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white disabled:opacity-40 transition shadow-md shadow-sky-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-slate-500 text-center mt-2">
            Responses are synthesized by the backend model. Configured for zero-hallucination pedagogy.
          </div>
        </div>
      </div>
    </div>
  );
};
