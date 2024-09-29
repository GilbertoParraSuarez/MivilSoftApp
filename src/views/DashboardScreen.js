import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import UserIcon from '../icons/userIcon';

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/mivilsoft.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.userInfo}>
          <UserIcon width={40} height={40} color="#4CAF50" style={styles.icon} />
          <View style={styles.userTextContainer}>
            <Text style={styles.username}>USERNAME</Text>
            <Text style={styles.sessionTime}>INICIO DE SESIÓN: 00:00</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('IniciarTrabajo')} // Navega a IniciarTrabajo.js
        >
          <Text style={styles.buttonText}>Iniciar trabajo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('ControlSoporteScreen')}
        >
          <Text style={styles.buttonText}>Registro técnico</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('FinTrabajoScreen')}
        >
          <Text style={styles.buttonText}>Terminar trabajo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('VerReporte')}
        >
          <Text style={styles.buttonText}>Ver reporte</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.exitButton} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.exitButtonText}>Salir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  userTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000080',
  },
  sessionTime: {
    fontSize: 14,
    color: '#000080',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#00a8e8',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    width: '80%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
  },
  exitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
