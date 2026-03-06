import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ChatPage.css';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatPanel } from '../components/ChatPanel';
import { useChatCore } from '../components/useChatCore';
import type { Conversation } from '../components/ChatTypes';
import type { User } from '../services/auth';
import { MessageCircle, Plus } from 'lucide-react';

export function ChatPage() {
  const { user } = useAuth();
  const currentUserId = user?.username || user?.id?.toString() || '';
  const currentUserName = user?.nickname || user?.username || '';
  const [isAddingChat, setIsAddingChat] = useState(false);
  const [newChatQuery, setNewChatQuery] = useState('');

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
    userList,
  } = useChatCore({ currentUserId, currentUserName });

  if (!user) {
    return (
      <div className="chat-page-container">
        <div className="chat-page-empty">
          <MessageCircle size={48} />
          <p>로그인 후 채팅을 이용하세요</p>
        </div>
      </div>
    );
  }

  const pageUserSuggestions = newChatQuery
    ? userList
        .filter((u) => {
          const query = newChatQuery.toLowerCase();
          const usernameMatch = u.username.toLowerCase().includes(query);
          const nicknameMatch = (u.nickname || '').toLowerCase().includes(query);
          const alreadyHasConv = conversations.some(
            (c) => c.type === 'direct' && c.id === u.username,
          );
          return (usernameMatch || nicknameMatch) && !alreadyHasConv;
        })
        .slice(0, 5)
    : [];

  const startDirectChat = (username: string, nickname?: string) => {
    setNewChatQuery('');
    setIsAddingChat(false);
    handleSelectConversation({ id: username, name: nickname || username, type: 'direct' });
    openDirectConversation(username);
  };

  const handleNewChatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (pageUserSuggestions.length > 0) {
        const u = pageUserSuggestions[0];
        startDirectChat(u.username, u.nickname || u.username);
      }
    }
  };

  return (
    <div className="chat-page-container">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>메시지</h2>
          <button
            className="add-chat-btn"
            onClick={() => setIsAddingChat((prev) => !prev)}
          >
            <Plus size={20} />
          </button>
        </div>

        {isAddingChat && (
          <div className="add-chat-form">
            <div className="add-chat-input-wrapper">
              <input
                type="text"
                placeholder="사용자 ID 또는 닉네임 입력"
                value={newChatQuery}
                onChange={(e) => setNewChatQuery(e.target.value)}
                onKeyDown={handleNewChatKeyDown}
                className="chat-input"
                autoFocus
              />
              {pageUserSuggestions.length > 0 && (
                <div className="user-suggestions">
                  {pageUserSuggestions.map((u) => (
                    <button
                      type="button"
                      key={u.id}
                      className="user-suggestion-item"
                      onClick={() =>
                        startDirectChat(u.username, u.nickname || u.username)
                      }
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
          </div>
        )}

        <ChatSidebar
          conversations={conversations as Conversation[]}
          selectedConversation={selectedConversation as Conversation | null}
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
            setReceiverId('');
            handleSelectConversation({ id: u.username, name: u.nickname || u.username, type: 'direct' });
            openDirectConversation(u.username);
          }}
        />
      </div>

      <div className="chat-main">
        {conversations.length === 0 ? (
          <div className="chat-no-room">
            <MessageCircle size={64} />
            <h3>메시지를 선택하세요</h3>
            <p>새 채팅을 시작하거나 기존 채팅방을 선택하세요</p>
          </div>
        ) : (
          <ChatPanel
            isGroupChat={isGroupChat}
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            roomId={roomId}
            error={error}
            isSending={isSending}
            selectedConversation={selectedConversation as Conversation | null}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            onSendMessage={sendMessage}
            onClose={() => {}}
          />
        )}
      </div>
    </div>
  );
}
