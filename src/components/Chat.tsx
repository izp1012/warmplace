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
        setUnreadCount((prev) => prev + 1);
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
              isGroupChat={isGroupChat}
              setIsGroupChat={setIsGroupChat}
              receiverId={receiverId}
              setReceiverId={setReceiverId}
              roomId={roomId}
              setRoomId={setRoomId}
              receiverValidation={receiverValidation}
              isValidating={isValidating}
              onReceiverKeyDown={handleReceiverKeyDown}
              onRoomIdKeyDown={handleRoomIdKeyDown}
              userSuggestions={filteredUserSuggestions}
              onSelectUserSuggestion={(u: User) => {
                setReceiverId(u.username);
                setReceiverValidation('valid');
                openDirectConversation(u.username);
              }}
            />
            <ChatPanel
              isGroupChat={isGroupChat}
              messages={messages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              roomId={roomId}
              error={error}
              isSending={isSending}
              selectedConversation={selectedConversation}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              onSendMessage={sendMessage}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
