import axios from 'axios';

const OdooService = {
  url: 'http://localhost:8069', // Cambia esto por la URL de tu servidor Odoo
  db: 'bd_prueba', // Cambia por tu base de datos
  username: 'admin',
  password: 'admin',

  async authenticate() {
    try {
      const response = await axios.post(`${this.url}/web/session/authenticate`, {
        params: {
          db: this.db,
          login: this.username,
          password: this.password,
        },
      });
      return response.data.result;
    } catch (error) {
      console.error('Error al autenticar:', error);
      throw error;
    }
  },

  async callModel(model, method, args = [], kwargs = {}) {
    try {
      const response = await axios.post(`${this.url}/web/dataset/call_kw`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model,
          method,
          args,
          kwargs,
        },
        id: Math.floor(Math.random() * 1000),
      });
      return response.data.result;
    } catch (error) {
      console.error('Error al llamar al modelo:', error);
      throw error;
    }
  },
};

export default OdooService;
