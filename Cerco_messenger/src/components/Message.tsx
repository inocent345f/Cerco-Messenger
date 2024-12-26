import { useState } from "react";
import { Trash2 } from "lucide-react";

interface MessageProps {
  id: string;
  text: string;
  sent: boolean;
  timestamp: number;
  onDelete?: (id: string) => void;
  onReact?: (id: string, reaction: string) => void;
}

const Message = ({ id, text, sent, timestamp, onDelete, onReact }: MessageProps) => {
  const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];
  const [showActions, setShowActions] = useState(false);

  return (
    <div className={`flex ${sent ? "justify-end" : "justify-start"} group mb-4`}>
      <div className="relative max-w-[80%]">
        <div
          className={`message-bubble ${sent ? "message-sent" : "message-received"} animate-message-in`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <p className="text-sm">{text}</p>
          <span className="text-xs text-muted-foreground mt-1 block">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          
          {showActions && sent && (
            <button
              onClick={() => onDelete?.(id)}
              className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
            </button>
          )}
          
          {showActions && (
            <div className="absolute -bottom-8 left-0 flex gap-1 bg-background rounded-full shadow-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {reactions.map((reaction) => (
                <button
                  key={reaction}
                  onClick={() => onReact?.(id, reaction)}
                  className="hover:scale-125 transition-transform"
                >
                  {reaction}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;