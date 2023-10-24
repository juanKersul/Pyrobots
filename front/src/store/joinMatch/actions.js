
//AGREGADO: callback es una función useState, puedes usarla para mandar el useState de una variable booleana
//y con esta sabrás si el dato a sido agregado con éxito o no. Uso la misma lógica en crear simulación.

const sendDataUserJoin = (callback) => {
    return {
        type: "SEND_DATA_JOIN",
        data: callback
    }
};

const modifyDataUserJoin = (userLogin) => {
    return {
        type: "MODIFY_DATA_USER_JOIN",
        data: userLogin
    }
};

const modifyDataMatchJoin = (matchID) => {
    return {
        type: "MODIFY_DATA_MATCH_JOIN",
        data: matchID
    }
};

const modifyDataRobotJoin = (robotID) => {
    return {
        type: "MODIFY_DATA_ROBOT_JOIN",
        data: robotID
    }
};

export {
    sendDataUserJoin,
    modifyDataUserJoin,
    modifyDataMatchJoin,
    modifyDataRobotJoin
};