import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Plus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUsers } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: string;
  username: string;
  name: string;
  status?: string;
  profile_picture_url?: string;
}

const Contacts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<User[]>([]);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Récupérer l'username de l'utilisateur actuel
        const currentUsername = localStorage.getItem('username');
        if (!currentUsername) {
          console.error('Utilisateur non connecté');
          return;
        }

        // Récupérer tous les utilisateurs sauf l'utilisateur actuel
        const response = await getUsers();
        const filteredUsers = response.filter(user => user.username !== currentUsername);
        setAllUsers(filteredUsers);

        // Récupérer les contacts de l'utilisateur
        const userContacts = JSON.parse(localStorage.getItem(`contacts_${currentUser.id}`) || "[]");
        setContacts(userContacts);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des utilisateurs",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, []);

  const addContact = (user: User) => {
    const newContacts = [...contacts, user];
    setContacts(newContacts);
    localStorage.setItem(`contacts_${currentUser.id}`, JSON.stringify(newContacts));
    toast({
      title: "Contact ajouté",
      description: `${user.username} a été ajouté à vos contacts`,
    });
  };

  const isContact = (userId: string) => {
    return contacts.some(contact => contact.id === userId);
  };

  const filteredUsers = (users: User[]) => {
    return users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const startChat = (userId: string) => {
    navigate(`/?chatId=${userId}`);
  };

  const viewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };
  

  return (
    <div className="h-screen overflow-y-auto bg-background">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Contacts</h1>
        </div>
      </div>

      <div className="p-4" style={{ height: 'calc(120vh - 10px)', overflowY: 'auto' }}>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="contacts" className="flex-1">Contacts</TabsTrigger>
            <TabsTrigger value="all-users" className="flex-1">Tous les utilisateurs</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <div className="space-y-2">
              {filteredUsers(contacts).map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer focus:outline-none"
                  onClick={() => startChat(contact.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={contact.profile_picture_url} alt={`${contact.name}'s profile`} />
                      <AvatarFallback>{contact.name ? contact.name.charAt(0).toUpperCase() : contact.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{contact.name || contact.username}</h3>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={(e) => {
                    e.stopPropagation();
                    startChat(contact.id);
                  }}>
                    Message
                  </Button>
                </div>
              ))}
              {filteredUsers(contacts).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucun contact trouvé
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="all-users">
            <div className="space-y-2">
              {filteredUsers(allUsers).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer focus:outline-none"
                  //onClick={() => viewProfile(user.id)}
                  onClick={() => startChat(user.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.profile_picture_url} alt={`${user.name}'s profile`} />
                      <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{user.name || user.username}</h3>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!isContact(user.id) && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          addContact(user);
                        }}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        startChat(user.id);
                      }}
                    >
                      Message
                    </Button>
                  </div>
                </div>
              ))}
              {filteredUsers(allUsers).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucun utilisateur trouvé
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Contacts;
