import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import ticketService from "../services/ticketService";
import stageService from "../services/stageService";
import customService from "../services/customService";

const AddTicket = ({ navigation }) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [customer, setCustomer] = useState("");
  const [stage, setStage] = useState("");
  const [persons, setPersons] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [currentField, setCurrentField] = useState("");
  const [currentSetter, setCurrentSetter] = useState(() => {});

  useEffect(() => {
    Promise.all([customService.getCustoms(), stageService.getStages()])
      .then(([customData, stageData]) => {
        setPersons(customData);
        setStages(stageData);
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error.message);
      });
  }, []);

  const handleAddTicket = async () => {
    if (!subject || !description || !customer || !stage) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const lastTicket = await ticketService.getLastTicket();
      const newId = lastTicket ? lastTicket.id + 1 : 1;
      const formattedName = `TKT${newId.toString().padStart(5, "0")}`;

      const ticketData = {
        name: formattedName,
        subject,
        description,
        customer_id: customer,
        stage_id: stage,
      };

      console.log("Datos enviados a ticket.helpdesk:", ticketData);

      await ticketService.createTicket(ticketData);
      Alert.alert("Éxito", "Ticket creado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al crear ticket:", error.message);
      Alert.alert("Error", "No se pudo crear el ticket.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (options, field, setter) => {
    setCurrentOptions(options);
    setCurrentField(field);
    setCurrentSetter(() => setter);
    setModalVisible(true);
  };

  const renderModalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        currentSetter(item.id);
        setModalVisible(false);
      }}
    >
      <Text style={styles.modalItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderModal = () => (
    <Modal transparent={true} visible={modalVisible} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{`Seleccione ${currentField}`}</Text>
          <FlatList
            data={currentOptions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderModalItem}
            showsVerticalScrollIndicator
            style={{ maxHeight: 300 }}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderModal()}

      <Text style={styles.label}>Subject</Text>
      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
        placeholder="Escribe el asunto"
      />

      <Text style={styles.label}>Customer</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => openModal(persons, "Cliente", setCustomer)}
      >
        <Text>
          {customer
            ? persons.find((person) => person.id === customer)?.name
            : "Seleccione un cliente"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Escribe la descripción"
        multiline
      />

      <Text style={styles.label}>Stage</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => openModal(stages, "Fase", setStage)}
      >
        <Text>
          {stage
            ? stages.find((stageItem) => stageItem.id === stage)?.name
            : "Seleccione una fase"}
        </Text>
      </TouchableOpacity>

      <Button
        title={loading ? "Creando..." : "Agregar"}
        onPress={handleAddTicket}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddTicket;
