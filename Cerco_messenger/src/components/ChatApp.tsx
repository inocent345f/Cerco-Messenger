import React, { useState, useEffect } from 'react';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';

const ChatApp = () => {
  const [selectedChatUser, setSelectedChatUser] = useState<{
    id: string;
    username: string;
    name: string;
    profile_picture_url?: string;
  } | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    const fetchContacts = () => {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userContacts = JSON.parse(localStorage.getItem(`contacts_${currentUser.id}`) || "[]");
      setContacts(userContacts);
     // console.log("Contacts chargés:", userContacts);
    };
    fetchContacts();
  }, []);

  const handleSelectChat = (chatId: string) => {
    const user = contacts.find(contact => contact.id === chatId);
   // console.log("Utilisateur sélectionné:", user);
    if (user) {
      setSelectedChatUser({
        id: user.id,
        username: user.username,
        name: user.name,
        profile_picture_url: user.profile_picture_url
      });
    }
  };

  return (
    <div className="flex h-full">
      <div className={
        `${selectedChatUser ? 'hidden md:block' : 'w-full'} md:w-80 border-r border-border`}>
        <ChatList onSelectChat={handleSelectChat} selectedChat={selectedChatUser ? selectedChatUser.id : null} />
      </div>
      <div className={`${!selectedChatUser ? 'hidden md:flex' : 'w-full'
      } md:flex-1 bg-background`}>
        {selectedChatUser ? (
          <ChatWindow selectedChatUser={selectedChatUser} onBack={() => setSelectedChatUser(null)} />
        ) : (
          <div className="flex h-screen items-center justify-center text-muted-foreground flex-col gap-4 w-full h-screen">
            <p>Sélectionnez une conversation pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatApp;