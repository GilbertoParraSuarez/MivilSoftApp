import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, PermissionsAndroid } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import CalendarIcon from '../icons/calendarIcon';
import TimeIcon from '../icons/timeIcon';
import UploadIcon from '../icons/uploadIcon';
import CommentIcon from '../icons/commentIcon';
import { launchCamera } from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Geolocation from 'react-native-geolocation-service';

const IniciarTrabajo = () => {
  const navigation = useNavigation();
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [comentario, setComentario] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [imageUri, setImageUri] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const viewShotRef = useRef(); // Referencia para ViewShot
  const [mensajeLimite, setMensajeLimite] = useState(false);
  const [id, setId] = useState('');

  const maxCaracteres = 200;

  // Función para obtener la fecha actual formateada
  const obtenerFechaActual = () => {
    const hoy = new Date();
    return hoy.toLocaleDateString('es-ES');
  };

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
    setHoraInicio(currentTime.toLocaleTimeString('es-ES'));
  };

  // Función para generar un ID alfanumérico único
  const generarIdAlfanumerico = () => {
    return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  };

  // Función para obtener la hora actual formateada
  const obtenerHoraActual = () => {
    const ahora = new Date();
    return ahora.toLocaleTimeString('es-ES', { hour12: false });
  };

  useEffect(() => {
    setFecha(obtenerFechaActual());
    setHoraInicio(obtenerHoraActual());
    setId(generarIdAlfanumerico());
    obtenerUbicacion(); // Obtener la ubicación al iniciar
  }, []);

  // Solicitar permisos de cámara y ubicación en tiempo de ejecución
  const requestPermissions = async () => {
    const cameraPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    const locationPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    return cameraPermission === PermissionsAndroid.RESULTS.GRANTED && locationPermission === PermissionsAndroid.RESULTS.GRANTED;
  };

  // Obtener la ubicación actual
  const obtenerUbicacion = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUbicacion({ latitude, longitude });
      },
      error => {
        Alert.alert('Error al obtener ubicación', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Función para abrir la cámara y capturar la foto
  const openCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permiso denegado', 'No tienes permiso para acceder a la cámara o ubicación.');
      return;
    }

    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
      quality: 1,
    };

    launchCamera(options, async (response) => {
      if (response.didCancel) {
        Alert.alert('Cancelado', 'No se tomó ninguna foto.');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);

        // Guardar la imagen automáticamente después de tomar la foto
        setTimeout(async () => {
          await captureViewAndSave(); // Capturar la imagen con el texto superpuesto y guardar
        }, 500); // Un pequeño retraso antes de capturar
      }
    });
  };

  // Función para capturar la vista y guardar la imagen
  const captureViewAndSave = async () => {
    try {
      const uri = await viewShotRef.current.capture(); // Capturar la vista con el texto superpuesto
      const fileName = `captured_image_${Date.now()}.jpg`;
      const newFilePath = `${RNFS.PicturesDirectoryPath}/${fileName}`; // Guardar en la carpeta de imágenes en Android

      // Mover el archivo capturado a la carpeta de imágenes
      await RNFS.moveFile(uri, newFilePath);

      Alert.alert('Éxito', `Imagen guardada en: ${newFilePath}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la imagen');
      console.error(error);
    }
  };

  // Función para manejar el cambio de texto en el comentario
  const onChangeComentario = (text) => {
    if (text.length <= maxCaracteres) {
      setComentario(text);
      setMensajeLimite(false);
    } else {
      setMensajeLimite(true);
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
            <TouchableOpacity style={tw`border border-gray-300 rounded-md py-2 px-4 bg-gray-100 w-full`} onPress={openCamera}>
              <Text style={tw`text-base text-gray-500 text-center`}>Tomar foto</Text>
            </TouchableOpacity>
          </View>
          {imageUri && (
            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={{ marginBottom: 20, position: 'relative' }}>
              <Image source={{ uri: imageUri }} style={tw`w-full h-40 mt-4`} />
              {/* Texto superpuesto sobre la imagen */}
              <View style={{ position: 'absolute', bottom: 0, left: 10, right: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Fecha: {fecha}</Text>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Hora: {horaInicio}</Text>
                {ubicacion && (
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                    Lat: {ubicacion.latitude}, Long: {ubicacion.longitude}
                  </Text>
                )}
              </View>
            </ViewShot>
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
            onChangeText={onChangeComentario}
            multiline
          />
          {mensajeLimite && (
            <View style={tw`mt-2 bg-red-500 rounded p-1`}>
              <Text style={tw`text-white text-sm`}>Has alcanzado el número máximo de caracteres</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botón de Enviar */}
      <View style={tw`absolute bottom-0 left-0 right-0 bg-white p-5`}>
        <TouchableOpacity
          style={tw`bg-blue-900 py-3 rounded-full w-[140px] self-center`}
          onPress={() => navigation.navigate('ConfirmacionIdScreen', { horaInicio, id })}
        >
          <Text style={tw`text-white text-center text-base font-bold`}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IniciarTrabajo;
