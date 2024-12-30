import odoo from "./odooClient";

const getTickets = async (filters = [], fields = [], limit = 50, offset = 0) => {
  return new Promise((resolve, reject) => {
    odoo.connect((err) => {
      if (err) {
        console.error('Error al conectar con Odoo:', err.message);
        return reject(err);
      }

      console.log('Conexión exitosa a Odoo.');

      const params = {
        domain: filters, 
        fields: fields.length ? fields : [
          "id",
          "name",
          "subject",
          "description",
          "customer_id",
          "priority",
          "email",
          "phone",
          "tags_ids",
          "product_ids",
          "ticket_type_id",
          "create_date",
          "start_date",
          "end_date",
          "stage_id"
        ], 
        limit,
        offset, 
        order: 'create_date desc', 
      };

      odoo.search_read('ticket.helpdesk', params, (error, tickets) => {
        if (error) {
          console.error('Error al obtener tickets:', error.message);
          return reject(error);
        }

        console.log('Lista de tickets:', tickets);
        resolve(tickets);
      });
    });
  });
};

const getLastTicket = async () => {
  return new Promise((resolve, reject) => {
    odoo.connect((err) => {
      if (err) {
        console.error('Error al conectar con Odoo:', err.message);
        return reject(err);
      }

      const params = {
        domain: [],
        fields: ['id'], 
        limit: 1,
        order: 'id desc', 
      };

      odoo.search_read('ticket.helpdesk', params, (error, result) => {
        if (error) {
          console.error('Error al obtener el último ticket:', error.message);
          return reject(error);
        }
        resolve(result && result.length > 0 ? result[0] : null);
      });
    });
  });
};

const createTicket = async (ticketData) => {
  return new Promise((resolve, reject) => {
    odoo.connect((err) => {
      if (err) {
        console.error('Error al conectar con Odoo:', err.message);
        return reject(err);
      }

      odoo.create('ticket.helpdesk', ticketData, (error, result) => {
        if (error) {
          console.error('Error al crear ticket:', error.message);
          return reject(error);
        }
        resolve(result);
      });
    });
  });
};

const deleteTicket = async (ticketId) => {
  console.log("Llegó a eliminar")
  return new Promise((resolve, reject) => {
    odoo.connect((err) => {
      if (err) {
        console.error('Error al conectar con Odoo:', err.message);
        return reject(err);
      }

      odoo.delete('ticket.helpdesk', ticketId, (error, result) => {
        if (error) {
          console.error(`Error al eliminar el ticket con ID ${ticketId}:`, error.message);
          return reject(error);
        }
        console.log(`Ticket con ID ${ticketId} eliminado correctamente.`);
        resolve(result);
      });
    });
  });
};

const updateTicket = async (ticketId, ticketData) => {
  console.log("Llegó al servicio");
  console.log("data", ticketData);

  return new Promise((resolve, reject) => {
    odoo.connect((err) => {
      if (err) {
        console.error("Error al conectar con Odoo:", err.message);
        return reject(err);
      } else {
        console.log("Conectado");
      }

      // Formateo simplificado para un solo ID
      const formattedData = {
        ...ticketData,
        tags_ids: ticketData.tags_ids
          ? [[4, ticketData.tags_ids]] // Convierte un ID único al formato [[4, id]]
          : [], // Si no hay ID, envía un array vacío
        product_ids: ticketData.product_ids
          ? [[4, ticketData.product_ids]] // Convierte un ID único al formato [[4, id]]
          : [], // Si no hay ID, envía un array vacío
      };

      console.log("Datos formateados: ", formattedData);

      odoo.update("ticket.helpdesk", ticketId, formattedData, (error, result) => {
        if (error) {
          console.error("Error al actualizar el ticket:", error.message);
          return reject(error);
        }
        console.log("Ticket actualizado correctamente:", result);
        resolve(result);
      });
    });
  });
};

const getTicketById = async (ticketId) => {
  return new Promise((resolve, reject) => {
    odoo.connect((err) => {
      if (err) {
        console.error("Error al conectar con Odoo:", err.message);
        return reject(err);
      }

      const params = {
        ids: [ticketId], 
        fields: [
          "id",
          "name",
          "subject",
          "description",
          "customer_id",
          "priority",
          "email",
          "phone",
          "tags_ids",
          "product_ids",
          "ticket_type_id",
          "create_date",
          "start_date",
          "end_date",
          "stage_id"
        ],
      };

      odoo.get("ticket.helpdesk", params, (error, result) => {
        if (error) {
          console.error("Error al obtener el ticket:", error.message);
          return reject(error);
        }
        resolve(result[0]);
      });
    });
  });
};

export default {
  getTickets,
  getLastTicket,
  createTicket,
  deleteTicket, 
  updateTicket,
  getTicketById
};