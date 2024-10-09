import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, PermissionsAndroid, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import LocationIcon from '../icons/locationIcon';
import TimeIcon from '../icons/timeIcon';
import UploadIcon from '../icons/uploadIcon';
import CommentIcon from '../icons/commentIcon';
import WebView from 'react-native-webview'; // Para OpenStreetMap
import Geolocation from 'react-native-geolocation-service';

const ControlSoporteScreen = () => {
  const navigation = useNavigation();

  const [horaSoporte, setHoraSoporte] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [comentario, setComentario] = useState('');
  const [images, setImages] = useState([]);
  const [mensajeLimite, setMensajeLimite] = useState(false);
  const maxCaracteres = 200;
  const [location, setLocation] = useState(null); // Estado para la ubicación
  const [loading, setLoading] = useState(true); // Estado para manejar el indicador de carga
  const [newLocation, setNewLocation] = useState(null); // Nueva ubicación fijada

  // Función para obtener la hora actual formateada
  const obtenerHoraActual = () => {
    const ahora = new Date();
    return ahora.toLocaleTimeString('es-ES', { hour12: false }); // Formato 24 horas
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
        setImages([...images, uri]);
      }
    });
  };

  // Función para abrir la galería con múltiples imágenes
  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 0,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('Cancelado', 'No se seleccionó ninguna imagen.');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else {
        const uris = response.assets.map(asset => asset.uri);
        setImages([...images, ...uris]);
      }
    });
  };

  // Solicitar permisos de ubicación y obtener la ubicación del usuario
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Permiso para acceder a la ubicación",
          message: "La aplicación necesita acceder a tu ubicación para mostrarla en el mapa",
          buttonNeutral: "Preguntar más tarde",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
      } else {
        Alert.alert('Permiso denegado', 'No tienes permiso para acceder a la ubicación.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setLoading(false); // Deja de cargar cuando se obtiene la ubicación
      },
      (error) => {
        Alert.alert("Error obteniendo la ubicación", error.message);
        setLoading(false); // Deja de cargar aunque ocurra un error
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  useEffect(() => {   
    requestLocationPermission();
    setHoraSoporte(obtenerHoraActual());
  }, []);

  // Código JS para OpenStreetMap con marcador movible
  const injectedJavaScript = `
    var map = L.map('map').setView([${location ? location.latitude : 0}, ${location ? location.longitude : 0}], 18);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var marker = L.marker([${location ? location.latitude : 0}, ${location ? location.longitude : 0}], {
      draggable: true
    }).addTo(map);

    marker.on('dragend', function (e) {
      var latlng = marker.getLatLng();
      window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: latlng.lat, longitude: latlng.lng }));
    });
  `;

  const handleMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    setNewLocation({ latitude: data.latitude, longitude: data.longitude });
    Alert.alert(`Nueva ubicación fijada`, `Latitud: ${data.latitude}, Longitud: ${data.longitude}`);
  };

  // Manejo de la selección de hora de soporte
  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(Platform.OS === 'ios');
    setSelectedTime(currentTime);
    setHoraSoporte(currentTime.toLocaleTimeString('es-ES') || '00:00:00');
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
        <Text style={tw`text-xl font-bold text-center mb-3`}>Control de soporte técnico</Text>
        <Text style={tw`text-sm text-center text-gray-500 mb-6`}>Ingrese evidencias de cada soporte</Text>

        {/* Subir Ubicación con LocationIcon */}
        <View style={tw`mb-5 pb-2 border-b border-gray-200`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-lg font-bold mb-2`}>Subir ubicación</Text>
            <LocationIcon width={24} height={24} />
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={tw`h-60 w-full mb-5`}>
              <WebView
                style={tw`w-full h-full`}
                originWhitelist={['*']}
                source={{
                  html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>Mapa</title>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
                      <style>
                        #map { height: 100vh; width: 100vw; }
                      </style>
                    </head>
                    <body>
                      <div id="map"></div>
                      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
                      <script>
                        ${injectedJavaScript}
                      </script>
                    </body>
                    </html>
                  `,
                }}
                injectedJavaScript={injectedJavaScript}
                onMessage={handleMessage}
              />
            </View>
          )}
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

      {/* Botón de Terminar */}
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

export default ControlSoporteScreen;
