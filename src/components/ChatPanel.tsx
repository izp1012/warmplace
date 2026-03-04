import { useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import type { ChatMessage, Conversation } from './ChatTypes';
import closeIcon from '../assets/chat-close.png';
import './Chat.css';

interface ChatPanelProps {
  isGroupChat: boolean;
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (value: string) => void;
  roomId: string;
  error: string;
  isSending: boolean;
  selectedConversation: Conversation | null;
  currentUserId: string;
  currentUserName: string;
  onSendMessage: () => void;
  onClose: () => void;
}

export function ChatPanel({
  isGroupChat,
  messages,
  inputMessage,
  setInputMessage,
  roomId,
  error,
  isSending,
  selectedConversation,
  currentUserId,
  currentUserName,
  onSendMessage,
  onClose,
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
          <button className="close-btn" onClick={onClose} title="채팅 닫기">
            <img src={closeIcon} alt="닫기" className="chat-close-icon" />
          </button>
        </div>
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
              : '왼쪽에서 대화상대를 선택하고 메시지를 보내보세요'}
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
                  minute: '2-digit',
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
