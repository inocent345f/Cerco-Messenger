import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import OnlineStatus from "./OnlineStatus";
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
  const [contacts, setContacts] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const userContacts = JSON.parse(localStorage.getItem(`contacts_${currentUser.id}`) || "[]");
        console.log("Fetched contacts:", userContacts); // Log des contacts récupérés
        setContacts(userContacts);
      } catch (error) {
        console.error("Erreur lors du chargement des contacts:", error); // Log de l'erreur
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les contacts",
        });
      }
    };

    fetchContacts();
  }, [toast, currentUser.id]);

  const filteredContacts = contacts.filter(contact =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        {filteredContacts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Aucun contact trouvé
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelectChat(contact.id)}
              className={`p-4 flex items-center gap-3 hover:bg-accent cursor-pointer transition-colors ${
                selectedChat === contact.id ? "bg-accent" : ""
              }`}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{contact.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <OnlineStatus online={false} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate">{contact.username}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground truncate">{contact.name}</p>
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
