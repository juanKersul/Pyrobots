function modifyIdRobots({dataSimulation, value}){
    const expReg = new RegExp(value);
    if (!(expReg.test(dataSimulation.id_robot)))
        return { 
            ...dataSimulation, 
            id_robot:  dataSimulation.id_robot.concat(value)
        }; 
    else return dataSimulation;
}

function removeIdRobot({dataSimulation, value}){
    return {
        ...dataSimulation, 
        id_robot: dataSimulation.id_robot.replace(value, '')
    }
}

function modifyRounds({dataSimulation, value}){
    return { 
        ...dataSimulation, 
        n_rounds_simulations: value
    }; 
}

export {modifyIdRobots, removeIdRobot, modifyRounds};