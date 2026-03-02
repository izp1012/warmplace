import { MessageSquare, User } from 'lucide-react';
import type { Conversation } from './ChatTypes';
import './Chat.css';

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conv: Conversation) => void;
}

export function ChatSidebar({ conversations, selectedConversation, onSelectConversation }: ChatSidebarProps) {
  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">대화 목록</div>
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
