import { useState, useEffect } from "react";
import Message from "@/components/Message";
import MessageInput from "@/components/MessageInput";
import { ArrowLeft, Phone, Video, MoreVertical, Star, Archive, Delete, Ban, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { getMessages, sendMessage, getUserIdByUsername, getChatId, getUserByUsername } from "@/utils/api";

// Définition des interfaces pour les props et les messages
interface ChatWindowProps {
  selectedChatUser: { username: string; name: string; profile_picture_url?: string } | null;
  onBack: () => void;
}

interface MessageType {
  id: string;
  text: string;
  sent: boolean;
  timestamp: number;
  profile_picture_url?: string;
}

// Composant principal de la fenêtre de chat
const ChatWindow = ({ selectedChatUser, onBack }: ChatWindowProps) => {
 // console.log("Détails de l'utilisateur sélectionné dans ChatWindow:", selectedChatUser);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatUser, setChatUser] = useState<{ username: string; name: string; profile_picture_url?: string } | null>(selectedChatUser ? { username: selectedChatUser.username, name: selectedChatUser.name, profile_picture_url: selectedChatUser.profile_picture_url } : null);
  //console.log("les détail sur l'utilisateur selectionné",selectedChatUser);
  //const [currentUser, setCurrentUser] = useState<any>(JSON.parse(localStorage.getItem("user") || "{}"));
 // console.log("les détail sur l'utilisateur connecté",currentUser);
  const navigate = useNavigate();
  const { toast } = useToast();
  const username = localStorage.getItem('username');
  const [messageContent, setMessageContent] = useState('');

  // useEffect(() => {
  //   const fetchCurrentUser = async () => {
  //     const username = localStorage.getItem('username'); // Récupérer le nom d'utilisateur actuel
  //     console.log(username)
  //   //   const userProfile = await getUserByUsername(username); // Récupérer les détails de l'utilisateur
  //   //   setCurrentUser(userProfile); // Mettre à jour l'état avec les détails de l'utilisateur
  //   };

  //   fetchCurrentUser();
  // }, []);

  // Effet pour établir la connexion WebSocket
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/${chatId}`);

    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return () => {
      socket.close();
    };
  }, [chatId]);

  // Effet pour récupérer le chatID de chat
  useEffect(() => {
    const fetchChatId = async () => {
      if (chatUser) {
        const chatId = await getChatId(username, selectedChatUser.username);
        console.log(username)
        setChatId(chatId); // Mettre à jour l'état avec le chat_id récupéré
      }
    };
    fetchChatId();
  }, [chatUser]);

  useEffect(() => {
    const fetchChatId = async () => {
      if (chatUser) {
        const chatId = await getChatId(username, selectedChatUser.username);
        setChatId(chatId);
      }
    };

    fetchChatId();
  }, [selectedChatUser]);

  useEffect(() => {
    const fetchChatId = async () => {
      if (chatUser) {
        const chatId = await getChatId(username, selectedChatUser.username);
        setChatId(chatId);
      }
    };

    fetchChatId();
  }, [selectedChatUser]);

  useEffect(() => {
    const fetchChatId = async () => {
      if (chatUser) {
        const chatId = await getChatId(username, chatUser.username);
        setChatId(chatId);
      }
    };

    fetchChatId();
  }, [selectedChatUser]);

  // ---------------------------------- Récupération et affichage des messages ----------------------------------
  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
        const fetchedMessages = await getMessages(chatId); // Appel à la fonction pour récupérer les messages
        setMessages(fetchedMessages); // Mettre à jour l'état avec les messages récupérés
      }
    };

    fetchMessages();
  }, [chatId, selectedChatUser]);
  // ----------------------------------------------------------------------------------------------------------

  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
        const fetchedMessages = await getMessages(chatId);
        setMessages(fetchedMessages);
      }
    };

    fetchMessages();
  }, [chatId, selectedChatUser]);

  // Fonction pour envoyer un message
  const handleSendMessage = async () => {
    try {
        if (!chatUser || !chatUser.username) {
            throw new Error("Utilisateur non connecté");
        }

        // Récupérez l'ID de l'utilisateur actuel
        const senderUsername = localStorage.getItem('username');
        const receiverUsername = selectedChatUser.username; // Nom d'utilisateur du destinataire

        // Envoyer le message via l'API
        const response = await sendMessage(messageContent, senderUsername, receiverUsername);
        
        // Optionnel : Vous pouvez ajouter le message à l'état local si nécessaire
        const newMessage = {
            id: response.id, // ID du message renvoyé par l'API 
            text: messageContent,
            sent: true,
            timestamp: new Date(response.created_at).getTime(),
        };
        console.log(newMessage);

        setMessages(prev => [...prev, newMessage]); // Mettre à jour l'état avec le nouveau message
        setMessageContent(''); // Réinitialiser le champ de saisie

    } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
        toast({ title: "Erreur", description: "Échec de l'envoi du message." });
    }
};

  // Fonction pour supprimer un message
  const handleDeleteMessage = (messageId: string) => {
    const updatedMessages = messages.filter((msg) => msg.id !== messageId);
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${chatId}`, JSON.stringify(updatedMessages));
  };

  // Fonction pour archiver la conversation
  const handleArchiveChat = () => {
    toast({
      title: "Chat archivé",
      description: "Cette conversation a été archivée"
    });
  };

  // Fonction pour enregistrer un message
  const handleStarMessage = () => {
    toast({
      title: "Message enregistré",
      description: "Le message a été ajouté aux favoris"
    });
  };

  // Fonction pour bloquer l'utilisateur
  const handleBlockUser = () => {
    toast({
      title: "Utilisateur bloqué",
      description: "Vous avez bloqué cet utilisateur"
    });
  };

  // Fonction pour signaler l'utilisateur
  const handleReportUser = () => {
    toast({
      title: "Utilisateur signalé",
      description: "Votre signalement a été envoyé"
    });
  };

  // Fonction pour supprimer la conversation
  const handleDeleteChat = () => {
    localStorage.removeItem(`messages_${chatId}`);
    toast({
      title: "Chat supprimé",
      description: "Cette conversation a été supprimée"
    });
    navigate("/");
  };

  // Effet pour récupérer les détails de l'utilisateur sélectionné
  useEffect(() => {
    const userData = localStorage.getItem(`user_${chatId}`);
    if (userData) {
      setChatUser(JSON.parse(userData));
    }
  }, [chatId]);

  // Affichage de la fenêtre de chat
  return (
  <div>
    {/* En-tête de la fenêtre de chat */}
    <div className="p-4 border-b border-border flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="md:hidden">
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Affichage de l'avatar de l'utilisateur sélectionné */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          {/* Image de l'avatar ou fallback si l'image n'est pas disponible */}
          <AvatarImage src={selectedChatUser?.profile_picture_url} />
          <AvatarFallback>{selectedChatUser?.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* Affichage du nom de l'utilisateur sélectionné */}
        <div>
          <h2 className="font-medium">{selectedChatUser?.name}</h2> {/* Affiche le nom de l'utilisateur sélectionné */}
            <span className="text-sm text-green-500">{selectedChatUser?.username} - En ligne</span>
          </div>
        </div>
      </div>

      {/* Boutons d'actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden md:inline-flex">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden md:inline-flex">
          <Phone className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleStarMessage}>
              <Star className="mr-2 h-4 w-4" />
              <span>Enregistrer les messages</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleArchiveChat}>
              <Archive className="mr-2 h-4 w-4" />
              <span>Archiver la conversation</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleBlockUser} className="text-red-600">
              <Ban className="mr-2 h-4 w-4" />
              <span>Bloquer l'utilisateur</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReportUser} className="text-yellow-600">
              <Flag className="mr-2 h-4 w-4" />
              <span>Signaler l'utilisateur</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteChat} className="text-red-600">
              <Delete className="mr-2 h-4 w-4" />
              <span>Supprimer la conversation</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>


     {/* Center - Affichage des messages */}
     <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 240px)' }}>
        <div className="messages-container" style={{ padding: '10px', maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}>
            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    Aucun message. Commencez la conversation !
                </div>
            ) : (
                messages.map((message, index) => (
                    <div key={index} className={`flex justify-${message.sent ? 'end' : 'start'} mb-4`}>
                        <div className={`bg-${message.sent ? 'primary' : 'secondary'} rounded-lg p-4 max-w-md`}>
                            {message.text}
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>

     {/* Footer - Champ de saisie pour envoyer un message */}
     <div className="footer h-16" style={{ flexShrink: 0, justifyContent: 'end',position: 'relative', top: '10px' }}>
       
        <MessageInput onSendMessage={handleSendMessage} setMessageContent={setMessageContent} style={{padding: '10px'}} />
    </div>
  </div>
);
};

export default ChatWindow;
