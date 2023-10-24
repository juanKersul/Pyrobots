import API from "./api";
import swal from "sweetalert";

const getToken = () => {
    let storage = localStorage.getItem('user');
    if (storage) {
      let user = JSON.parse(localStorage.getItem('user'));
      return "token=" + user.token;
    } else {
      return "token=";
    }
};

const handleresponse = (code, response) => {
    let listRobots = [];
    switch (code) {
        case 200:
            listRobots = response;
            break;
        case 500:
            swal({
                text: response.detail,
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
    return listRobots;
}

const serviceListRobots = async () => {
    let tkn = getToken();
    return await API.get(`/robots?${tkn}`)
    .then(response => handleresponse(response.status, response.data))
    .catch((error) => handleresponse(error.response.status, error.response.data))
    .then(listRobots => listRobots)
};

const exportServiceListarRobots = {
    serviceListRobots
};

export default exportServiceListarRobots;