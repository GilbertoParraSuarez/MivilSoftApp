import { useContext } from 'react';
import odoo from './odooClient';
import { AuthContext } from '../context/AuthContext';

const useOdooConfiguration = () => {
  const { authState } = useContext(AuthContext);

  odoo.username = authState.username;
  odoo.password = authState.password;

  return odoo;
};

export default useOdooConfiguration;
