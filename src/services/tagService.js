import odoo from './odooClient';

const getTags = async () => {
  return new Promise((resolve, reject) => {
    // Conectar con Odoo utilizando el cliente global
    odoo.connect((err) => {
      if (err) {
        console.error('Error al conectar con Odoo:', err.message);
        return reject(err);
      }

      // Buscar las etiquetas (tags) en el modelo 'helpdesk.tag'
      odoo.search_read(
        'helpdesk.tag',
        { domain: [], fields: ['id', 'name'] },
        (error, result) => {
          if (error) {
            console.error('Error al obtener etiquetas (tags):', error.message);
            return reject(error);
          }
          resolve(result); // Resolver la promesa con los resultados
        }
      );
    });
  });
};

export default {
  getTags,
};
