import exportServiceLogin from '../../componentes/Servicios/serviceLogin';
import {API, endpoints, getToken, alertSwal} from '../api';
import verifyDataRobot from './verifyDataRobot';

const handleResponseUploadRobot = (code) => {
    alertSwal('Error en los datos', 'error'); 
    if(code === 400 || code === 404) exportServiceLogin.serviceLogOut();
};

// Manejador de respuesta para actualizaciones de robots
const handleResponseUpdateRobot = (code) => {
    alertSwal('Error al actualizar el robot', 'error'); 
    if(code === 400 || code === 404) exportServiceLogin.serviceLogOut();
};

function handleResponseListRobots(code, response, callback){
    console.log("handleResponseListRobots - status code:", code);
    console.log("handleResponseListRobots - response:", response);
    
    // Llamar a callback con true solo si el código es 200 y la respuesta es un array
    const isSuccess = code === 200 && Array.isArray(response);
    callback(isSuccess);
    
    if (!isSuccess) {
        console.error("Error obteniendo robots:", response);
        // En caso de error, guardamos un array vacío en localStorage
        localStorage.setItem('robotListUser', JSON.stringify([]));
        
        // Si el código no es de error pero la respuesta no es un array, es un error del backend
        if (code === 200 && !Array.isArray(response)) {
            alertSwal('Error en el servidor. Por favor, intenta más tarde.', 'error');
        }
        
        return {state: 'ERROR', data: typeof response === 'string' ? response : 'Error desconocido'};
    }
    
    console.log("Guardando robots en localStorage:", response);
    localStorage.setItem('robotListUser', JSON.stringify(response));
    return {state: 'OK', data: response};
}

function filesRobot(dataRobot) {
    const files = new FormData();
    if (dataRobot.config) files.append('config', dataRobot.config);
    if (dataRobot.avatar) files.append('avatar', dataRobot.avatar);
    return files;
}

function dataAddRobotPost(dataRobot){
    return {
        params: {
            name: dataRobot.name,
            tkn: getToken()
        },
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        }
    };
}

const serviceUploadRobot = async (dataRobot) => {
    const resultsVerifyDataRobot = verifyDataRobot(dataRobot);
    if (resultsVerifyDataRobot.state === 'OK'){        
        await API.post(endpoints.uploadRobot, filesRobot(dataRobot), dataAddRobotPost(dataRobot))
            .then(respuesta => alertSwal(respuesta.data.msg, 'success'))
            .catch(error => handleResponseUploadRobot(error.response.status));
    }
    else alertSwal(resultsVerifyDataRobot.data, 'error');
};

const serviceUpdateRobot = async (dataRobot, robotId) => {
    console.log("Actualizando robot con ID:", robotId);
    console.log("Datos a enviar (partial):", {
        name: dataRobot.name,
        hasConfig: !!dataRobot.config,
        hasAvatar: !!dataRobot.avatar
    });

    const resultsVerifyDataRobot = verifyDataRobot(dataRobot, true);
    console.log("Resultado de verificación de datos:", resultsVerifyDataRobot);

    if (resultsVerifyDataRobot.state === 'OK') {
        try {
            const currentToken = getToken();
            if (!currentToken) {
                 alertSwal("Error: No se encontró token de autenticación.", 'error');
                 return { success: false, message: "Error: No se encontró token de autenticación." };
            }

            // Create FormData containing ONLY files
            const formData = filesRobot(dataRobot);

            // Log FormData entries for debugging (will only show files now)
            console.log("FormData entries prepared for update (files only):");
            for (let [key, value] of formData.entries()) {
                 console.log(`${key}: ${value instanceof File ? value.name : value}`);
            }

            // Use the base update URL
            const baseUrl = endpoints.updateRobot; // Should be "/robot/update"

            // Define query parameters separately
            const queryParams = {
                name: dataRobot.name,
                tkn: currentToken,
                robot_id: robotId
            };
            console.log("Query parameters being sent:", queryParams);


            const response = await API.put(
                baseUrl, // Use the base URL
                formData, // Data payload now ONLY contains files (or is empty if no files)
                { // Configuration object
                    params: queryParams, // <-- Send name, tkn, robot_id as query parameters
                    headers: {
                        Accept: 'application/json'
                        // Content-Type is set automatically by the browser for FormData
                    }
                }
            );

            console.log("Respuesta del servidor:", response.data);

            // --- DEBUGGING ---
            let alertMessage = 'Robot actualizado con éxito'; // Default message
            if (response.data && typeof response.data.msg === 'string') {
                alertMessage = response.data.msg;
            } else {
                console.warn("DEBUG: response.data.msg is not a string or doesn't exist. Using default message.", "Value:", response.data?.msg, "Type:", typeof response.data?.msg);
                // Optionally try to stringify the whole data if msg is missing
                if (response.data && typeof response.data.msg === 'undefined') {
                    try {
                        alertMessage = JSON.stringify(response.data);
                    } catch (e) { /* Ignore stringify errors */ }
                }
            }
            console.log("DEBUG: Message being passed to alertSwal:", alertMessage);
            // --- END DEBUGGING ---

            alertSwal(alertMessage, 'success'); // Pass the validated/default message
            return { success: true, message: alertMessage }; // Return the same message

        } catch (error) {
            console.error("Error al actualizar robot:", error);

            // Improved error logging
            let errorMsg = 'Error desconocido al actualizar el robot'; // Default message
            if (error.response) {
                 console.error("Detalles del error de respuesta:", {
                     status: error.response.status,
                     data: error.response.data, // Log the full data object
                     headers: error.response.headers
                 });

                 // --- DEBUGGING 422 ---
                 if (error.response.status === 422) {
                     console.error("--- Specific 422 Error Data ---", JSON.stringify(error.response.data));
                 }
                 // --- END DEBUGGING ---

                 // Try to extract a string message
                 if (typeof error.response.data?.detail === 'string') {
                     errorMsg = error.response.data.detail;
                 } else if (typeof error.response.data?.message === 'string') {
                     errorMsg = error.response.data.message;
                 } else if (typeof error.response.data?.msg === 'string') {
                    errorMsg = error.response.data.msg;
                 // If detail is an array (common for FastAPI validation errors), try to format it
                 } else if (Array.isArray(error.response.data?.detail)) {
                     try {
                         errorMsg = error.response.data.detail.map(err => `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`).join('; ');
                     } catch (e) {
                         errorMsg = `Error de validación ${error.response.status}`;
                     }
                 } else {
                     // Fallback if no standard message format found
                     errorMsg = `Error ${error.response.status}`;
                 }

                // Handle specific status codes like 440 (Token) or 401/403 (Auth)
                 if (error.response?.status === 440) {
                     errorMsg = "Sesión inválida o expirada. Por favor, inicie sesión de nuevo.";
                     exportServiceLogin.serviceLogOut();
                 } else if (error.response?.status === 401 || error.response?.status === 403) {
                     errorMsg = "No tienes permiso o tu sesión es inválida.";
                     exportServiceLogin.serviceLogOut();
                 }
            } else if (error.request) {
                console.error("No se recibió respuesta del servidor:", error.request);
                errorMsg = "Error de conexión con el servidor";
            } else {
                console.error("Error al configurar la solicitud:", error.message);
                errorMsg = "Error en la solicitud: " + error.message;
            }

            console.log("DEBUG: Message being passed to alertSwal (Error):", errorMsg); // Log the final error msg
            alertSwal(errorMsg, 'error'); // Pass guaranteed string
            return { success: false, message: errorMsg };
        }
    } else {
        console.error("Error de validación:", resultsVerifyDataRobot.data);
        // Ensure this is also a string
        let validationErrorMsg = resultsVerifyDataRobot.data;
        if (typeof validationErrorMsg !== 'string'){
             try { validationErrorMsg = JSON.stringify(validationErrorMsg); } catch(e){ validationErrorMsg = "Error de validación desconocido."; }
        }
        alertSwal(validationErrorMsg, 'error');
        return { success: false, message: validationErrorMsg };
    }
};

async function serviceListRobots(callback){
    console.log("serviceListRobots - Solicitando robots con token:", getToken());
    
    // Si no hay token, no hacer la solicitud
    if (!getToken()) {
        console.error("No hay token disponible para solicitar robots");
        callback(false);
        localStorage.setItem('robotListUser', JSON.stringify([]));
        return {state: 'ERROR', data: "No hay sesión activa"};
    }
    
    try {
        const response = await API.get(endpoints.listRobots, {params: {token: getToken()}});
        console.log("serviceListRobots - Respuesta del servidor:", response);
        return handleResponseListRobots(response.status, response.data, callback);
    } catch (error) {
        console.error("serviceListRobots - Error:", error);
        
        // Obtener los detalles del error para pasarlos a la función de manejo
        let errorStatus = 500;
        let errorData = "Error de conexión";
        
        if (error.response) {
            errorStatus = error.response.status;
            errorData = error.response.data;
        }
        
        return handleResponseListRobots(errorStatus, errorData, callback);
    }
};

function dataImagetRobot(robot_id){
    return {
        params: {
            token: getToken(),
            robot_id: robot_id
        }
    }
}

async function serviceImageRobot(callback, robot_id){
    console.log("serviceImageRobot - Solicitando imagen para robot:", robot_id);
    await API.get(endpoints.imageRobot, dataImagetRobot(robot_id))
        .then(response => {
            console.log("serviceImageRobot - Imagen recibida para robot:", robot_id);
            callback(response.data);
        })
        .catch(err => {
            console.error("serviceImageRobot - Error obteniendo imagen:", err);
            callback("");
        });
}

export {serviceListRobots, serviceUploadRobot, serviceImageRobot, serviceUpdateRobot};
