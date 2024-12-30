import odoo from './odooClient';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const getProducts = async (odooInstance) => {
  return new Promise((resolve, reject) => {
    odooInstance.connect((err) => {
      if (err) {
        console.error('Error al conectar con Odoo:', err.message);
        return reject(err);
      }

      odooInstance.search_read(
        'product.template',
        { domain: [], fields: ['id', 'name'] },
        (error, result) => {
          if (error) {
            console.error('Error al obtener los productos:', error.message);
            return reject(error);
          }
          resolve(result);
        }
      );
    });
  });
};

export default {
  getProducts,
};
