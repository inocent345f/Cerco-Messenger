import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
interface User {
  id: string;
  username: string;
  name: string;
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

export const registerUser = async (userData: { username: string; email: string, password: string }) => {
  console.log(userData)
  const response = await axios({
    method:'post',
    url: `${API_URL}/register`,
    data:{
      username: userData.username,
      email: userData.email, 
      password: userData.password
    }}).then((response) => {
      return response.data
    }).catch((err) => {
      console.log(err)
      throw new Error('Erreur lors de la connexion')
    })
}


    

export const loginUser = async (userData: { username: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username: userData.username,
      password: userData.password,
    });
    return response.data;  
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw new Error("Une erreur est survenue lors de la connexion.");
  }
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`, {
    headers,
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des utilisateurs');
  }
  
  return response.json();
};

export const sendMessage = async (message: { receiverId: string; text: string }) => {
  const response = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(message),
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de l\'envoi du message');
  }
  
  return response.json();
};

export const getMessages = async (receiverId: string) => {
  const response = await fetch(`${API_URL}/messages/${receiverId}`, {
    headers,
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des messages');
  }
  
  return response.json();
};

export const verifyOtp = async (data: { email: string; token: string; type: string }) => {
  console.log(data.token)
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, data);
    return response.data;
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.detail || "Erreur lors de la vérification OTP");
    } else {
      throw new Error("Une erreur réseau est survenue");
    }
  }

};