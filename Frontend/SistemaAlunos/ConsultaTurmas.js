import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView
} from 'react-native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons'; 

const ConsultaTurmas = ({ navigation }) => {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState(null);

  const fetchTurmas = async () => {
    setLoading(true);
    setError(null);
  
    try {
      // const response = await axios.get('http://192.168.0.221:8080/turmas');
      const response = await axios.get('http://192.168.1.10:8080/turmas');

      // console.log('Turmas recebidas:', response.data);
  
      if (Array.isArray(response.data)) {
        setTurmas(response.data);
      } else {
        console.warn('Resposta inesperada ao buscar turmas:', response.data);
        setTurmas([]);
      }
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      setError('Não foi possível carregar as turmas. Tente novamente.');
      setTurmas([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchTurmas();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTurmas();
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir esta turma?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              // await axios.delete(`http://192.168.0.221:8080/turmas/${id}`);
              await axios.delete(`http://192.168.1.10:8080/turmas/${id}`);

              setTurmas(turmas.filter(turma => turma.id !== id));
              Alert.alert('Sucesso', 'Turma excluída com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir turma:', error);
              Alert.alert('Erro', 'Não foi possível excluir a turma.');
            }
          } 
        }
      ]
    );
  };

  const openDetails = (turma) => {
    setSelectedTurma(turma);
    setModalVisible(true);
  };

  const handleEdit = (turma) => {
    setModalVisible(false);
    // Presumindo que você tenha uma rota/navegação para a tela de edição
    navigation.navigate('EditarTurma', { turma });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.turmaCard}
      onPress={() => openDetails(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.turmaNome}>{item.nome}</Text>
        <View style={styles.nivelBadge}>
          <Text style={styles.nivelText}>{item.nivel}</Text>
        </View>
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <Feather name="clock" size={16} color="#666" />
          <Text style={styles.infoText}>{item.horario}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Feather name="calendar" size={16} color="#666" />
          <Text style={styles.infoText}>{item.diasSemana}</Text>
        </View>

        {item.professor && (
          <View style={styles.infoRow}>
            <Feather name="user" size={16} color="#666" />
            <Text style={styles.infoText}>{item.professor}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEdit(item)}
        >
          <Feather name="edit" size={18} color="#4A90E2" />
          <Text style={[styles.actionText, { color: '#4A90E2' }]}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDelete(item.id)}
        >
          <Feather name="trash-2" size={18} color="#FF0000" />
          <Text style={[styles.actionText, { color: '#FF0000' }]}>Excluir</Text>
        </TouchableOpacity>
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
            <Text style={styles.modalTitle}>Detalhes da Turma</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {selectedTurma && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nome:</Text>
                <Text style={styles.detailValue}>{selectedTurma.nome}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Horário:</Text>
                <Text style={styles.detailValue}>{selectedTurma.horario}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dias:</Text>
                <Text style={styles.detailValue}>{selectedTurma.diasSemana}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nível:</Text>
                <Text style={styles.detailValue}>{selectedTurma.nivel}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Professor:</Text>
                <Text style={styles.detailValue}>{selectedTurma.professor || 'Não atribuído'}</Text>
              </View>
            </View>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalAction}
              onPress={() => handleEdit(selectedTurma)}
            >
              <Feather name="edit" size={18} color="#fff" />
              <Text style={styles.modalActionText}>Editar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalAction, styles.deleteAction]}
              onPress={() => {
                setModalVisible(false);
                handleDelete(selectedTurma.id);
              }}
            >
              <Feather name="trash-2" size={18} color="#fff" />
              <Text style={styles.modalActionText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Carregando turmas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Turmas Cadastradas</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('Turmas')}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.centered}>
          <Feather name="alert-circle" size={50} color="#FF0000" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTurmas}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : turmas.length === 0 ? (
        <View style={styles.centered}>
          <Feather name="info" size={50} color="#666" />
          <Text style={styles.emptyText}>Nenhuma turma cadastrada</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.navigate('CadastrarTurma')}
          >
            <Text style={styles.retryText}>Cadastrar Turma</Text>
          </TouchableOpacity>
        </View>
      ) : (
        
      <FlatList
        data={Array.isArray(turmas) && turmas.length > 0 ? turmas : []}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => item ? renderItem({ item }) : null}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={() => (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Nenhuma turma encontrada</Text>
          </View>
        )}
      />
      )}
      {renderDetailsModal()}
    </SafeAreaView>
  );
};

export default ConsultaTurmas;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  turmaCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  turmaNome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nivelBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  nivelText: {
    fontSize: 12,
    color: '#666',
  },
  cardInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    padding: 5,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    width: 80,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  deleteAction: {
    backgroundColor: '#FF0000',
  },
  modalActionText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});