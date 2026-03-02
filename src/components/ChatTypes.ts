export interface ChatMessage {
  messageId: string;
  senderId: string;
  senderName: string;
  receiverId?: string;
  roomId?: string;
  content: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'TYPING' | 'READ';
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  type: 'direct' | 'group';
  lastMessage?: string;
  timestamp?: string;
}
