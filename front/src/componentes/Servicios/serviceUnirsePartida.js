import API from "./api";

// const getToken = () => {
//     let storage = localStorage.getItem('user');
//     if (storage) {
//       let user = JSON.parse(localStorage.getItem('user'));
//       return "token=" + user.token;
//     } else {
//       return "token=";
//     }
// };

const handleresponse = (code, response) => {
    let urlSocketMatch = undefined;
    switch (code) {
        case 200:
            urlSocketMatch = response;
            break;
        default:
            alert("Error No Contemplado, " + response)
            break;
    }
    return urlSocketMatch;
}

const paramsData = (robotID) => {
    let user = JSON.parse(localStorage.getItem('user'));
    //falta distingir entre si va o no con contraseña de private
    if(user && user.token) {
        return {
            params: {
                tkn: user.token,
                username: user.userlogin,
                robotID: robotID
            }
        }
    } else {
        return {
            params: {
                tkn: "",
                username: "",
                robotID:""
            }
        }
    }
};

const serviceUnirsePartida = async (robotID) => {
    // let tkn = getToken();
    return await API.post(`match/join`, paramsData(robotID))
    .then(response => handleresponse(response.status, response.data))
    .catch((error) => handleresponse(error.response.status, error.response.data))
    .then(urlSocketMatch => urlSocketMatch)
};

const exportServiceUnirsePartida = {
    serviceUnirsePartida
};

export default exportServiceUnirsePartida;