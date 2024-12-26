import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Message from "@/components/Message";
import MessageInput from "@/components/MessageInput";
import { useToast } from "@/components/ui/use-toast";

interface SavedMessage {
  id: string;
  text: string;
  timestamp: number;
}

const SavedMessages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const savedMessages = localStorage.getItem(`saved_messages_${currentUser.id}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [currentUser.id]);

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(
      `saved_messages_${currentUser.id}`,
      JSON.stringify(updatedMessages)
    );

    toast({
      title: "Message sauvegardé",
      description: "Votre message a été enregistré avec succès",
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    const updatedMessages = messages.filter((msg) => msg.id !== messageId);
    setMessages(updatedMessages);
    localStorage.setItem(
      `saved_messages_${currentUser.id}`,
      JSON.stringify(updatedMessages)
    );

    toast({
      title: "Message supprimé",
      description: "Le message a été supprimé avec succès",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Messages sauvegardés</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Aucun message sauvegardé
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              id={message.id}
              text={message.text}
              sent={true}
              timestamp={message.timestamp}
              onDelete={handleDeleteMessage}
            />
          ))
        )}
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default SavedMessages;