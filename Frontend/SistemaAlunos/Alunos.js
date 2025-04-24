import { Modal, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const Alunos = () => {
  const [turmas, setTurmas] = useState([]);
  const [turmaId, setTurmaId] = useState('');

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [parcelas, setParcelas] = useState('');
  const [showTurmaModal, setShowTurmaModal] = useState(false);
  

  useEffect(() => {
    // axios.get('http://192.168.0.221:8080/turmas')
    axios.get('http://192.168.1.10:8080/turmas')

      .then(response => {
        // console.log('>>> TURMAS RECEBIDAS:', response.data);
        setTurmas(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar turmas:', error);
        Alert.alert('Erro', 'Não foi possível carregar as turmas.');
      });
  }, []);

  const handleCadastrar = async () => {
    if (!nome || !cpf || !nascimento || !telefone || !email || !turmaId || !valorTotal || !parcelas) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      // const response = await axios.post('http://192.168.0.221:8080/alunos/completo', {
        const response = await axios.post('http://192.168.1.10:8080/alunos/completo', {

        nome,
        cpf,
        nascimento,
        telefone,
        email,
        turmaId: Number(turmaId),
        valorTotal,
        parcelas,
      });
    //   const validTurmas = response.data.filter(turma => turma && turma.id !== undefined);
    //   setTurmas(validTurmas);

      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
      setNome('');
      setCpf('');
      setNascimento('');
      setTelefone('');
      setEmail('');
      setTurmaId('');
      setValorTotal('');
      setParcelas('');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível cadastrar o aluno.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Novo Aluno</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento (AAAA-MM-DD)"
        value={nascimento}
        onChangeText={setNascimento}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
       {/* Bloco seleção de Turmas */}
        <Text style={styles.label}>Turma</Text>

        <Pressable style={styles.fakeInput} onPress={() => setShowTurmaModal(true)}>
        <Text>{turmaId ? turmas.find(t => t.id.toString() === turmaId)?.nome : 'Selecione a Turma'}</Text>
        </Pressable>

        <Modal visible={showTurmaModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Picker
                selectedValue={turmaId}
                onValueChange={(itemValue) => {
                setTurmaId(itemValue);
                setShowTurmaModal(false);
                }}
            >
                <Picker.Item label="Selecione a Turma" value="" color="#000000" />
                {Array.isArray(turmas) && turmas.map((turma) => (                
                <Picker.Item
                    key={turma.id}
                    label={turma.nome}
                    value={turma.id.toString()}
                    color="#000000" 
                />
                ))}
            </Picker>
            </View>
        </View>
        </Modal>

      <TextInput
        style={styles.input}
        placeholder="Valor Total (R$)"
        keyboardType="numeric"
        value={valorTotal}
        onChangeText={setValorTotal}
      />
      <TextInput
        style={styles.input}
        placeholder="Parcelas (ex: 6)"
        keyboardType="numeric"
        value={parcelas}
        onChangeText={setParcelas}
      />

      <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
        <Text style={styles.buttonText}>Cadastrar Aluno</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Alunos;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
  fakeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    justifyContent: 'center',
    height: 50,
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  
  modalContent: {
    backgroundColor: '#fff',
    margin: 30,
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  }
});
