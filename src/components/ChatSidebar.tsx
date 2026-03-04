import { MessageSquare, User, CheckCircle, XCircle } from 'lucide-react';
import type { Conversation } from './ChatTypes';
import type { User as ChatUser } from '../services/auth';
import './Chat.css';

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conv: Conversation) => void;
  isGroupChat: boolean;
  setIsGroupChat: (value: boolean) => void;
  receiverId: string;
  setReceiverId: (value: string) => void;
  roomId: string;
  setRoomId: (value: string) => void;
  receiverValidation: 'valid' | 'invalid' | null;
  isValidating: boolean;
  onReceiverKeyDown: (e: React.KeyboardEvent) => void;
  onRoomIdKeyDown: (e: React.KeyboardEvent) => void;
  userSuggestions?: ChatUser[];
  onSelectUserSuggestion?: (user: ChatUser) => void;
}

export function ChatSidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  isGroupChat,
  setIsGroupChat,
  receiverId,
  setReceiverId,
  roomId,
  setRoomId,
  receiverValidation,
  isValidating,
  onReceiverKeyDown,
  onRoomIdKeyDown,
  userSuggestions,
  onSelectUserSuggestion,
}: ChatSidebarProps) {
  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">대화 목록</div>

      <div className="chat-sidebar-add">
        <div className="chat-sidebar-mode">
          <button
            type="button"
            className={`mode-btn ${!isGroupChat ? 'active' : ''}`}
            onClick={() => setIsGroupChat(false)}
            title="1:1 채팅"
          >
            <User size={16} />
            <span className="mode-label">1:1</span>
          </button>
          <button
            type="button"
            className={`mode-btn ${isGroupChat ? 'active' : ''}`}
            onClick={() => setIsGroupChat(true)}
            title="그룹 채팅"
          >
            <MessageSquare size={16} />
            <span className="mode-label">그룹</span>
          </button>
        </div>
        {isGroupChat ? (
          <input
            type="text"
            placeholder="방 ID 입력 후 Enter (기본: general)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyDown={onRoomIdKeyDown}
            className="chat-input chat-sidebar-input"
          />
        ) : (
          <div className="receiver-input-wrapper">
            <input
              type="text"
              placeholder="받는 사람 ID 또는 닉네임 입력 후 Enter"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              onKeyDown={onReceiverKeyDown}
              className="chat-input chat-sidebar-input"
            />
            {isValidating && <span className="receiver-validation-loading">...</span>}
            {receiverValidation === 'valid' && <CheckCircle size={18} className="receiver-valid-icon" />}
            {receiverValidation === 'invalid' && <XCircle size={18} className="receiver-invalid-icon" />}
            {userSuggestions &&
              onSelectUserSuggestion &&
              userSuggestions.length > 0 &&
              receiverId.trim().length > 0 &&
              receiverId !== (selectedConversation?.type === 'direct' ? selectedConversation.id : '') && (
              <div className="user-suggestions">
                {userSuggestions.map((u) => (
                  <button
                    type="button"
                    key={u.id}
                    className="user-suggestion-item"
                    onClick={() => onSelectUserSuggestion(u)}
                  >
                    <span className="user-suggestion-name">{u.nickname || u.username}</span>
                    <span className="user-suggestion-username">@{u.username}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="chat-conversation-list">
        {conversations.length === 0 ? (
          <div className="chat-sidebar-empty">대화가 없습니다</div>
        ) : (
          conversations.map((conv) => (
            <div
              key={`${conv.type}-${conv.id}`}
              className={`chat-conversation-item ${selectedConversation?.id === conv.id && selectedConversation?.type === conv.type ? 'active' : ''}`}
              onClick={() => onSelectConversation(conv)}
            >
              <div className="chat-conversation-name">
                {conv.type === 'group' ? <MessageSquare size={14} /> : <User size={14} />}
                <span style={{ marginLeft: 6 }}>{conv.name}</span>
              </div>
              {conv.lastMessage && (
                <div className="chat-conversation-preview">{conv.lastMessage}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
