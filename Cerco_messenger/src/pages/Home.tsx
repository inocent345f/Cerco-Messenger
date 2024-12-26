import { useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

const Home = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  return (
    <div className="flex h-full">
      <div className={`${
        selectedChat ? 'hidden md:block' : 'w-full'
      } md:w-80 border-r border-border`}>
        <ChatList onSelectChat={setSelectedChat} selectedChat={selectedChat} />
      </div>
      <div className={`${
        !selectedChat ? 'hidden md:flex' : 'w-full'
      } md:flex-1 bg-background`}>
        {selectedChat ? (
          <ChatWindow chatId={selectedChat} onBack={() => setSelectedChat(null)} />
        ) : (
          <div className="hidden md:flex h-full items-center justify-center text-muted-foreground flex-col gap-4">
            <p>Sélectionnez une conversation pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;