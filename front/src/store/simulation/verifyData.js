import swal from "sweetalert";

function verifyId_robots(dataSimulation){
    const totalRobots = dataSimulation.id_robot.split(',').length - 1;
    const cantRoundsGreaterT2AndLess4 = totalRobots >= 2 && totalRobots <= 4;
    
    return cantRoundsGreaterT2AndLess4;
}

function verifyRounds(dataSimulation){
    const cantRoundsGreaterThan1AndLessThan10000 = dataSimulation.n_rounds_simulations > 1 && 
                                                    dataSimulation.n_rounds_simulations <= 10000;
    return cantRoundsGreaterThan1AndLessThan10000;
}

function verifyDataSimulation(dataSimulation){
    if(!verifyId_robots(dataSimulation)){
        swal({
            text: 'Los robots elegidos deben ser más que 2 o menos que 4.',
            icon: 'warning',
            timer: '2500'
        });
        return false;
    }
    if(!verifyRounds(dataSimulation)){
        swal({
            text: 'Cantidad de rondas debe estar entre 1 a 10000.',
            icon: 'warning',
            timer: '2500'
        });
        return false;
    }
    return true
}

export default verifyDataSimulation;
