import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import LocationIcon from '../icons/locationIcon'; // Importar icono de ubicación
import TimeIcon from '../icons/timeIcon'; 
import UploadIcon from '../icons/uploadIcon'; 

const ControlSoporteScreen = () => {
  const navigation = useNavigation();

  const [horaSoporte, setHoraSoporte] = useState(''); 
  const [showTimePicker, setShowTimePicker] = useState(false); 
  const [selectedTime, setSelectedTime] = useState(new Date()); 

  // Manejo de la selección de hora de soporte
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(Platform.OS === 'ios');
    setSelectedTime(currentTime);
    setHoraSoporte(currentTime.toLocaleTimeString('es-ES') || '00:00:00'); // Establece la hora en el formato de tiempo
  };

  return (
    <View style={tw`flex-1 p-5 bg-white`}>
      <Text style={tw`text-xl font-bold text-center mb-3`}>Control de soporte técnico</Text>
      <Text style={tw`text-sm text-center text-gray-500 mb-6`}>Ingrese evidencias de cada soporte</Text>

      {/* Subir Ubicación con LocationIcon */}
      <View style={tw`mb-5 pb-2 border-b border-gray-200`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-lg font-bold mb-2`}>Subir ubicación</Text>
          <LocationIcon width={24} height={24} /> 
        </View>
        <Image
          source={{ uri: 'https://via.placeholder.com/200x100' }} 
          style={tw`w-full h-40 border border-gray-300 rounded-md mb-3`}
        />
        <View style={tw`flex-row justify-between`}>
          <Text style={tw`text-base text-green-600`}>✔ Checked</Text>
          <View style={tw`flex-row`}>
            <TouchableOpacity>
              <Text style={tw`text-blue-600 mr-3`}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={tw`text-blue-600`}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Hora de Soporte */}
      <View style={tw`mb-5 pb-2 border-b border-gray-200`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-lg font-bold mb-2`}>Hora de soporte</Text>
          <TimeIcon width={24} height={24} />
        </View>
        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <TextInput
            style={tw`border border-gray-300 rounded-md px-3 py-2 text-base`}
            placeholder="00:00:00"
            value={horaSoporte}
            editable={false} 
          />
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            is24Hour={true} 
            display="default"
            onChange={onTimeChange}
          />
        )}
        <View style={tw`flex-row justify-between mt-2`}>
          <Text style={tw`text-base text-green-600`}>✔ Checked</Text>
          <View style={tw`flex-row`}>
            <TouchableOpacity>
              <Text style={tw`text-blue-600 mr-3`}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={tw`text-blue-600`}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Subir Fotos */}
      <View style={tw`mb-5 pb-2 border-b border-gray-200`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-lg font-bold mb-2`}>Subir fotos</Text>
          <UploadIcon width={24} height={24} />
        </View>
        <TouchableOpacity style={tw`border border-gray-300 rounded-md py-4 bg-gray-100`}>
          <Text style={tw`text-base text-gray-500 text-center`}>Subir archivos</Text>
        </TouchableOpacity>
        <View style={tw`flex-row justify-between mt-2`}>
          <Text style={tw`text-base text-green-600`}>✔ Checked</Text>
          <View style={tw`flex-row`}>
            <TouchableOpacity>
              <Text style={tw`text-blue-600 mr-3`}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={tw`text-blue-600`}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Botón de Terminar */}
      <TouchableOpacity
        style={tw`bg-blue-900 py-3 rounded-full mt-4 w-[140px] self-center`}
        onPress={() => navigation.navigate('ConfirmacionScreen')}
      >
        <Text style={tw`text-white text-center text-base font-bold`}>Terminar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ControlSoporteScreen;
