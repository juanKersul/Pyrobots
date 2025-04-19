import exportServiceLogin from '../../componentes/Servicios/serviceLogin';
import {API, endpoints, getToken, alertSwal} from '../api';
import verifyDataRobot from './verifyDataRobot';

const handleResponseUploadRobot = (code) => {
    alertSwal('Error en los datos', 'error'); 
    if(code === 400 || code === 404) exportServiceLogin.serviceLogOut();
};

function handleResponseListRobots(code, response, callback){
    console.log("handleResponseListRobots - status code:", code);
    console.log("handleResponseListRobots - response:", response);
    
    // Llamar a callback con true solo si el código es 200 y la respuesta es un array
    const isSuccess = code === 200 && Array.isArray(response);
    callback(isSuccess);
    
    if (!isSuccess) {
        console.error("Error obteniendo robots:", response);
        // En caso de error, guardamos un array vacío en localStorage
        localStorage.setItem('robotListUser', JSON.stringify([]));
        
        // Si el código no es de error pero la respuesta no es un array, es un error del backend
        if (code === 200 && !Array.isArray(response)) {
            alertSwal('Error en el servidor. Por favor, intenta más tarde.', 'error');
        }
        
        return {state: 'ERROR', data: typeof response === 'string' ? response : 'Error desconocido'};
    }
    
    console.log("Guardando robots en localStorage:", response);
    localStorage.setItem('robotListUser', JSON.stringify(response));
    return {state: 'OK', data: response};
}

function filesRobot(dataRobot){
    const files = new FormData();
    files.append('config', dataRobot.config);
    files.append('avatar', dataRobot.avatar);
    
    return files;
}

function dataAddRobotPost(dataRobot){
    return {
        params: {
            name: dataRobot.name,
            tkn: getToken()
        },
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        }
    };
}

const serviceUploadRobot = async (dataRobot) => {
    const resultsVerifyDataRobot = verifyDataRobot(dataRobot);
    if (resultsVerifyDataRobot.state === 'OK'){        
        await API.post(endpoints.uploadRobot, filesRobot(dataRobot), dataAddRobotPost(dataRobot))
            .then(respuesta => alertSwal(respuesta.data.msg, 'success'))
            .catch(error => handleResponseUploadRobot(error.response.status));
    }
    else alertSwal(resultsVerifyDataRobot.data, 'error');
};

async function serviceListRobots(callback){
    console.log("serviceListRobots - Solicitando robots con token:", getToken());
    
    // Si no hay token, no hacer la solicitud
    if (!getToken()) {
        console.error("No hay token disponible para solicitar robots");
        callback(false);
        localStorage.setItem('robotListUser', JSON.stringify([]));
        return {state: 'ERROR', data: "No hay sesión activa"};
    }
    
    try {
        const response = await API.get(endpoints.listRobots, {params: {token: getToken()}});
        console.log("serviceListRobots - Respuesta del servidor:", response);
        return handleResponseListRobots(response.status, response.data, callback);
    } catch (error) {
        console.error("serviceListRobots - Error:", error);
        
        // Obtener los detalles del error para pasarlos a la función de manejo
        let errorStatus = 500;
        let errorData = "Error de conexión";
        
        if (error.response) {
            errorStatus = error.response.status;
            errorData = error.response.data;
        }
        
        return handleResponseListRobots(errorStatus, errorData, callback);
    }
};

function dataImagetRobot(robot_id){
    return {
        params: {
            token: getToken(),
            robot_id: robot_id
        }
    }
}

async function serviceImageRobot(callback, robot_id){
    console.log("serviceImageRobot - Solicitando imagen para robot:", robot_id);
    await API.get(endpoints.imageRobot, dataImagetRobot(robot_id))
        .then(response => {
            console.log("serviceImageRobot - Imagen recibida para robot:", robot_id);
            callback(response.data);
        })
        .catch(err => {
            console.error("serviceImageRobot - Error obteniendo imagen:", err);
            callback("");
        });
}

export {serviceListRobots, serviceUploadRobot, serviceImageRobot};
