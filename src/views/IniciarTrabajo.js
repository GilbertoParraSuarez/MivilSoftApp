import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import CalendarIcon from '../icons/calendarIcon'; // Importar icono de calendario
import TimeIcon from '../icons/timeIcon'; // Importar icono de reloj
import UploadIcon from '../icons/uploadIcon'; // Importar icono de subir archivo
import CommentIcon from '../icons/commentIcon'; // Importar icono de comentario

const IniciarTrabajo = () => {
  const navigation = useNavigation();

  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [comentario, setComentario] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false); // Estado para el selector de hora
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date()); // Estado para almacenar la hora seleccionada

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

  return (
    <View style={tw`flex-1 p-5 bg-white`}>
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
        <TouchableOpacity style={tw`border border-gray-300 rounded-md py-3 bg-gray-100`}>
          <Text style={tw`text-base text-gray-500 text-center`}>Sube un archivo</Text>
        </TouchableOpacity>
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

      {/* Botón de Terminar */}
      <TouchableOpacity
        style={tw`bg-blue-900 py-3 rounded-full mt-4 w-[140px] self-center`}
        onPress={() => navigation.navigate('ConfirmacionIdScreen')}
      >
        <Text style={tw`text-white text-center text-base font-bold`}>Terminar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IniciarTrabajo;
