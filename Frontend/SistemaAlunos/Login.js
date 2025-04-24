import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';

const Login = ({ navigation, onLoginSuccess }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError(''); 

    if (!usuario.trim() || !senha.trim()) {
      setError('Usuário e senha são obrigatórios');
      setLoading(false);
      return;
    }

    try {
      // console.log("Enviando requisição para: http://192.168.0.221:8080/usuarios/autenticar");
      console.log("Enviando requisição para: http://192.168.1.10:8080/usuarios/autenticar");

      console.log("Dados enviados:", { usuario, senha });
      
      // const response = await axios.post('http://192.168.0.221:8080/usuarios/autenticar', {
        const response = await axios.post('http://192.168.1.10:8080/usuarios/autenticar', {

          usuario: usuario,  
          senha: senha,
      });
      
      
      if (response.status === 200) {
          console.log("Login bem-sucedido");
          onLoginSuccess();      }  
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError('Usuário ou senha inválidos');
        } else if (error.response.data) {
          setError(error.response.data); 
        } else {
          setError('Erro ao fazer login. Verifique suas credenciais.');
        }
      } else if (error.request) {

        setError('Servidor indisponível. Tente novamente mais tarde.');
      } else {

        setError('Erro ao tentar conectar com o servidor.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Sistema Alunos</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <Text style={styles.loginText}>Carregando...</Text>
        ) : (
          <Text style={styles.loginText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  logo: {
    color: 'red',
    fontSize: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 100,
    marginTop: 100,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
});
