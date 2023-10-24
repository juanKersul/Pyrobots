import verifyDataSimulation from './verifyData';
import {API, endpoints, getToken, getUserLogin} from '../api';

function handleResponseRunSimulation(response, callback){
    callback(response.status === 200);
    if(response.status === 200){
        localStorage.setItem("simulacion", JSON.stringify(response.data));
        return {state: 'OK', data: ''};
    } else {
        return {state: 'ERROR', data: response};
    }
};

async function runSimulation(dataSimulation, callback){ 
    if(verifyDataSimulation(dataSimulation)){
        dataSimulation.id_robot = dataSimulation.id_robot.substring(1);
        dataSimulation.user_creator = getUserLogin();
        dataSimulation.token = getToken();
        
        return await API.post(endpoints.runSimulation, dataSimulation)
        .then((response) => handleResponseRunSimulation(response, callback))
        .catch((err) => handleResponseRunSimulation(err, callback));
    }
    callback(false);
    return {state: 'ERROR', data: ''};
}

export {runSimulation};