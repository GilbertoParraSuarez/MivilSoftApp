import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ticketService from '../services/ticketService';
import DeleteIcon from '../icons/deleteicon';
import EditIcon from '../icons/editicon';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  // Función para obtener tickets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTickets();
      setTickets(data);
      setError('');
    } catch (err) {
      console.error('Error al cargar los tickets:', err.message);
      setError('Error al cargar los tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchTickets(); // Llama a esta función cada vez que la pantalla recobra el foco
    });
  
    fetchTickets(); // Carga los tickets al montar la pantalla
  
    return unsubscribe; // Limpia el listener al desmontar el componente
  }, [navigation]);
  

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchTickets();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ticketService.deleteTicket(id);
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== id));
      await fetchTickets();
    } catch (err) {
      console.error('Error al eliminar el ticket:', err.message);
    }
  };

  const confirmDelete = (item) => {
    Alert.alert(
      'Eliminar Ticket',
      `¿Estás seguro de que deseas eliminar el ticket "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleDelete(item.id),
        },
      ],
    );
  };

  const handleAddTicket = () => {
    navigation.navigate('AddTicket', {
      refreshTickets: fetchTickets,
    });
  };

  const handleEditTicket = (ticket) => {
    navigation.navigate('UpdateTicket', {
      ticket,
    });
    
  };

  const renderTicket = ({ item }) => (
    <View style={styles.ticketCard}>
      <View style={styles.header}>
        <Text style={styles.ticketId}>{item.name}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleEditTicket(item)}
            style={styles.editButton}>
            <EditIcon width={24} height={24} fill="orange" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => confirmDelete(item)}
            style={styles.deleteButton}>
            <DeleteIcon width={24} height={24} fill="red" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.customerName}>
        {item.customer_id ? item.customer_id[1] : 'Sin cliente'}
      </Text>
      <Text style={styles.stage}>{`Fase: ${
        item.stage_id ? item.stage_id[1] : 'Sin fase'
      }`}</Text>
      <Text style={styles.priority}>{`Prioridad: ${
        ['Muy Baja', 'Baja', 'Normal', 'Alta', 'Muy Alta'][item.priority]
      }`}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTicket}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTicket}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  ticketCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketId: { fontWeight: 'bold', fontSize: 16, color: '#007bff' },
  customerName: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  stage: { fontSize: 14, color: '#555', marginTop: 4 },
  priority: { fontSize: 14, color: '#e67e22', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8 },
  editButton: {
    marginHorizontal: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#f1f1f1',
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: { color: '#007bff', fontWeight: '600' },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#007bff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TicketList;
