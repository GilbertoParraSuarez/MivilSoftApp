import  Odoo from 'react-native-odoo'

const odoo = new Odoo({
    host:'192.168.1.4',
    port:8069,
    database:'odoo',
    username:'admin',
    password:'admin'
});

export default odoo;