import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ticketService from '../services/ticketService';
import stageService from '../services/stageService';
import React, {useState, useEffect} from 'react';
import customService from '../services/customService';
import tagService from '../services/tagService';
import typeService from '../services/typeService';
import productService from '../services/productService';

const UpdateTicket = ({route, navigation}) => {
  const {ticket} = route.params;

  const [stages, setStages] = useState([]);
  const [stage, setStage] = useState(ticket.stage_id[0] || 1);
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(
    ticket.customer_id ? ticket.customer_id[0] : null,
  );
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(
    ticket.tags_ids && ticket.tags_ids.length > 0
      ? ticket.tags_ids[ticket.tags_ids.length - 1]
      : null,
  );
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(
    ticket.ticket_type_id[0] || 0,
  );
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(
    ticket.product_ids && ticket.product_ids.length > 0
      ? ticket.product_ids[ticket.product_ids.length - 1]
      : null,
  );

  // Fechas
      const [createDate, setCreateDate] = useState(
        ticket.create_date ? new Date(ticket.create_date) : new Date(),
      );
      const [startDate, setStartDate] = useState(
        ticket.start_date ? new Date(ticket.start_date) : null,
      );
      const [endDate, setEndDate] = useState(
        ticket.end_date ? new Date(ticket.end_date) : null,
      );

  const [name, setName] = useState(ticket.name || '');
  const [subject, setSubject] = useState(ticket.subject || '');
  const [description, setDescription] = useState(ticket.description || '');

  const [priority, setPriority] = useState(ticket.priority || 1);
  const [email, setEmail] = useState(ticket.email || '');
  const [phone, setPhone] = useState(ticket.phone || '');

  const [modalVisible, setModalVisible] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [currentField, setCurrentField] = useState('');
  const [currentSetter, setCurrentSetter] = useState(() => {});
  const [showCreateDatePicker, setShowCreateDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const formatDateForOdoo = date => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleUpdate = async () => {
        const updatedTicket = {
          name,
          subject,
          description,
          priority: String(priority),
          stage_id: stage,
          email,
          phone,
          create_date: formatDateForOdoo(createDate),
          start_date: startDate ? formatDateForOdoo(startDate) : null,
          end_date: endDate ? formatDateForOdoo(endDate) : null,
          customer_id: selectedPerson,
          tags_ids: selectedTag,
          ticket_type_id: selectedType,
          product_ids: selectedProduct,
        };
    
        try {
          await ticketService.updateTicket(ticket.id, updatedTicket);
          Alert.alert('Éxito', 'El ticket ha sido actualizado correctamente.');
          navigation.goBack();
        } catch (error) {
          console.error('Error al actualizar el ticket:', error.message);
          Alert.alert('Error', 'No se pudo actualizar el ticket.');
        }
      };
  
  useEffect(() => {
    Promise.all([
      stageService.getStages(),
      customService.getCustoms(),
      tagService.getTags(),
      typeService.getTypes(),
      productService.getProducts(),
    ])
      .then(([stageData, customData, tagData, typeData, productData]) => {
        setStages(stageData);
        setPersons(customData);
        setTags(tagData);
        setTypes(typeData);
        setProducts(productData);
      })
      .catch(error => {
        console.error('Error al cargar datos:', error.message);
        Alert.alert('Error', 'No se pudieron cargar los datos.');
      });
  }, []);

  const openModal = (options, field, setter) => {
    setCurrentOptions(options);
    setCurrentField(field);
    setCurrentSetter(() => setter);
    setModalVisible(true);
  };

  const renderModalItem = ({item}) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        currentSetter(item.id);
        setModalVisible(false);
      }}>
      <Text style={styles.modalItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderDatePicker = (date, setDate, show, setShow) => (
    <>
      {show && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShow(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
    </>
  );

  const renderModal = () => (
    <Modal transparent={true} visible={modalVisible} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{`Seleccione ${currentField}`}</Text>
          <FlatList
            data={currentOptions}
            keyExtractor={item => item.id.toString()}
            renderItem={renderModalItem}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderStars = () => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4].map(value => (
        <TouchableOpacity key={value} onPress={() => setPriority(value)}>
          <Text
            style={{fontSize: 24, color: value <= priority ? 'gold' : 'gray'}}>
            {value <= priority ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderModal()}

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre"
      />

      <Text style={styles.label}>Subject</Text>
      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
        placeholder="Subject"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción"
      />

      <Text style={styles.label}>Customer</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => openModal(persons, 'Cliente', setSelectedPerson)}>
        <Text>
          {selectedPerson
            ? persons.find(person => person.id === selectedPerson)?.name
            : 'Seleccione un cliente'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Stage</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => openModal(stages, 'Etapa', setStage)}>
        <Text>
          {stage
            ? stages.find(stageItem => stageItem.id === stage)?.name
            : 'Seleccione una etapa'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Priority</Text>
      {renderStars()}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Correo electrónico"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Teléfono"
      />

      <Text style={styles.label}>Tags</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => openModal(tags, 'Etiqueta', setSelectedTag)}>
        <Text>
          {selectedTag
            ? tags.find(tag => tag.id === selectedTag)?.name
            : 'Seleccione una etiqueta'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Product</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => openModal(products, 'Producto', setSelectedProduct)}>
        <Text>
          {selectedProduct
            ? products.find(product => product.id === selectedProduct)?.name
            : 'Seleccione un producto'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Ticket Type</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => openModal(types, 'Tipo de Ticket', setSelectedType)}>
        <Text>
          {selectedType
            ? types.find(type => type.id === selectedType)?.name
            : 'Seleccione un tipo de ticket'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.label}>Create Date</Text>
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => setShowCreateDatePicker(true)}>
        <Text>{createDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {renderDatePicker(
        createDate,
        setCreateDate,
        showCreateDatePicker,
        setShowCreateDatePicker,
      )}

      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => setShowStartDatePicker(true)}>
        <Text>
          {startDate ? startDate.toLocaleDateString() : 'Seleccionar fecha'}
        </Text>
      </TouchableOpacity>
      {renderDatePicker(
        startDate,
        setStartDate,
        showStartDatePicker,
        setShowStartDatePicker,
      )}

      <Text style={styles.label}>End Date</Text>
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => setShowEndDatePicker(true)}>
        <Text>
          {endDate ? endDate.toLocaleDateString() : 'Seleccionar fecha'}
        </Text>
      </TouchableOpacity>
      {renderDatePicker(
        endDate,
        setEndDate,
        showEndDatePicker,
        setShowEndDatePicker,
      )}

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Actualizar Ticket</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16, backgroundColor: '#fff'},
  label: {fontSize: 16, fontWeight: 'bold', marginBottom: 8},
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    maxHeight:'70%'
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 16},
  modalItem: {padding: 12, borderBottomWidth: 1, borderColor: 'gray'},
  modalItemText: {fontSize: 16},
  modalCloseButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  modalCloseButtonText: {color: '#fff', fontWeight: 'bold'},
    datePicker: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 8,
      padding: 8,
      marginBottom: 16,
      alignItems: 'center',
    },
    starContainer: {flexDirection: 'row', marginBottom: 16},
    updateButton: {
      backgroundColor: '#007bff',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    updateButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});

export default UpdateTicket;
