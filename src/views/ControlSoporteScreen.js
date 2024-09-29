import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importamos el hook useNavigation

const ControlSoporteScreen = () => {
  const navigation = useNavigation(); // Usamos el hook para obtener la navegación

  const [ubicacion, setUbicacion] = useState('');
  const [horaSoporte, setHoraSoporte] = useState('');
  const [fotos, setFotos] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Control de soporte técnico</Text>
      <Text style={styles.subtitle}>Ingrese evidencias de cada soporte</Text>

      {/* Subir Ubicación */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Subir ubicación</Text>
        <Image
          source={{ uri: 'https://via.placeholder.com/200x100' }} // Reemplazar con la imagen del mapa
          style={styles.image}
        />
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>Checked</Text>
          <TouchableOpacity>
            <Text style={styles.actionText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.actionText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hora de Soporte */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hora de soporte</Text>
        <TextInput
          style={styles.input}
          placeholder="00:00:00"
          value={horaSoporte}
          onChangeText={setHoraSoporte}
        />
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>Checked</Text>
          <TouchableOpacity>
            <Text style={styles.actionText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.actionText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subir Fotos */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Subir fotos</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadText}>Subir archivos</Text>
        </TouchableOpacity>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>Checked</Text>
          <TouchableOpacity>
            <Text style={styles.actionText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.actionText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón de Terminar */}
      <TouchableOpacity
        style={styles.terminateButton}
        onPress={() => navigation.navigate('ConfirmacionScreen')} // Navegar a la pantalla de confirmación
      >
        <Text style={styles.terminateButtonText}>Terminar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: 'gray',
  },
  inputContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 5,
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingVertical: 15,
    backgroundColor: '#f9f9f9',
  },
  uploadText: {
    fontSize: 16,
    color: 'gray',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  statusText: {
    fontSize: 16,
    color: 'green',
  },
  actionText: {
    color: '#007BFF',
    fontSize: 14,
  },
  terminateButton: {
    backgroundColor: '#000080',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  terminateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ControlSoporteScreen;
