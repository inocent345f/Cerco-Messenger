import { useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  receiverId?: string;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky bottom-0">
      <div className="flex items-center gap-2 max-w-[800px] mx-auto">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground hover:text-foreground hidden md:flex"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1 p-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Button 
          type="button"
          variant="ghost" 
          size="icon"
          className="text-muted-foreground hover:text-foreground hidden md:flex"
        >
          <Smile className="h-5 w-5" />
        </Button>
        <Button
          type="submit"
          size="icon"
          className="rounded-full bg-primary hover:bg-primary/90"
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;