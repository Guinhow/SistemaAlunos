import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView
} from 'react-native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import { gerarComprovantePDF } from './GerarComprovantePDF';


const Pagamentos = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPagamentos = async () => {
    try {
      // const response = await axios.get('http://192.168.0.221:8080/pagamentos/pendentes');
      const response = await axios.get('http://192.168.1.10:8080/pagamentos/pendentes');

      setPagamentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      setError('Erro ao carregar pagamentos pendentes.');
    } finally {
      setLoading(false);
    }
  };

  const quitarPagamento = async (id) => {
    Alert.alert(
      'Quitar Pagamento',
      'Tem certeza que deseja quitar esta parcela?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Quitar',
          style: 'default',
          onPress: async () => {
            try {
              // await axios.put(`http://192.168.0.221:8080/pagamentos/${id}/quitar`);
              await axios.put(`http://192.168.1.10:8080/pagamentos/${id}/quitar`);


              const pago = pagamentos.find(p => p.id === id);
              await gerarComprovantePDF({
                ...pago,
                dataPagamento: new Date().toISOString().split('T')[0],
              });

              setPagamentos(prev => prev.filter(p => p.id !== id));

              Alert.alert('Sucesso', 'Pagamento quitado com sucesso!');
            } catch (error) {
              console.error('Erro ao quitar pagamento:', error);
              Alert.alert('Erro', 'Não foi possível quitar o pagamento.');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchPagamentos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>Aluno: {item.contrato?.aluno?.nome}</Text>
      <Text style={styles.parcela}>Parcela {item.numeroParcela} de {item.contrato?.parcelas}</Text>
      <Text style={styles.valor}>R$ {item.valor.toFixed(2)}</Text>
      <Text style={styles.vencimento}>Vencimento: {item.vencimento}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.quitButton}
          onPress={() => quitarPagamento(item.id)}
        >
          <Feather name="check-circle" size={20} color="#FFF" />
          <Text style={styles.quitText}>Quitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Carregando pagamentos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pagamentos Pendentes</Text>
      </View>

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : pagamentos.length === 0 ? (
        <View style={styles.centered}>
          <Feather name="smile" size={50} color="green" />
          <Text style={styles.successText}>Nenhum pagamento pendente 🎉</Text>
        </View>
      ) : (
        <FlatList
          data={pagamentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

export default Pagamentos;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    marginBottom: 6,
  },
  parcela: {
    fontSize: 14,
    color: '#555',
  },
  valor: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
    marginVertical: 4,
  },
  vencimento: {
    fontSize: 13,
    color: '#666',
  },
  actions: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  quitButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  quitText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    fontSize: 16,
    marginTop: 10,
  },
});
