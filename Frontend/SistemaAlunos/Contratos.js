import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';

const Contratos = () => {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContrato, setSelectedContrato] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchContratos = async () => {
    try {
      // const response = await axios.get('http://192.168.0.221:8080/contratos');
      const response = await axios.get('http://192.168.1.10:8080/contratos');

      setContratos(response.data);
    } catch (error) {
      console.error('Erro ao buscar contratos:', error);
      setError('Não foi possível carregar os contratos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedContrato(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.nome}>{item.aluno?.nome}</Text>
      <Text style={styles.turma}>Turma: {item.turma?.nome}</Text>
      <Text style={styles.datas}>
        {item.dataInicio} → {item.dataFim}
      </Text>
      <Text style={styles.valor}>R$ {item.valorTotal.toFixed(2)}</Text>
      <Text style={[styles.status, item.status === 'ativo' ? styles.ativo : styles.encerrado]}>
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  const renderDetailsModal = () => (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes do Contrato</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {selectedContrato && (
            <View>
              <Text style={styles.detailItem}>Aluno: {selectedContrato.aluno?.nome}</Text>
              <Text style={styles.detailItem}>Turma: {selectedContrato.turma?.nome}</Text>
              <Text style={styles.detailItem}>Início: {selectedContrato.dataInicio}</Text>
              <Text style={styles.detailItem}>Fim: {selectedContrato.dataFim}</Text>
              <Text style={styles.detailItem}>Valor Total: R$ {selectedContrato.valorTotal.toFixed(2)}</Text>
              <Text style={styles.detailItem}>Parcelas: {selectedContrato.parcelas}</Text>
              <Text style={styles.detailItem}>Status: {selectedContrato.status}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Carregando contratos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contratos</Text>
      </View>

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={contratos}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {renderDetailsModal()}
    </SafeAreaView>
  );
};

export default Contratos;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  turma: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
  datas: {
    fontSize: 13,
    marginTop: 2,
    color: '#777',
  },
  valor: {
    fontSize: 15,
    marginTop: 4,
    color: '#000',
    fontWeight: '600',
  },
  status: {
    marginTop: 5,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  ativo: {
    color: 'green',
  },
  encerrado: {
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
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
    fontSize: 16,
    marginBottom: 8,
  },
});
