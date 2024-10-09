import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, Image, Alert, PermissionsAndroid, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { launchCamera } from 'react-native-image-picker'; // Importa las funciones de image-picker
import CalendarIcon from '../icons/calendarIcon'; // Importar icono de calendario
import TimeIcon from '../icons/timeIcon'; // Importar icono de reloj
import UploadIcon from '../icons/uploadIcon'; // Importar icono de subir archivo
import CommentIcon from '../icons/commentIcon'; // Importar icono de comentario

const FinTrabajoScreen = () => {
  const navigation = useNavigation();

  const [fecha, setFecha] = useState('');
  const [horaFinalizacion, setHoraFinalizacion] = useState('');
  const [comentario, setComentario] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [imageUri, setImageUri] = useState(null); // Estado para almacenar la URI de la imagen
  const [mensajeLimite, setMensajeLimite] = useState(false); // Estado para mostrar el mensaje de límite

  const maxCaracteres = 200; // Límite de caracteres para el comentario

  // Función para obtener la fecha actual
  const obtenerFechaActual = () => {
    const hoy = new Date();
    return hoy.toLocaleDateString('es-ES');
  };

    // Función para obtener la hora actual formateada
    const obtenerHoraActual = () => {
      const ahora = new Date();
      return ahora.toLocaleTimeString('es-ES', { hour12: false }); // Formato 24 horas
    };

  // Al cargar el componente, establecemos la fecha actual como predeterminada
  useEffect(() => {
    setFecha(obtenerFechaActual());
    setHoraFinalizacion(obtenerHoraActual()); // Establecer la hora actual al entrar en la pantalla
  }, []);

  // Manejo de la selección de fecha
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
    setFecha(currentDate.toLocaleDateString('es-ES'));
  };

  // Manejo de la selección de hora (hora de finalización)
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(Platform.OS === 'ios');
    setSelectedTime(currentTime);
    setHoraFinalizacion(currentTime.toLocaleTimeString('es-ES') || '00:00:00'); // Valor por defecto si no hay tiempo seleccionado
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

  // Función para manejar el cambio de texto en el comentario
  const onChangeComentario = (text) => {
    if (text.length <= maxCaracteres) {
      setComentario(text);
      setMensajeLimite(false); // Ocultar el mensaje si no se excede el límite
    } else {
      setMensajeLimite(true); // Mostrar el mensaje si se excede el límite
    }
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
        </View>

        {/* Campo de Hora de Finalización */}
        <View style={tw`mb-5 pb-2 border-b border-gray-200`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-base font-bold mb-1`}>Hora de finalización</Text>
            <TimeIcon width={24} height={24} />
          </View>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <TextInput
              style={tw`border border-gray-300 rounded-md px-3 py-2 text-base`}
              placeholder="00:00:00"
              value={horaFinalizacion || '00:00:00'}  // Aseguramos que siempre haya un valor por defecto
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
            onChangeText={onChangeComentario} // Manejo del cambio de texto
            multiline
          />
          {/* Mensaje emergente si se alcanzan los 100 caracteres */}
          {mensajeLimite && (
            <View style={tw`mt-2 bg-red-500 rounded p-1`}>
              <Text style={tw`text-white text-sm`}>Has alcanzado el número máximo de caracteres</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botón de Terminar fijo en la parte inferior */}
      <View style={tw`absolute bottom-0 left-0 right-0 bg-white p-5`}>
        <TouchableOpacity
          style={tw`bg-blue-900 py-3 rounded-full w-[140px] self-center`}
          onPress={() => navigation.navigate('ConfirmacionScreen')}
        >
          <Text style={tw`text-white text-center text-base font-bold`}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FinTrabajoScreen;
