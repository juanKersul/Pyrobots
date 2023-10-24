const getDataRobotsUser = (callback) => {
    return {
        type: "GET_DATA_ROBOTS_USER",
        data: callback
    }
};

const getImageRobotsUser = (callback, robot_id) => {
    return {
        type: "GET_IMAGE_ROBOTS_USER",
        callback: callback,
        data: {
            robot_id: robot_id
        }
    }
};

const sendDataRobot = () => {
    return {
        type: "SEND_DATA_ROBOT",
        data: ""
    }
};

const modifyName = (name) => {
    return {
        type: "GET_DATA_NAME_ROBOT",
        data: name
    }
};

const modifyAvatar = (avatar) => {
    return {
        type: "GET_DATA_AVATAR_ROBOT",
        data: avatar
    }
};

const modifyConfig = (config) => {
    return {
        type: "GET_DATA_CONFIG_ROBOT",
        data: config
    }
};

export {sendDataRobot, modifyName, modifyAvatar, modifyConfig, getDataRobotsUser, getImageRobotsUser};