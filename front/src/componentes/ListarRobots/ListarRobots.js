import {getImageRobotsAndSaveInListImage, robotListUser} from './auxiliares.js';
import {getDataRobotsUser, getImageRobotsUser} from '../../store/robots/actions';
import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import './ListarRobots.css';

function Listing({robots, getImageRobotsUser}) {
    const [listResults, setListResults] = useState([]);

    useEffect(() => {
        getImageRobotsAndSaveInListImage(robots, getImageRobotsUser, setListResults);
    }, [robots, getImageRobotsUser])

    return (<div id="robot-list"> {listResults} </div>);
};

function ListarRobots({getDataRobotsUser, getImageRobotsUser}){
    const [responseDataRobot, useResponseDataRobot] = useState(false);
    const [listRobots, setListRobots] = useState([]);
    
    useEffect(() => {
        if(responseDataRobot) setListRobots(robotListUser());
        else getDataRobotsUser(useResponseDataRobot);
    }, [responseDataRobot, getDataRobotsUser]);

    return (<Listing robots={listRobots} getImageRobotsUser={getImageRobotsUser}/>);
};

export default connect(null, {getDataRobotsUser, getImageRobotsUser})(ListarRobots);