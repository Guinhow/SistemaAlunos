import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import { gerarComprovantePDF } from './GerarComprovantePDF';

const ConsultaPagamentos = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPagamentos = async () => {
    try {
      // const response = await axios.get('http://192.168.0.221:8080/pagamentos/quitados');
      const response = await axios.get('http://192.168.1.10:8080/pagamentos/quitados');

      setPagamentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar pagamentos quitados:', error);
      setError('Erro ao carregar os pagamentos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPagamentos();
  };

  useEffect(() => {
    fetchPagamentos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.contrato?.aluno?.nome}</Text>
      <Text style={styles.turma}>Turma: {item.contrato?.turma?.nome}</Text>
      <Text style={styles.parcela}>
        Parcela {item.numeroParcela} de {item.contrato?.parcelas}
      </Text>
      <Text style={styles.valor}>Valor: R$ {item.valor.toFixed(2)}</Text>
      <Text style={styles.data}>Pago em: {item.dataPagamento}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => gerarComprovantePDF(item)}
      >
        <Feather name="file-text" size={18} color="#fff" />
        <Text style={styles.buttonText}>Ver Comprovante</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Carregando comprovantes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pagamentos Quitados</Text>
      </View>

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : pagamentos.length === 0 ? (
        <View style={styles.centered}>
          <Feather name="info" size={48} color="#888" />
          <Text style={styles.emptyText}>Nenhum pagamento quitado</Text>
        </View>
      ) : (
        <FlatList
          data={pagamentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

export default ConsultaPagamentos;

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
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  turma: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  parcela: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  valor: {
    fontSize: 14,
    color: '#000',
    marginTop: 5,
    fontWeight: '500',
  },
  data: {
    fontSize: 13,
    color: '#555',
    marginTop: 3,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
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
    color: '#666',
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 10,
  },
});
