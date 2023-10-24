import API from './api';
import exportServiceLogin from '../Servicios/serviceLogin';
import swal from "sweetalert";

// guardamos el nombre del robot pues esta sera unico en el back
// y el back tendra almacenado el avatar y el archivo del mismo
const addRobotinStorage = (nameRobot) => {
    let storage = localStorage.getItem('robots');
    if (storage) {
      let storageContent = JSON.parse(localStorage.getItem('robots'));
      storageContent.push(nameRobot);
      localStorage.setItem("robots", JSON.stringify(storageContent));
    } else {
      localStorage.setItem("robots", JSON.stringify([nameRobot]));
    }
};

const handleResponse = (code, respuesta, nameRobot) => {
    switch (code) {
        case 200:
            addRobotinStorage(nameRobot);
            swal({
                text: respuesta.msg,
                icon: 'success',
                timer: '1800'
            });
            break;
        case 409:
            swal({
                text: respuesta.detail,
                icon: 'error',
                timer: '2500'
            });
            break;
        case 400:
            swal({
                text: respuesta.detail,
                icon: 'error',
                timer: '2500'
            });
            exportServiceLogin.serviceLogOut();
            break;
        case 404:
            swal({
                text: respuesta.detail,
                icon: 'error',
                timer: '2500'
            });
            exportServiceLogin.serviceLogOut();
            break;
        case 422:
            swal({
                text: respuesta.detail,
                icon: 'error',
                timer: '2500'
            });
            break;    
        default:
            swal({
                text: 'Error.',
                icon: 'error',
                timer: '1800'
            });
            break;
    }
};

const filesRobot = (filePy, fileImg) => {
    let files = new FormData();
    files.append('config', filePy);
    files.append('avatar', fileImg);
    return files;
};

const paramsData = (name) => {
    let user = JSON.parse(localStorage.getItem('user'));
    if(user && user.token) {
        return {
            params: {
                name: name,
                tkn: user.token
            }
        }
    } else {
        return {
            params: {
                name: name,
                tkn: ""
            }
        }
    }
};

const headers = () => {
    return {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        }
    }
};

const serviceUploadRobot = async (filePy, fileImg, name) => {
    return await API.post('http://localhost:8000/upload/robot', filesRobot(filePy, fileImg), paramsData(name) ,headers())
    .then(respuesta => handleResponse(respuesta.status, respuesta.data, name))
    .catch((error) => handleResponse(error.response.status, error.response.data, name))
};

const exportServiceRobot = {
    serviceUploadRobot
};

export default exportServiceRobot;