import {serviceListRobots, serviceUploadRobot, serviceImageRobot} from './serviceRobots';

const defaultDataRobot = {
    name: "",
    config: "",
    avatar: ""
};

function reducer(dataRobot = defaultDataRobot, action){    
    const  dataRobotChange = ({attribute, value}) => {
        return { ...dataRobot, [attribute]: value }; 
    };

    if (action.type === 'GET_DATA_ROBOTS_USER') 
        serviceListRobots(action.data);
    else if (action.type === 'GET_DATA_NAME_ROBOT') 
        return dataRobotChange({attribute:'name', value: action.data});
    else if (action.type === 'GET_DATA_CONFIG_ROBOT') 
        return dataRobotChange({attribute:'config', value: action.data});
    else if (action.type === 'GET_DATA_AVATAR_ROBOT') 
        return dataRobotChange({attribute:'avatar', value: action.data});
    else if(action.type === 'SEND_DATA_ROBOT') 
        serviceUploadRobot(dataRobot);
    else if(action.type === 'GET_IMAGE_ROBOTS_USER')
        serviceImageRobot(action.callback, action.data.robot_id);

    return dataRobot;
}

export default reducer;