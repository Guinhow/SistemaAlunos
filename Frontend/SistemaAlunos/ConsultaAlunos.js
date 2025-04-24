import React, { useState, useEffect , useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  TextInput
} from 'react-native';
import axios from 'axios';

import { Feather } from '@expo/vector-icons';
import { RotateInDownLeft } from 'react-native-reanimated';

const ConsultaAlunos = ({ navigation }) => {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [busca, setBusca] = useState('');
  const inputRef = useRef(null);

  const handleSearchPress = () => {
    inputRef.current?.focus();
  };

  const fetchAlunos = async () => {
    setLoading(true);
    setError(null);

    try {
      // const response = await axios.get('http://192.168.0.221:8080/alunos');
      const response = await axios.get('http://192.168.1.10:8080/alunos');

      if (Array.isArray(response.data)) {
        setAlunos(response.data);
      } else {
        console.warn('Resposta inesperada ao buscar alunos:', response.data);
        setAlunos([]);
      }
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      setError('Não foi possível carregar os alunos. Tente novamente.');
      setAlunos([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAlunos();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedAluno(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={[styles.status, item.status === 'ativo' ? styles.ativo : styles.inativo]}>
          {item.status}
        </Text>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.infoText}>CPF: {item.cpf}</Text>
        <Text style={styles.infoText}>Nascimento: {item.nascimento}</Text>
        <Text style={styles.infoText}>Turma: {item.turma?.nome || 'Não atribuída'}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDetailsModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes do Aluno</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {selectedAluno && (
            <View>
              <Text style={styles.detailItem}>Nome: {selectedAluno.nome}</Text>
              <Text style={styles.detailItem}>CPF: {selectedAluno.cpf}</Text>
              <Text style={styles.detailItem}>Nascimento: {selectedAluno.nascimento}</Text>
              <Text style={styles.detailItem}>Telefone: {selectedAluno.telefone}</Text>
              <Text style={styles.detailItem}>Email: {selectedAluno.email}</Text>
              <Text style={styles.detailItem}>Turma: {selectedAluno.turma?.nome || 'N/A'}</Text>
              <Text style={styles.detailItem}>Status: {selectedAluno.status}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Carregando alunos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.ajustebotao}>
        <Text style={styles.headerTitle}>Alunos Cadastrados</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Alunos')}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
        <Feather
            name="search"
            size={18}
            color="#888"
            style={{ marginRight: 8 }}
            onPress={handleSearchPress} // Ação no clique do ícone
          />
          <TextInput
            ref={inputRef} // Conectando o TextInput com a referência
            style={styles.searchInput}
            placeholder="Buscar aluno por nome"
            value={busca}
            onChangeText={setBusca}
            placeholderTextColor="#aaa"
          />
            </View>
        
      </View>

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
        //   data={alunos}
          data={alunos.filter(aluno =>
            aluno.nome.toLowerCase().includes(busca.toLowerCase())
          )}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.list}
        />
      )}
      {renderDetailsModal()}
    </SafeAreaView>
  );
};

export default ConsultaAlunos;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#FF0000',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  ativo: {
    color: 'green',
  },
  inativo: {
    color: 'gray',
  },
  cardInfo: {
    paddingLeft: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailItem: {
    marginBottom: 10,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    marginHorizontal: 10,
    marginVertical: 10,
    marginBottom: 10,
    borderRadius: 8,
    height: 44,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  ajustebotao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',  
    gap: 60,
  },
});
