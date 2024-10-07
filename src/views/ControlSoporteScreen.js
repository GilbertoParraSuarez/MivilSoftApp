import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, PermissionsAndroid, ScrollView, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; // Importa las funciones de image-picker
import LocationIcon from '../icons/locationIcon'; // Importar icono de ubicación
import TimeIcon from '../icons/timeIcon'; 
import UploadIcon from '../icons/uploadIcon'; 

const ControlSoporteScreen = () => {
  const navigation = useNavigation();

  const [horaSoporte, setHoraSoporte] = useState(''); 
  const [showTimePicker, setShowTimePicker] = useState(false); 
  const [selectedTime, setSelectedTime] = useState(new Date()); 
  const [images, setImages] = useState([]); // Estado para almacenar múltiples imágenes

  // Manejo de la selección de hora de soporte
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(Platform.OS === 'ios');
    setSelectedTime(currentTime);
    setHoraSoporte(currentTime.toLocaleTimeString('es-ES') || '00:00:00'); // Establece la hora en el formato de tiempo
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
        setImages([...images, uri]); // Agrega la nueva imagen al array de imágenes
      }
    });
  };

  // Función para abrir la galería
  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('Cancelado', 'No se seleccionó ninguna imagen.');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setImages([...images, uri]); // Agrega la nueva imagen al array de imágenes
      }
    });
  };

  // Función para eliminar una imagen seleccionada
  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages); // Actualiza el estado eliminando la imagen seleccionada
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`p-5 pb-20`}>
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
          <View style={tw`flex-row justify-around mt-2`}>
            <TouchableOpacity style={tw`border border-gray-300 rounded-md py-2 px-4 bg-gray-100`} onPress={openCamera}>
              <Text style={tw`text-base text-gray-500`}>Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`border border-gray-300 rounded-md py-2 px-4 bg-gray-100`} onPress={openGallery}>
              <Text style={tw`text-base text-gray-500`}>Seleccionar de galería</Text>
            </TouchableOpacity>
          </View>

          {/* Mostrar las imágenes seleccionadas */}
          {images.length > 0 && (
            <FlatList
              data={images}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={tw`relative`}>
                  <Image source={{ uri: item }} style={tw`w-40 h-40 m-2`} />
                  {/* Botón para eliminar imagen */}
                  <TouchableOpacity 
                    style={tw`absolute top-0 right-0 bg-red-500 w-6 h-6 rounded-full items-center justify-center`} 
                    onPress={() => removeImage(index)}
                  >
                    <Text style={tw`text-white text-xs`}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* Botón de Terminar fijo en la parte inferior */}
      <View style={tw`absolute bottom-0 left-0 right-0 bg-white p-5`}>
        <TouchableOpacity
          style={tw`bg-blue-900 py-3 rounded-full w-[140px] self-center`}
          onPress={() => navigation.navigate('ConfirmacionScreen')}
        >
          <Text style={tw`text-white text-center text-base font-bold`}>Terminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ControlSoporteScreen;
