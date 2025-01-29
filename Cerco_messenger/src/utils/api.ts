import axios from "axios";

// L'URL de l'API est stockée dans un fichier .env ou dans les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  username: string;
  name?: string;
  created_at?: string;
  email?: string;
}

interface message {
  id: string;
  created_at?: string;
  chat_id?: string;
  message?: string;
  username?: string;
}

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Fonction pour enregistrer un utilisateur
export const registerUser = async (userData: { username: string; email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    throw new Error(error.response?.data?.detail || 'Erreur lors de l\'enregistrement');
  }
};

// Fonction pour se connecter
export const loginUser = async (userData: { username: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username: userData.username,
      password: userData.password,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw new Error(error.response?.data?.detail || "Une erreur est survenue lors de la connexion.");
  }
};

// Fonction pour récupérer la liste des utilisateurs
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Erreur dans la récupération des utilisateurs:', error);
    throw new Error(error.response?.data?.detail || 'Une erreur est survenue lors de la récupération des utilisateurs');
  }
};


// Fonction pour vérifier l'OTP (One Time Password)
export const verifyOtp = async (data: { email: string; token: string; type: string }) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur dans la vérification OTP:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "Erreur lors de la vérification OTP");
    } else {
      throw new Error("Une erreur réseau est survenue");
    }
  }
};


// Fonction pour récupérer l'ID d'un utilisateur à partir de son username
export const getUserIdByUsername = async (username: string) => {
  const response = await axios.get(`${API_URL}/users?username=${username}`);
  if (response.data && response.data.length > 0) {
    return response.data[0].id; // Supposons que l'ID soit dans le premier élément
  }
  throw new Error("Utilisateur non trouvé");
};


//-------------------------------------------- Messages ---------------------------------------------------------------//

// Fonction pour envoyer un message
export const sendMessage = async (message: { receiverId: string; text: string }) => {
  try {
    const response = await axios.post(`${API_URL}/messages`, message, {
      headers,
      withCredentials: true, // Assurez-vous que le token de session est envoyé
    });
    return response.data;
  } catch (error) {
    console.error('Erreur dans l\'envoi du message:', error);
    throw new Error(error.response?.data?.detail || 'Une erreur est survenue lors de l\'envoi du message');
  }
};


// Fonction pour récupérer le chat_id de deux utilisateurs
export const getChatId = async (user1_id:string, user2_id: string) => {
  console.log(user1_id)
  try {
    const response = await axios.get(`${API_URL}/get-chat-id?user1_id=${user1_id}&user2_id=${user2_id}`);
    return response.data; // Retourner le chat_id
    console.log(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération du chat_id:', error);
    throw new Error(error.response?.data?.detail || 'Erreur lors de la récupération du chat_id');
  }
};


// Fonction pour récupérer les messages
export const getMessages = async (chatId: string) => {
  try {
    const response = await axios.post(`${API_URL}/messages/?chat_id=${chatId}`);
    console.log(chatId)
    return response.data; // Retourner les messages récupérés
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    throw new Error(error.response?.data?.detail || 'Erreur lors de la récupération des messages');
  }
};

// Fonction pour récupérer les détails de l'utilisateur par ID
export const getUserByUsername = async (username: string) => {
  try {
    const response = await axios.get(`${API_URL}/user?username=${username}`);
    return response.data; // Retourner les détails de l'utilisateur
    console.log(response)
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error);
    throw new Error(error.response?.data?.detail || 'Erreur lors de la récupération des détails de l\'utilisateur');
  }
};

//-------------------------------------------------------------------------------------------------------------
