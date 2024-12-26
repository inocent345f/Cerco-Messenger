interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

export const saveMessage = (message: Message) => {
  const conversationId = [message.senderId, message.receiverId].sort().join('-');
  const existingMessages = JSON.parse(localStorage.getItem(`conversation_${conversationId}`) || '[]');
  const updatedMessages = [...existingMessages, message];
  localStorage.setItem(`conversation_${conversationId}`, JSON.stringify(updatedMessages));
};

export const getConversation = (userId1: string, userId2: string) => {
  const conversationId = [userId1, userId2].sort().join('-');
  return JSON.parse(localStorage.getItem(`conversation_${conversationId}`) || '[]');
};