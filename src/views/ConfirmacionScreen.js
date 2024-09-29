import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importamos el hook useNavigation

const ConfirmacionScreen = () => {
  const navigation = useNavigation(); // Usamos el hook para obtener la prop navigation

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/mivilsoft.jpeg')} // Reemplaza con la ruta correcta de tu logo
        style={styles.logo}
      />
      <Text style={styles.title}>MIVILSOFT</Text>

      {/* Caja de Confirmación */}
      <View style={styles.confirmationBox}>
        <Image
          source={require('../../assets/check.png')} // Reemplaza con la ruta correcta de tu icono de check
          style={styles.checkIcon}
        />
        <Text style={styles.message}>Registro guardado exitosamente</Text>

        {/* Botón para regresar al menú principal */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Dashboard')} // Navegar de regreso al Dashboard
        >
          <Text style={styles.buttonText}>Regresar al menú principal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000080',
  },
  confirmationBox: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  checkIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00a8e8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmacionScreen;
