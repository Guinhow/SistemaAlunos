import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const Dashboard = () => {
  const [totalAlunos, setTotalAlunos] = useState(null);
  const [totalTurmas, setTotalTurmas] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [resAlunos, resTurmas] = await Promise.all([
        // axios.get('http://192.168.0.221:8080/alunos/quantidade'),
        // axios.get('http://192.168.0.221:8080/turmas/quantidade'),
        axios.get('http://192.168.1.10:8080/alunos/quantidade'),
        axios.get('http://192.168.1.10:8080/turmas/quantidade'),
      ]);
      setTotalAlunos(resAlunos.data);
      setTotalTurmas(resTurmas.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel de Controle</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total de Alunos</Text>
        <Text style={styles.cardValue}>{totalAlunos}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total de Turmas</Text>
        <Text style={styles.cardValue}>{totalTurmas}</Text>
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#f3f3f3',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#555',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF0000',
    marginTop: 8,
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
});
