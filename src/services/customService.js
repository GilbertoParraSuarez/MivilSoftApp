import odoo from "./odoo_service";

const getCustoms = async () => {
  return new Promise((resolve, reject) => {
    odoo.connect((err) => {
      if (err) {
        console.error('Error al conectar con Odoo:', err.message);
        return reject(err);
      }

      odoo.search_read('res.partner', { domain: [], fields: ['id', 'name'] }, (error, result) => {
        if (error) {
          console.error('Error al obtener clientes (custom):', error.message);
          return reject(error);
        }
        resolve(result);
      });
    });
  });
};

export default {
  getCustoms,
};
