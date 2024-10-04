import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Image, Alert, PermissionsAndroid, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import CalendarIcon from '../icons/calendarIcon'; // Importar icono de calendario
import TimeIcon from '../icons/timeIcon'; // Importar icono de reloj
import UploadIcon from '../icons/uploadIcon'; // Importar icono de subir archivo
import CommentIcon from '../icons/commentIcon'; // Importar icono de comentario
import { launchCamera } from 'react-native-image-picker'; // Importa las funciones de image-picker

const IniciarTrabajo = () => {
  const navigation = useNavigation();

  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [comentario, setComentario] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false); // Estado para el selector de hora
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date()); // Estado para almacenar la hora seleccionada
  const [imageUri, setImageUri] = useState(null); // Estado para almacenar la URI de la imagen

  // Manejo de la selección de fecha
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
    setFecha(currentDate.toLocaleDateString('es-ES'));
  };

  // Manejo de la selección de hora
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(Platform.OS === 'ios');
    setSelectedTime(currentTime);
    setHoraInicio(currentTime.toLocaleTimeString('es-ES')); // Establece la hora en el formato de tiempo
  };

   // Solicitar permisos de cámara en tiempo de ejecución
   const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Permiso para usar la cámara",
          message: "La aplicación necesita acceder a tu cámara para tomar fotos",
          buttonNeutral: "Preguntar más tarde",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Función para abrir la cámara
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permiso denegado', 'No tienes permiso para acceder a la cámara.');
      return;
    }

    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
      quality: 1,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        Alert.alert('Cancelado', 'No se tomó ninguna foto.');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri); // Guarda la imagen seleccionada en el estado
      }
    });
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`p-5 pb-20`}>
        <Text style={tw`text-xl font-bold text-center mb-3`}>Formulario de seguimiento</Text>
        <Text style={tw`text-base text-center text-gray-500 mb-6`}>Complete todos los campos</Text>

        {/* Campo de Fecha */}
        <View style={tw`mb-5 pb-2 border-b border-gray-200`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-base font-bold mb-1`}>Fecha</Text>
            <CalendarIcon width={24} height={24} />
          </View>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={tw`border border-gray-300 rounded-md px-3 py-2 text-base`}
              placeholder="dd/mm/yyyy"
              value={fecha}
              editable={false}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <View style={tw`flex-row justify-between mt-2`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-base text-green-600`}>✔ Checked</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <TouchableOpacity>
                <Text style={tw`text-blue-600 mr-3`}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={tw`text-blue-600`}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Campo de Hora de Inicio */}
        <View style={tw`mb-5 pb-2 border-b border-gray-200`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-base font-bold mb-1`}>Hora de inicio</Text>
            <TimeIcon width={24} height={24} />
          </View>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <TextInput
              style={tw`border border-gray-300 rounded-md px-3 py-2 text-base`}
              placeholder="00:00:00"
              value={horaInicio}
              editable={false} // Evita la edición directa
            />
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true} // Utiliza formato de 24 horas
              display="default"
              onChange={onTimeChange}
            />
          )}
          <View style={tw`flex-row justify-between mt-2`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-base text-green-600`}>✔ Checked</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <TouchableOpacity>
                <Text style={tw`text-blue-600 mr-3`}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={tw`text-blue-600`}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Subir Foto */}
        <View style={tw`mb-5 pb-2 border-b border-gray-200`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-base font-bold mb-1`}>Subir foto</Text>
            <UploadIcon width={24} height={24} />
          </View>
          <View style={tw`flex-row justify-around mt-2`}>
            {/* Aumenta el ancho del botón */}
            <TouchableOpacity style={tw`border border-gray-300 rounded-md py-2 px-4 bg-gray-100 w-full`} onPress={openCamera}>
              <Text style={tw`text-base text-gray-500 text-center`}>Tomar foto</Text>
            </TouchableOpacity>
          </View>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={tw`w-full h-40 mt-4`} />
          )}
        </View>

        {/* Comentario */}
        <View style={tw`mb-5 pb-2 border-b border-gray-200`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-base font-bold mb-1`}>Comentario</Text>
            <CommentIcon width={24} height={24} />
          </View>
          <TextInput
            style={tw`border border-gray-300 rounded-md px-3 py-2 text-base h-20`}
            placeholder="Establecer máximo de caracteres."
            value={comentario}
            onChangeText={setComentario}
            multiline
          />
          <View style={tw`flex-row justify-between mt-2`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-base text-green-600`}>✔ Checked</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <TouchableOpacity>
                <Text style={tw`text-blue-600 mr-3`}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={tw`text-blue-600`}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón de Terminar */}
      <TouchableOpacity
        style={tw`bg-blue-900 py-3 rounded-full w-[140px] self-center absolute bottom-1`} // Botón siempre en la parte inferior
        onPress={() => navigation.navigate('ConfirmacionIdScreen')}
      >
        <Text style={tw`text-white text-center text-base font-bold`}>Terminar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IniciarTrabajo;
