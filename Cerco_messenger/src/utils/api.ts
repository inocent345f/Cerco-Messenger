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

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
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

// Fonction pour récupérer les messages
export const getMessages = async (receiverId: string) => {
  try {
    const response = await axios.get(`${API_URL}/messages/${receiverId}`, {
      headers,
      withCredentials: true, // Assurez-vous que le token de session est envoyé
    });
    return response.data;
  } catch (error) {
    console.error('Erreur dans la récupération des messages:', error);
    throw new Error(error.response?.data?.detail || 'Une erreur est survenue lors de la récupération des messages');
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

