import { useRef, useEffect } from 'react';
import { MessageCircle, Send, MessageSquare, User, CheckCircle, XCircle } from 'lucide-react';
import type { ChatMessage, Conversation } from './ChatTypes';
import type { User as ChatUser } from '../services/auth';
import closeIcon from '../assets/chat-close.png';
import './Chat.css';

interface ChatPanelProps {
  isGroupChat: boolean;
  setIsGroupChat: (value: boolean) => void;
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (value: string) => void;
  receiverId: string;
  setReceiverId: (value: string) => void;
  roomId: string;
  setRoomId: (value: string) => void;
  error: string;
  isSending: boolean;
  receiverValidation: 'valid' | 'invalid' | null;
  isValidating: boolean;
  selectedConversation: Conversation | null;
  currentUserId: string;
  currentUserName: string;
  onSendMessage: () => void;
  onReceiverKeyDown: (e: React.KeyboardEvent) => void;
  onRoomIdKeyDown: (e: React.KeyboardEvent) => void;
  onClose: () => void;
  userSuggestions?: ChatUser[];
  onSelectUserSuggestion?: (user: ChatUser) => void;
}

export function ChatPanel({
  isGroupChat,
  setIsGroupChat,
  messages,
  inputMessage,
  setInputMessage,
  receiverId,
  setReceiverId,
  roomId,
  setRoomId,
  error,
  isSending,
  receiverValidation,
  isValidating,
  selectedConversation,
  currentUserId,
  currentUserName,
  onSendMessage,
  onReceiverKeyDown,
  onRoomIdKeyDown,
  onClose,
  userSuggestions,
  onSelectUserSuggestion,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="chat-main">
      <div className="chat-header">
        <div className="chat-header-title">
          <MessageCircle size={22} />
          <div className="chat-header-text">
            <span className="chat-title-main">
              {selectedConversation
                ? selectedConversation.name
                : isGroupChat
                  ? '그룹 채팅'
                  : '1:1 채팅'}
            </span>
            <span className="chat-title-sub">
              {isGroupChat ? '여러 사람과 함께 대화하기' : '한 명과 대화하기'}
            </span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button 
            className={`mode-btn ${!isGroupChat ? 'active' : ''}`}
            onClick={() => setIsGroupChat(false)}
            title="1:1 채팅으로 전환"
          >
            <User size={18} />
            <span className="mode-label">1:1</span>
          </button>
          <button 
            className={`mode-btn ${isGroupChat ? 'active' : ''}`}
            onClick={() => setIsGroupChat(true)}
            title="그룹 채팅으로 전환"
          >
            <MessageSquare size={18} />
            <span className="mode-label">그룹</span>
          </button>
          <button className="close-btn" onClick={onClose} title="채팅 닫기">
            <img src={closeIcon} alt="닫기" className="chat-close-icon" />
          </button>
        </div>
      </div>

      <div className="chat-settings">
        {isGroupChat ? (
          <input
            type="text"
            placeholder="방 ID 입력 후 Enter (기본: general)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyDown={onRoomIdKeyDown}
            className="chat-input"
          />
        ) : (
          <div className="receiver-input-wrapper">
            <input
              type="text"
              placeholder="받는 사람 ID 또는 닉네임 입력 후 Enter"
              value={receiverId}
              onChange={(e) => { setReceiverId(e.target.value); }}
              onKeyDown={onReceiverKeyDown}
              className="chat-input"
            />
            {isValidating && <span className="receiver-validation-loading">...</span>}
            {receiverValidation === 'valid' && <CheckCircle size={18} className="receiver-valid-icon" />}
            {receiverValidation === 'invalid' && <XCircle size={18} className="receiver-invalid-icon" />}
            {!isGroupChat && userSuggestions && onSelectUserSuggestion && userSuggestions.length > 0 && (
              <div className="user-suggestions">
                {userSuggestions.map((u) => (
                  <button
                    type="button"
                    key={u.id}
                    className="user-suggestion-item"
                    onClick={() => onSelectUserSuggestion(u)}
                  >
                    <span className="user-suggestion-name">
                      {u.nickname || u.username}
                    </span>
                    <span className="user-suggestion-username">
                      @{u.username}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="chat-error">
          {error}
        </div>
      )}

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            {isGroupChat 
              ? `그룹 "${roomId}"로 메시지를 보내보세요`
              : '상대방 ID를 입력하고 메시지를 보내보세요'}
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.messageId}
              className={`message ${msg.senderId === currentUserId || msg.senderId === currentUserName ? 'own' : ''}`}
            >
              <div className="message-sender">{msg.senderName}</div>
              <div className="message-content">{msg.content}</div>
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="메시지 입력..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="chat-message-input"
          disabled={isSending}
        />
        <button 
          className="send-btn" 
          onClick={onSendMessage}
          disabled={isSending}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
