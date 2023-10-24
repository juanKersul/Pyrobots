import {alertSwal} from '../api';

function verifyEmail(email){
  return (/^\w+([-|.]?\w+)*@(?:|hotmail|outlook|yahoo|live|gmail|mi.unc)\.(?:|com|es|edu.ar)+$/.test(email));
}

function verifyPassword(password){
  const passwordHaveSpecialCharacters = /\W/.test(password);
  const passwordHaveSpace = /\s/.test(password);
  const passwordHaveUpperCaseAndLowerCase = /^(?=.*[A-Z])(?=.*[a-z])/.test(password);
  const passwordHaveNumber = /[1-9]/.test(password);
  
  return password.length >= 8 && 
        passwordHaveSpecialCharacters && 
        passwordHaveUpperCaseAndLowerCase &&
        !passwordHaveSpace &&
        passwordHaveNumber;
}

function verifyName(name){
  const nameIsEmpty = name === "";
  const nameHaveSpace = /\s/.test(name);

  return !nameIsEmpty & !nameHaveSpace;
}

export function verifyDataUser(dataUser){
  if (!verifyName(dataUser.username)){
    alertSwal('El nombre no puede estar vacío ni contener espacios', 'warning');
    return false;
  } else if(!verifyPassword(dataUser.password)){
    alertSwal('La contraseña es inválida', 'warning');
    return false;
  } else if(!verifyEmail(dataUser.email)){
    alertSwal('La dirección de correo es inválida', 'warning');
    return false;
  }
  return true;
}