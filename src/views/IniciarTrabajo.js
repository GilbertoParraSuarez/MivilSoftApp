import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IniciarTrabajo = () => {
  const navigation = useNavigation(); // Usar el hook para obtener la navegación

  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [comentario, setComentario] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de seguimiento</Text>
      <Text style={styles.subtitle}>Complete todos los campos</Text>

      {/* Campo de Fecha */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Fecha</Text>
        <TextInput
          style={styles.input}
          placeholder="dd/mm/yyyy"
          value={fecha}
          onChangeText={setFecha}
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

      {/* Campo de Hora de Inicio */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hora de inicio</Text>
        <TextInput
          style={styles.input}
          placeholder="00:00:00"
          value={horaInicio}
          onChangeText={setHoraInicio}
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

      {/* Subir Foto */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Subir foto</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadText}>Sube un archivo</Text>
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

      {/* Comentario */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Comentario</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Establecer máximo de caracteres."
          value={comentario}
          onChangeText={setComentario}
          multiline
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

      {/* Botón de Terminar */}
      <TouchableOpacity
        style={styles.terminateButton}
        onPress={() => navigation.navigate('ConfirmacionIdScreen')} // Usando navigation del hook
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
    fontSize: 20,
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
  textArea: {
    height: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlignVertical: 'top',
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

export default IniciarTrabajo; // Cambia la exportación a IniciarTrabajo
