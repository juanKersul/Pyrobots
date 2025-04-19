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

function getImageRobotsAndSaveInListImage(robots, getImageRobotsUser, setListResults){
    console.log("getImageRobotsAndSaveInListImage - Robots recibidos:", robots);
    setListResults([]);
    
    if (!robots || !Array.isArray(robots) || robots.length === 0) {
        console.warn("getImageRobotsAndSaveInListImage - No hay robots para mostrar");
        return;
    }
    
    robots.forEach(robot => {
        console.log("Procesando robot:", robot);
        const setRobotImage = (robotImage) => addNewImage(setListResults, robotImage, robot);
        getImageRobotsUser(setRobotImage, robot.id);
    });
}

export {robotModuleHtml, getImageRobotsAndSaveInListImage, robotListUser};