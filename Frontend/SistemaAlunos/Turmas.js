import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  SafeAreaView,
  Platform,
  Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const { height: screenHeight } = Dimensions.get('window');

const Turmas = () => {
  const [nome, setNome] = useState('');
  const [horario, setHorario] = useState('');
  const [diasSemana, setDiasSemana] = useState('');
  const [nivel, setNivel] = useState('');
  const [professor, setProfessor] = useState('');
  
  const [pickerVisible, setPickerVisible] = useState({
    nome: false,
    horario: false,
    diasSemana: false,
    nivel: false,
    professor: false
  });

  const togglePicker = (pickerName) => {
    const newState = { ...pickerVisible };
    // Fecha todos os outros pickers
    Object.keys(newState).forEach(key => {
      newState[key] = false;
    });
    // Abre/fecha o picker selecionado
    newState[pickerName] = !pickerVisible[pickerName];
    setPickerVisible(newState);
  };

  const handleCadastrar = async () => {
    if (!nome || !horario || !diasSemana || !nivel) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // const response = await axios.post('http://192.168.0.221:8080/turmas', {
        const response = await axios.post('http://192.168.1.10:8080/turmas', {

        nome,
        horario,
        diasSemana,
        nivel,
        professor,
      });

      Alert.alert('Sucesso', 'Turma cadastrada com sucesso!');
      setNome('');
      setHorario('');
      setDiasSemana('');
      setNivel('');
      setProfessor('');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao cadastrar turma.');
    }
  };

  const handleSelectValue = (value, pickerName) => {
    switch(pickerName) {
      case 'nome': setNome(value); break;
      case 'horario': setHorario(value); break;
      case 'diasSemana': setDiasSemana(value); break;
      case 'nivel': setNivel(value); break;
      case 'professor': setProfessor(value); break;
    }

    togglePicker(pickerName);
  };

  const renderPickerField = (label, value, pickerName, options, required = true) => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {label} {required && <Text style={styles.requiredMark}>*</Text>}
        </Text>
        <TouchableOpacity 
          style={styles.pickerButton} 
          onPress={() => togglePicker(pickerName)}
        >
          <Text style={value ? styles.selectedValue : styles.placeholderText}>
            {value || `Selecione ${label.toLowerCase()}`}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={pickerVisible[pickerName]}
          transparent={true}
          animationType="slide"
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1}
            onPress={() => togglePicker(pickerName)}
          >
            <View 
              style={styles.modalContent}
              onStartShouldSetResponder={() => true}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>{label}</Text>
                <TouchableOpacity onPress={() => togglePicker(pickerName)}>
                  <Text style={styles.closeButton}>Fechar</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.optionsList}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionItem,
                      value === option.value && styles.selectedOptionItem
                    ]}
                    onPress={() => handleSelectValue(option.value, pickerName)}
                  >
                    <Text style={[
                      styles.optionText,
                      value === option.value && styles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  const turmasOptions = [
    { label: 'Selecione o nome da turma', value: '' },
    { label: 'Básico 1 A', value: 'Básico 1 A' },
    { label: 'Básico 1 B', value: 'Básico 1 B' },
    { label: 'Básico 2 A', value: 'Básico 2 A' },
    { label: 'Básico 2 B', value: 'Básico 2 B' },
    { label: 'Intermediário 1 A', value: 'Intermediário 1 A' },
    { label: 'Intermediário 1 B', value: 'Intermediário 1 B' },
    { label: 'Intermediário 2 A', value: 'Intermediário 2 A' },
    { label: 'Intermediário 2 B', value: 'Intermediário 2 B' },
    { label: 'Avançado 1 A', value: 'Avançado 1 A' },
    { label: 'Avançado 1 B', value: 'Avançado 1 B' },
    { label: 'Avançado 2 A', value: 'Avançado 2 A' },
    { label: 'Avançado 2 B', value: 'Avançado 2 B' },
  ];

  const horariosOptions = [
    { label: 'Selecione o horário', value: '' },
    { label: '08:00', value: '08:00' },
    { label: '10:00', value: '10:00' },
    { label: '14:00', value: '14:00' },
    { label: '16:00', value: '16:00' },
    { label: '18:00', value: '18:00' },
  ];

  const diasOptions = [
    { label: 'Selecione os dias da semana', value: '' },
    { label: 'Segunda e Quarta', value: 'Segunda e Quarta' },
    { label: 'Terça e Quinta', value: 'Terça e Quinta' },
    { label: 'Sexta', value: 'Sexta' },
    { label: 'Sábado', value: 'Sábado' },
  ];

  const niveisOptions = [
    { label: 'Selecione o nível', value: '' },
    { label: 'Básico', value: 'Básico' },
    { label: 'Intermediário', value: 'Intermediário' },
    { label: 'Avançado', value: 'Avançado' },
  ];

  const professoresOptions = [
    { label: 'Selecione o professor (opcional)', value: '' },
    { label: 'Ana Beatriz', value: 'Ana Beatriz' },
    { label: 'Ana Claudia', value: 'Ana Claudia' },
    { label: 'Victoria', value: 'Victoria' },
    { label: 'Jhuly', value: 'Jhuly' },
    { label: 'Marcos', value: 'Marcos' },
    { label: 'Gabriel', value: 'Gabriel' },
    { label: 'Matheus', value: 'Matheus' },
    { label: 'Vinicius', value: 'Vinicius' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cadastrar Nova Turma</Text>

        {renderPickerField('Nome da Turma', nome, 'nome', turmasOptions)}
        {renderPickerField('Horário', horario, 'horario', horariosOptions)}
        {renderPickerField('Dias da Semana', diasSemana, 'diasSemana', diasOptions)}
        {renderPickerField('Nível', nivel, 'nivel', niveisOptions)}
        {renderPickerField('Professor', professor, 'professor', professoresOptions, false)}

        <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
          <Text style={styles.buttonText}>Cadastrar Turma</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Turmas;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 8, 
    fontWeight: '500',
  },
  requiredMark: {
    color: '#FF0000',
  },
  pickerButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  selectedValue: {
    color: '#000',
  },
  placeholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    minHeight: screenHeight * 0.4, // 40% da altura da tela
    maxHeight: screenHeight * 0.8, // 80% da altura da tela
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: '500',
  },
  optionsList: {
    flex: 1,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOptionItem: {
    backgroundColor: '#f8f8f8',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#FF0000',
  },
  button: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});