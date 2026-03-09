import { useState, useEffect, useRef, useCallback } from 'react';
import { authService, type User } from '../services/auth';
import type { ChatMessage, Conversation } from './ChatTypes';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '../config';

const getWsUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_WS_URL_PROD || '';
  }
  return import.meta.env.VITE_WS_URL_DEV || '';
};

const apiUrl = (path: string) => {
  if (!path.startsWith('/')) return API_BASE_URL ? `${API_BASE_URL}/${path}` : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
};

interface UseChatCoreParams {
  currentUserId: string;
  currentUserName: string;
}

export function useChatCore({ currentUserId, currentUserName }: UseChatCoreParams) {
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [roomId, setRoomId] = useState('general');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [receiverValidation, setReceiverValidation] = useState<'valid' | 'invalid' | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);

  const stompClientRef = useRef<Stomp.Client | null>(null);
  const subscriptionsRef = useRef<Stomp.StompSubscription[]>([]);

  const connectWebSocket = useCallback(() => {
    if (!currentUserId) return;

    const token = localStorage.getItem('token');
    const wsUrl = getWsUrl();
    const socket = new SockJS(wsUrl);
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect(
      { Authorization: token ? `Bearer ${token}` : '' },
      () => {
        const directSub = stompClient.subscribe(`/queue/${currentUserId}/messages`, (message: Stomp.Message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages(prev => [...prev, receivedMessage]);

          const senderId = receivedMessage.senderId;
          setConversations(prev => {
            const exists = prev.find(c => c.id === senderId && c.type === 'direct');
            if (exists) {
              return prev.map(c =>
                c.id === senderId && c.type === 'direct'
                  ? { ...c, lastMessage: receivedMessage.content, timestamp: receivedMessage.timestamp }
                  : c
              );
            }
            return [
              ...prev,
              {
                id: senderId,
                name: receivedMessage.senderName,
                type: 'direct',
                lastMessage: receivedMessage.content,
                timestamp: receivedMessage.timestamp,
              },
            ];
          });
        });
        subscriptionsRef.current.push(directSub);
      },
      (error: string) => {
        console.error('STOMP error:', error);
      }
    );
  }, [currentUserId]);

  const disconnectWebSocket = useCallback(() => {
    subscriptionsRef.current.forEach(sub => sub.unsubscribe());
    subscriptionsRef.current = [];
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
      stompClientRef.current = null;
    }
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await authService.getAllUsers();
        setUserList(users.filter(u => u.username !== currentUserId));
      } catch (e) {
        console.error('Failed to load user list:', e);
      }
    };

    if (authService.isAuthenticated()) {
      loadUsers();
    }
  }, [currentUserId]);

  useEffect(() => {
    const loadChatRooms = async () => {
      if (!currentUserId) return;

      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(apiUrl(`/api/chat/rooms/${currentUserId}`), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        const rooms: Conversation[] = data.map((r: any) => {
          const type: 'direct' | 'group' = r.type === 'group' ? 'group' : 'direct';

          if (type === 'group') {
            return {
              id: r.id,
              name: r.name,
              type,
              lastMessage: r.lastMessage,
              timestamp: r.lastMessageTime,
            } as Conversation;
          }

          // direct 채팅방의 경우 name: "userA_userB" 형태이므로,
          // 현재 사용자 기준으로 상대방 ID를 추출해서 id/name 으로 사용
          const parts = (r.name || '').split('_').filter((p: string) => p);
          let otherUser = parts.find((p: string) => p !== currentUserId);
          if (!otherUser && parts.length > 0) {
            otherUser = parts[0];
          }

          return {
            id: otherUser || r.id,
            name: otherUser || r.name,
            type,
            lastMessage: r.lastMessage,
            timestamp: r.lastMessageTime,
          } as Conversation;
        });

        setConversations(rooms);
        if (!selectedConversation && rooms.length > 0) {
          setSelectedConversation(rooms[0]);
        }
      } catch (e) {
        console.error('Failed to load chat rooms:', e);
      }
    };

    loadChatRooms();
  }, [currentUserId, selectedConversation]);

  useEffect(() => {
    connectWebSocket();
    return () => disconnectWebSocket();
  }, [connectWebSocket, disconnectWebSocket]);

  useEffect(() => {
    if (stompClientRef.current && isGroupChat && roomId) {
      // 그룹 topic 구독은 여기서만 관리 (중복 구독 방지)
      const existingGroupSubs = subscriptionsRef.current.filter(sub =>
        sub.destination?.includes('/topic/group/')
      );
      existingGroupSubs.forEach(sub => sub.unsubscribe());
      subscriptionsRef.current = subscriptionsRef.current.filter(
        sub => !sub.destination?.includes('/topic/group/')
      );

      const groupSub = stompClientRef.current.subscribe(
        `/topic/group/${roomId}`,
        (message: Stomp.Message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages(prev => [...prev, receivedMessage]);

          const groupRoomId = receivedMessage.roomId || roomId;
          setConversations(prev => {
            const exists = prev.find(c => c.id === groupRoomId && c.type === 'group');
            if (exists) {
              return prev.map(c =>
                c.id === groupRoomId && c.type === 'group'
                  ? { ...c, lastMessage: receivedMessage.content, timestamp: receivedMessage.timestamp }
                  : c
              );
            }
            return [
              ...prev,
              {
                id: groupRoomId,
                name: groupRoomId,
                type: 'group',
                lastMessage: receivedMessage.content,
                timestamp: receivedMessage.timestamp,
              },
            ];
          });
        }
      );
      subscriptionsRef.current.push(groupSub);
    }
  }, [isGroupChat, roomId]);

  const filteredUserSuggestions =
    !isGroupChat && receiverId
      ? userList
          .filter(u => {
            const query = receiverId.toLowerCase();
            const usernameMatch = u.username.toLowerCase().includes(query);
            const nicknameMatch = (u.nickname || '').toLowerCase().includes(query);
            return usernameMatch || nicknameMatch;
          })
          .slice(0, 5)
      : [];

  const validateReceiver = async (username: string) => {
    if (!username.trim()) {
      setReceiverValidation(null);
      return null;
    }

    setIsValidating(true);
    try {
      const exists = await authService.checkUserExists(username.trim());
      setReceiverValidation(exists ? 'valid' : 'invalid');
      return exists;
    } catch {
      setReceiverValidation(null);
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  const openDirectConversation = async (username: string) => {
    const trimmed = username.trim();
    if (!trimmed) return;

    const newConv: Conversation = {
      id: trimmed,
      name: trimmed,
      type: 'direct',
      lastMessage: '',
      timestamp: new Date().toISOString()
    };

    setSelectedConversation(prev => {
      if (prev && prev.id === newConv.id && prev.type === 'direct') {
        return prev;
      }
      return newConv;
    });

    setConversations(prev => {
      if (prev.find(c => c.id === newConv.id && c.type === 'direct')) {
        return prev;
      }
      return [newConv, ...prev];
    });

    setSelectedConversation(newConv);
    setReceiverId(trimmed); // 입력창 연동
    setIsGroupChat(false);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(apiUrl(`/api/chat/direct/${currentUserId}/${trimmed}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const oldMessages = await response.json();
        const normalizedMessages: ChatMessage[] =
          oldMessages.length > 0
            ? oldMessages.map((msg: ChatMessage) => ({
                ...msg,
                timestamp: msg.timestamp,
              }))
            : [];
        setMessages(normalizedMessages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleReceiverKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const exists = await validateReceiver(receiverId);
      if (exists) {
        await openDirectConversation(receiverId);
      }
    }
  };

  const handleRoomIdKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const rid = roomId.trim() || 'general';
      const newConv: Conversation = {
        id: rid,
        name: rid,
        type: 'group',
        lastMessage: '',
        timestamp: new Date().toISOString()
      };

      setConversations(prev => {
        if (prev.find(c => c.id === newConv.id && c.type === 'group')) {
          return prev;
        }
        return [...prev, newConv];
      });

      setSelectedConversation(newConv);
      setMessages([]);

      const token = localStorage.getItem('token');
      if (token) {
        fetch(apiUrl('/api/chat/join'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            senderId: currentUserId,
            senderName: currentUserName,
            roomId: rid,
          }),
        }).catch((err) => console.error('Failed to join group room:', err));
      }
    }
  };

  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedConversation(conv);
    if (conv.type === 'group') {
      setIsGroupChat(true);
      setRoomId(conv.id);
    } else {
      setIsGroupChat(false);
      setReceiverId(conv.id);
    }

    const token = localStorage.getItem('token');
    try {
      let response;
      if (conv.type === 'group') {
        response = await fetch(apiUrl(`/api/chat/group/${conv.id}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await fetch(apiUrl(`/api/chat/direct/${currentUserId}/${conv.id}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (response.ok) {
        const oldMessages = await response.json();
        setMessages(oldMessages.length > 0 ? oldMessages : []);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const sendMessage = async () => {
    setError('');

    if (!currentUserId) {
      setError('로그인이 필요합니다');
      return;
    }

    if (!isGroupChat && !receiverId.trim()) {
      setError('받는 사람의 ID를 입력해주세요');
      return;
    }

    if (!isGroupChat && receiverValidation !== 'valid') {
      const exists = await authService.checkUserExists(receiverId.trim());
      if (!exists) {
        setError('존재하지 않는 사용자입니다');
        setReceiverValidation('invalid');
        return;
      }
      setReceiverValidation('valid');
    }

    if (isGroupChat && !roomId.trim()) {
      setError('방 ID를 입력해주세요');
      return;
    }

    if (!inputMessage.trim()) {
      return;
    }

    const endpoint = isGroupChat ? '/api/chat/group' : '/api/chat/direct';
    const payload = isGroupChat
      ? { senderId: currentUserId, senderName: currentUserName, roomId, content: inputMessage }
      : { senderId: currentUserId, senderName: currentUserName, receiverId: receiverId.trim(), content: inputMessage };

    const token = localStorage.getItem('token');

    if (!token) {
      setError('로그인이 필요합니다');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(apiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // 그룹 채팅은 서버 broadcast(WebSocket)로 다시 수신되므로
        // 여기서 optimistic append 하면 같은 내용이 중복 표시될 수 있음.
        if (!isGroupChat) {
          const newMessage: ChatMessage = {
            messageId: Date.now().toString(),
            senderId: currentUserId,
            senderName: currentUserName,
            content: inputMessage,
            type: 'CHAT',
            timestamp: new Date().toISOString(),
            receiverId: receiverId.trim(),
          };
          setMessages(prev => [...prev, newMessage]);
        }
        setInputMessage('');

        const targetId = isGroupChat ? roomId : receiverId.trim();
        const targetName = isGroupChat ? roomId : receiverId.trim();
        const convType: 'direct' | 'group' = isGroupChat ? 'group' : 'direct';

        setConversations(prev => {
          const exists = prev.find(c => c.id === targetId && c.type === convType);
          if (exists) {
            return prev.map(c =>
              c.id === targetId && c.type === convType
                ? { ...c, lastMessage: inputMessage, timestamp: new Date().toISOString() }
                : c
            );
          }
          return [
            ...prev,
            {
              id: targetId,
              name: targetName,
              type: convType,
              lastMessage: inputMessage,
              timestamp: new Date().toISOString(),
            },
          ];
        });
      } else {
        const result = await response.json();
        setError(result.error || '메시지 전송에 실패했습니다');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('네트워크 오류가 발생했습니다');
    } finally {
      setIsSending(false);
    }
  };

  return {
    // state
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
    setReceiverValidation,
    userList,
    // actions
    sendMessage,
    handleReceiverKeyDown,
    handleRoomIdKeyDown,
    handleSelectConversation,
    openDirectConversation,
    setSelectedConversation,
    setMessages,
  };
}

