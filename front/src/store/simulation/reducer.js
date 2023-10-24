import {runSimulation} from './service';
import {modifyIdRobots, removeIdRobot, modifyRounds} from './auxDataSimulation';

const defaultDataSimulation = {
    id_robot: "",
    n_rounds_simulations: 0,
    user_creator: "",
    token: ""
};

function reducer(dataSimulation = defaultDataSimulation, action){
    if (action.type === 'MODIFY_DATA_ROUNDS') return modifyRounds({dataSimulation: dataSimulation, value: action.data});
    else if (action.type === 'ADD_ROBOTS') return modifyIdRobots({dataSimulation: dataSimulation, value: action.data});
    else if (action.type === 'REMOVE_ROBOTS') return removeIdRobot({dataSimulation: dataSimulation, value: action.data});
    else if(action.type === 'SEND_DATA_SIMULATION') runSimulation(dataSimulation, action.data);

    return dataSimulation;
}

export default reducer;