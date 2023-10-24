import exportServiceLogin from '../../componentes/Servicios/serviceLogin';
import {API, endpoints, getToken, alertSwal} from '../api';
import verifyDataRobot from './verifyDataRobot';

const handleResponseUploadRobot = (code) => {
    alertSwal('Error en los datos', 'error'); 
    if(code === 400 || code === 404) exportServiceLogin.serviceLogOut();
};

function handleResponseListRobots(code, response, callback){
    callback(code === 200);
    if(code !== 200) return {state: 'ERROR', data: response.detail};
    
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
    return await API.get(endpoints.listRobots, {params: {token: getToken()}})
        .then(response => handleResponseListRobots(response.status, response.data, callback))
        .catch((error) => handleResponseListRobots(error.response.status, error.response, callback));
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
    await API.get(endpoints.imageRobot, dataImagetRobot(robot_id))
        .then(response => callback(response.data))
        .catch(err => callback(""));
}

export {serviceListRobots, serviceUploadRobot, serviceImageRobot};
