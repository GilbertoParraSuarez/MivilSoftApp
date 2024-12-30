import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import UserIcon from '../icons/userIcon';
import LockIcon from '../icons/lockIcon';
import EyeIcon from '../icons/eyeIcon';
import SlashEyeIcon from '../icons/slashEyeIcon';
import tw from 'twrnc';
import odoo from '../services/odooClient';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const { login } = useContext(AuthContext);

  const handleLogin = () => {
    if (!username || !password) {
      alert('Por favor ingrese sus credenciales');
      return;
    }

    odoo.username = username;
    odoo.password = password;

    odoo.connect(err => {
      if (err) {
        console.error('Error al iniciar sesión:', err.message);
        alert('Error al iniciar sesión');
        return;
      }

      login(username, password); // Guarda las credenciales en el contexto
      //Alert.alert('Conexión exitosa', 'Sesión iniciada correctamente');
      navigation.navigate('Dashboard');
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
    console.log('Estado de showPassword:', !showPassword);
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-4 bg-white`}>
      <Image
        source={require('../../assets/mivilsoft.jpeg')}
        style={tw`w-38 h-38 mb-5`}
      />

      <Text style={tw`text-2xl font-bold text-blue-800 mb-8`}>MIVILSOFT</Text>

      <Image
        source={require('../../assets/avatar.png')}
        style={tw`w-25 h-25 mb-5`}
      />

      <View
        style={tw`flex-row items-center border border-gray-300 rounded-lg px-2 mb-5 w-4/5 h-12`}>
        <UserIcon width={20} height={20} color="#000080" style={tw`mr-2`} />
        <TextInput
          style={tw`flex-1 h-full text-gray-700`}
          placeholder="Ingresar nombre de usuario"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View
        style={tw`flex-row items-center border border-gray-300 rounded-lg px-2 mb-5 w-4/5 h-12`}>
        <LockIcon width={20} height={20} color="#000080" style={tw`mr-2`} />
        <TextInput
          style={tw`flex-1 h-full text-gray-700`}
          placeholder="Ingresar contraseña"
          value={password}
          secureTextEntry={!showPassword} // Usa showPassword para mostrar o no la contraseña
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <View style={tw`ml-2`}>
            {showPassword ? (
              <EyeIcon fill="#969696" width={20} height={20} />
            ) : (
              <SlashEyeIcon fill="#969696" width={20} height={20} />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={tw`bg-blue-800 py-3 px-12 rounded-full mt-5`}
        onPress={handleLogin}>
        <Text style={tw`text-white text-base font-bold`}>Ingreso</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
