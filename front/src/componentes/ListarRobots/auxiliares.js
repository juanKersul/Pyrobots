import React from "react";

function robotListUser(){
    return JSON.parse(localStorage.getItem('robotListUser'));
}

function robotModuleHtml(robot, index){
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
    const infoRobot = [robotImage, robot.name, robot.id, robot.matchs_pleyed, robot.matchs_won];
    setListResults(listRobots => [...listRobots, [robotModuleHtml(infoRobot, listRobots.length)]]);
}

function getImageRobotsAndSaveInListImage(robots, getImageRobotsUser, setListResults){
    setListResults([]);
    robots.forEach( robot => {
        const setRobotImage = (robotImage) => addNewImage(setListResults, robotImage, robot);
        getImageRobotsUser(setRobotImage, robot.id);
    });
}

export {robotModuleHtml, getImageRobotsAndSaveInListImage, robotListUser};