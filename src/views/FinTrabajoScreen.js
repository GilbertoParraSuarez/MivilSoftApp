import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, PermissionsAndroid } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { launchCamera } from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Geolocation from 'react-native-geolocation-service';
import CalendarIcon from '../icons/calendarIcon'; // Importando ícono de calendario
import TimeIcon from '../icons/timeIcon'; // Importando ícono de reloj
import UploadIcon from '../icons/uploadIcon'; // Importando ícono de subida
import CommentIcon from '../icons/commentIcon'; // Importando ícono de comentario

const FinTrabajoScreen = () => {
  const navigation = useNavigation();
  const viewShotRef = useRef();

  const [fecha, setFecha] = useState('');
  const [horaFinalizacion, setHoraFinalizacion] = useState('');
  const [comentario, setComentario] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [imageUri, setImageUri] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [mensajeLimite, setMensajeLimite] = useState(false);

  const maxCaracteres = 200;

  const obtenerFechaActual = () => new Date().toLocaleDateString('es-ES');
  const obtenerHoraActual = () =>
    new Date().toLocaleTimeString('es-ES', { hour12: false });

  useEffect(() => {
    setFecha(obtenerFechaActual());
    setHoraFinalizacion(obtenerHoraActual());
    obtenerUbicacion();
  }, []);

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

  const requestPermissions = async () => {
    const cameraPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    const locationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return (
      cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
      locationPermission === PermissionsAndroid.RESULTS.GRANTED
    );
  };

  const openCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permiso denegado', 'No tienes permiso para acceder a la cámara.');
      return;
    }

    const options = { mediaType: 'photo', quality: 1 };
    launchCamera(options, async response => {
      if (response.didCancel) {
        Alert.alert('Cancelado', 'No se tomó ninguna foto.');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        await captureViewAndSave();
      }
    });
  };

  const captureViewAndSave = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      const fileName = `captured_image_${Date.now()}.jpg`;
      const newFilePath = `${RNFS.PicturesDirectoryPath}/${fileName}`;
      await RNFS.moveFile(uri, newFilePath);
      Alert.alert('Éxito', `Imagen guardada en: ${newFilePath}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la imagen');
      console.error(error);
    }
  };

  const onChangeComentario = text => {
    if (text.length <= maxCaracteres) {
      setComentario(text);
      setMensajeLimite(false);
    } else {
      setMensajeLimite(true);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFecha(selectedDate.toLocaleDateString('es-ES'));
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setHoraFinalizacion(selectedTime.toLocaleTimeString('es-ES'));
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`p-5 pb-20`}>
        <Text style={tw`text-xl font-bold text-center mb-3`}>Formulario de seguimiento</Text>
        <Text style={tw`text-base text-center text-gray-500 mb-6`}>Complete todos los campos</Text>

        <View style={tw`mb-5 pb-2 border-b border-gray-200`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-base font-bold mb-1`}>Fecha</Text>
            <CalendarIcon width={24} height={24} />
          </View>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={tw`border border-gray-300 rounded-md px-3 py-2 text-base`}
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

        <View style={tw`mb-5 pb-2 border-b border-gray-200`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-base font-bold mb-1`}>Hora de finalización</Text>
            <TimeIcon width={24} height={24} />
          </View>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <TextInput
              style={tw`border border-gray-300 rounded-md px-3 py-2 text-base`}
              value={horaFinalizacion}
              editable={false}
            />
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour
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

          {/* Botón "Tomar foto" centrado */}
          <View style={tw`flex-row justify-center mt-2`}>
            <TouchableOpacity style={tw`border border-gray-200 rounded-md py-4 bg-gray-100 w-full items-center`} onPress={openCamera}>
              <Text style={tw`text-base text-gray-500`}>Tomar foto</Text>
            </TouchableOpacity>
          </View>

          {/* Imagen capturada con el filtro en el centro */}
          {imageUri && (
            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={tw`w-full h-48 mt-4 relative`}>
              <Image source={{ uri: imageUri }} style={tw`w-full h-full rounded-md`} />
              <TouchableOpacity
                style={tw`absolute top-1 right-1 bg-red-500 w-6 h-6 rounded-full items-center justify-center`}
                onPress={() => setImageUri(null)} // Eliminar la imagen
              >
                <Text style={tw`text-white text-xs`}>X</Text>
              </TouchableOpacity>
              {/* Texto superpuesto sobre la imagen */}
              <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 5 }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Fecha: {fecha}</Text>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Hora: {horaFinalizacion}</Text>
                {ubicacion && (
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                    Lat: {ubicacion.latitude.toFixed(6)}, Long: {ubicacion.longitude.toFixed(6)}
                  </Text>
                )}
              </View>
            </ViewShot>
          )}
        </View>

        <View style={tw`mb-5 pb-2 border-b border-gray-200`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-base font-bold mb-1`}>Comentario</Text>
            <CommentIcon width={24} height={24} />
          </View>
          <TextInput
            style={tw`border border-gray-300 rounded-md px-3 py-2 text-base h-20`}
            placeholder="Escribe un comentario..."
            value={comentario}
            onChangeText={onChangeComentario}
            multiline
          />
          {mensajeLimite && (
            <View style={tw`mt-2 bg-red-500 rounded p-1`}>
              <Text style={tw`text-white text-sm`}>
                Máximo de caracteres alcanzado.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

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
