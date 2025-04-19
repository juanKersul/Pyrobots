import React from "react";

function robotListUser(){
    const robots = JSON.parse(localStorage.getItem('robotListUser'));
    console.log("robotListUser - Robots obtenidos de localStorage:", robots);
    
    // Si no hay robots o el valor no es un array, devolver array vacío
    if (!robots || !Array.isArray(robots)) {
        console.warn("robotListUser - No hay robots en localStorage o el formato es incorrecto");
        return [];
    }
    
    return robots;
}

// Función para determinar el tipo de robot basado en su nombre
function getRobotType(robot) {
    const name = robot.name.toLowerCase();
    if (name.includes('attack') || name.includes('destruct')) return 'Ataque';
    if (name.includes('shield') || name.includes('defend')) return 'Defensa';
    if (name.includes('speed') || name.includes('velocity')) return 'Velocidad';
    return 'Equilibrado';
}

// Función para obtener color según el tipo de robot
function getTypeColor(type) {
    switch(type) {
        case 'Ataque': return '#ff5f45';
        case 'Defensa': return '#2196f3';
        case 'Velocidad': return '#4caf50';
        case 'Equilibrado': return '#9c27b0';
        default: return '#607d8b';
    }
}

// Función para generar estadísticas complementarias
function generateBattleStats(robot) {
    const matches = robot.matchs_pleyed || 0;
    const wins = robot.matchs_won || 0;
    const losses = matches - wins;
    const ratio = matches > 0 ? Math.round((wins / matches) * 100) : 0;
    
    return { wins, losses, ratio };
}

function robotModuleHtml(robot, index){
    console.log("robotModuleHtml - Datos del robot:", robot);
    return (
        <div className='block-robot' key={index} data-testid="robot-name">
            <img src={`data:image/png;base64,${robot[0]}`} alt="" />
            <p className="RobotName"> Nombre: {robot[1]} </p>
            <p className="RobotId"> ID: {robot[2]} </p>
            <p> Partidas Jugadas: {robot[3]} </p>
            <p> Partidas Ganadas: {robot[4]} </p>
        </div>
    ); 
}

function addNewImage(setListResults, robotImage, robot){
    console.log("addNewImage - Procesando robot:", robot.name, "con ID:", robot.id);
    const infoRobot = [robotImage, robot.name, robot.id, robot.matchs_pleyed, robot.matchs_won];
    setListResults(listRobots => [...listRobots, [robotModuleHtml(infoRobot, listRobots.length)]]);
}

function getImageRobotsAndSaveInListImage(robots, getImageRobotsUser, setRobots) {
    console.log("getImageRobotsAndSaveInListImage - Robots recibidos:", robots);
    
    if (!robots || !Array.isArray(robots) || robots.length === 0) {
        console.warn("getImageRobotsAndSaveInListImage - No hay robots para mostrar");
        return;
    }
    
    // Crea un array temporal para almacenar los robots con imágenes
    let robotsWithImages = [...robots];
    let completedCount = 0;
    
    robots.forEach((robot, index) => {
        console.log("Procesando robot:", robot);
        getImageRobotsUser((image) => {
            // Actualiza el robot con su imagen
            robotsWithImages[index] = {
                ...robot,
                image,
                type: getRobotType(robot),
                color: getTypeColor(getRobotType(robot)),
                ...generateBattleStats(robot)
            };
            
            completedCount++;
            
            // Cuando todos los robots tengan su imagen, actualiza el estado
            if (completedCount === robots.length) {
                setRobots(robotsWithImages);
            }
        }, robot.id);
    });
}

export {
    robotListUser,
    getImageRobotsAndSaveInListImage,
    getRobotType,
    getTypeColor,
    generateBattleStats
};