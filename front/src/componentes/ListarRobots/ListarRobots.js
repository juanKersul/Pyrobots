import {getImageRobotsAndSaveInListImage, robotListUser} from './auxiliares.js';
import {getDataRobotsUser, getImageRobotsUser} from '../../store/robots/actions';
import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import './ListarRobots.css';

function Listing({robots, getImageRobotsUser}) {
    const [listResults, setListResults] = useState([]);

    useEffect(() => {
        console.log("Listing component - robots recibidos:", robots);
        getImageRobotsAndSaveInListImage(robots, getImageRobotsUser, setListResults);
    }, [robots, getImageRobotsUser])

    return (<div id="robot-list"> {listResults.length === 0 ? <p>No se encontraron robots</p> : listResults} </div>);
};

function ListarRobots({getDataRobotsUser, getImageRobotsUser}){
    const [responseDataRobot, useResponseDataRobot] = useState(false);
    const [listRobots, setListRobots] = useState([]);
    
    useEffect(() => {
        console.log("ListarRobots - responseDataRobot:", responseDataRobot);
        if(responseDataRobot) {
            const robots = robotListUser();
            console.log("Robots obtenidos de localStorage:", robots);
            setListRobots(robots || []);
        }
        else {
            console.log("Intentando obtener robots del servidor...");
            getDataRobotsUser(useResponseDataRobot);
        }
    }, [responseDataRobot, getDataRobotsUser]);

    return (<Listing robots={listRobots} getImageRobotsUser={getImageRobotsUser}/>);
};

export default connect(null, {getDataRobotsUser, getImageRobotsUser})(ListarRobots);