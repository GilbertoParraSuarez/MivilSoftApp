import  Odoo from 'react-native-odoo'

const odoo = new Odoo({
    host:'192.168.1.5',
    port:8069,
    database:'odoo',
    username:'',
    password:''
});

export default odoo;