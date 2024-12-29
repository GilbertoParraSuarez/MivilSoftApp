import odoo from "./odoo_service";

const getProducts = async () => {
  return new Promise((resolve, reject) => {
    odoo.connect((err) => {
      if (err) {
        console.error('Error al conectar con Odoo:', err.message);
        return reject(err);
      }

      odoo.search_read('product.template', { domain: [], fields: ['id', 'name'] }, (error, result) => {
        if (error) {
          console.error('Error al obtener lso productos:', error.message);
          return reject(error);
        }
        resolve(result);
      });
    });
  });
};

export default {
  getProducts,
};
