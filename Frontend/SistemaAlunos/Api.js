import axios from 'axios';

const BASE_URL = 'http://192.168.0.221:8080'; 

export const login = async (usuario, senha) => {
  try {
    const response = await axios.post(`http://192.168.0.221:8080/usuarios/autenticar`, {
      usuario,
      senha
    });
    return response.data;  
  } catch (error) {
    console.error('Erro ao tentar login:', error);
    throw error;  
  }
};