import axios from "axios";

const baseURL = "http://127.0.0.1:8000";

async function listRobots(){
    const tkn = JSON.parse(localStorage.getItem("user")).token;
    
    return await axios.get(baseURL + "/robots", {params: { token: tkn}})
    .then((response) => response.data)
    .catch((_) => []);
}

export {listRobots};