import odoo from './odooClient';

const getStages = async () => {
  return new Promise((resolve, reject) => {
    odoo.connect((err) => {
      if (err) {
        console.error('Error al conectar con Odoo:', err.message);
        return reject(err);
      }

      odoo.search_read(
        'ticket.stage',
        { domain: [], fields: ['id', 'name'] },
        (error, result) => {
          if (error) {
            console.error('Error al obtener las etapas:', error.message);
            return reject(error);
          }
          resolve(result);
        }
      );
    });
  });
};

export default {
  getStages,
};
