import axios from "axios";

const baseURL = "http://127.0.0.1:8000/match/run";

const defaultDataPartida = {
    id_match: 0,
    name_user: ""
};

// let user = JSON.parse(localStorage.getItem('user'));
// const token = user.token;
async function iniciarPartida(dataPartida){
    return await axios.post(baseURL + `?id_match=${dataPartida.id_match}&token=${dataPartida.token}`)
        .then((response) => { 
            return {state: 'OK', data: response.data} 
        })
        .catch((err) => { 
            return {state: 'ERROR', data: err.detail} });
}

export {iniciarPartida, defaultDataPartida};