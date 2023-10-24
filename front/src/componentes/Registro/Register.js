import {sendDataUser, modifyDataName, modifyDataPassword, modifyDataEmail} from '../../store/register/actions';
import {connect} from 'react-redux';
import './Register.css';

function Register({sendDataUser, modifyDataName, modifyDataPassword, modifyDataEmail}){
  return (
  <div className="login-page">
    <div className="form">
      <form className="register-form">
        <p>REGISTRARSE</p>
        <input type="text" placeholder="Nombre" name= "username"
        onChange= {(e) => modifyDataName(e.target.value)} required/>

        <input type="password" placeholder="Contraseña" name= "password"
        onChange= {(e) => modifyDataPassword(e.target.value)} required/>

        <input type="email" placeholder="Correo electrónico"  name= "email" 
        onChange= {(e) => modifyDataEmail(e.target.value)} required/>

        <input type="button" onClick={() => sendDataUser()} value= 'Registrar' name= 'Register'/>
      </form>
    </div>
  </div>
  );
}

export default connect(null, {sendDataUser, modifyDataName, modifyDataPassword, modifyDataEmail})(Register);