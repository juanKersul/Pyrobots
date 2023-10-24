function isPythonFile(file){
    let file_name = file.name;
    return (".py" === file_name.slice(file_name.lastIndexOf(".")));
};

function nameFileEqualNameRobot(file, name){
    return(name === file.name.slice(0,-3));
};

async function nameRobotInFile(file, name){
    const fileText = await file.text();
    const isNameRobotInFile = fileText.includes("class " + name);
    return isNameRobotInFile;
};

function verifyDataRobot(dataRobot){
    if (dataRobot.name === "")
        return {state: 'ERROR', data: "Campo del Nombre del Robot Vacio, escriba algo"};
    else if (dataRobot.config === "")
        return {state: 'ERROR', data: "Archivo vacio, no es aceptable"};
    else if (!isPythonFile(dataRobot.config))
        return {state: 'ERROR', data: "No es un archivo python, no es aceptable"};
    else if (!nameFileEqualNameRobot(dataRobot.config, dataRobot.name))
        return {state: 'ERROR', data: "El nombre del archivo debe ser igual al nombre del robot, no es aceptable"};
    else if (!nameRobotInFile(dataRobot.config, dataRobot.name))
        return {state: 'ERROR', data: "El nombre de la clase debe ser igual al nombre del robot, no es aceptable"};
    return {state: 'OK', data: ''};
}

export default verifyDataRobot;