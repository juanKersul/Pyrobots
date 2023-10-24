const sendDataSimulation = (callback) => {
    return {
        type: "SEND_DATA_SIMULATION",
        data: callback
    }
};

const modifyDataRound = (nRounds) => {
    return {
        type: "MODIFY_DATA_ROUNDS",
        data: parseInt(nRounds)
    }
};

const addRobot = (id_Robot) => {
    return {
        type: "ADD_ROBOTS",
        data: `,${id_Robot}`
    }
};

const removeRobot = (id_Robot) => {
    return {
        type: "REMOVE_ROBOTS",
        data: `,${id_Robot}`
    }
};

export {sendDataSimulation, modifyDataRound, addRobot, removeRobot};