import {API, endpoints, alertSwal} from '../api';
import { verifyDataUser } from './dataUser';

async function loadDataUser(dataRegisterUser){
  if(verifyDataUser(dataRegisterUser)) 
    return await API.post(endpoints.register, dataRegisterUser)
      .then( (_) =>  alertSwal('Se envió el mail de confirmación', 'success'))
      .catch( (_) => alertSwal('Error en los datos', 'error'));
}

export default loadDataUser;