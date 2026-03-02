import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { User } from '../services/auth';
import { ChatSidebar } from './ChatSidebar';
import { ChatPanel } from './ChatPanel';
import { useChatCore } from './useChatCore';
import './Chat.css';

export function Chat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // WebSocket 식별자는 username 기준으로 통일
  const currentUserId = user?.username || user?.id?.toString() || '';
  const currentUserName = user?.nickname || user?.username || '';
  const {
    isGroupChat,
    setIsGroupChat,
    messages,
    conversations,
    selectedConversation,
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
    filteredUserSuggestions,
    sendMessage,
    handleReceiverKeyDown,
    handleRoomIdKeyDown,
    handleSelectConversation,
    openDirectConversation,
    setReceiverValidation,
  } = useChatCore({ currentUserId, currentUserName });

  useEffect(() => {
    if (messages.length > 0 && !isOpen) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.senderId !== currentUserId) {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen, currentUserId]);

  if (!user) {
    return null;
  }

  return (
    <>
      <button className="chat-toggle-btn" onClick={() => { setIsOpen(true); setUnreadCount(0); }}>
        <MessageCircle size={24} />
        {unreadCount > 0 && <span className="chat-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="chat-overlay">
          <div className="chat-modal">
            <ChatSidebar 
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
            />
            <ChatPanel
              isGroupChat={isGroupChat}
              setIsGroupChat={setIsGroupChat}
              messages={messages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              receiverId={receiverId}
              setReceiverId={setReceiverId}
              roomId={roomId}
              setRoomId={setRoomId}
              error={error}
              isSending={isSending}
              receiverValidation={receiverValidation}
              isValidating={isValidating}
              selectedConversation={selectedConversation}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              onSendMessage={sendMessage}
              onReceiverKeyDown={handleReceiverKeyDown}
              onRoomIdKeyDown={handleRoomIdKeyDown}
              onClose={() => setIsOpen(false)}
              userSuggestions={filteredUserSuggestions}
              onSelectUserSuggestion={(user: User) => {
                setReceiverId('');
                setReceiverValidation('valid');
                openDirectConversation(user.username);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
