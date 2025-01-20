import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import OnlineStatus from "./OnlineStatus";
import { getUsers } from "@/utils/api";
import { useToast } from "./ui/use-toast";

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  selectedChat: string | null;
}

interface User {
  id: string;
  username: string;
  name: string;
}

const ChatList = ({ onSelectChat, selectedChat }: ChatListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const otherUsers = fetchedUsers.filter(user => user.id !== currentUser.id);
        setUsers(otherUsers);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les utilisateurs",
        });
      }
    };

    fetchUsers();
  }, [toast]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-xl font-semibold flex-1">Messages</h1>
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Aucun utilisateur trouvé
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectChat(user.id)}
              className={`p-4 flex items-center gap-3 hover:bg-accent cursor-pointer transition-colors ${
                selectedChat === user.id ? "bg-accent" : ""
              }`}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <OnlineStatus online={false} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate">{user.username}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground truncate">{user.name}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
