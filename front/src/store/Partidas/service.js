import axios from "axios";


import swal from "sweetalert";

const baseURL = "http://127.0.0.1:8000";

function getToken(){
    const storage = localStorage.getItem('user');
    if(storage) return JSON.parse(storage).token;
    else return "";
}

function getNameUser(){
    const storage = localStorage.getItem('user');
    if(storage) return JSON.parse(storage).userlogin;
    else return "";
}

async function servicioListarGames(callback) {
    console.log("Solicitando lista de partidas...");
    try {
        const token = JSON.parse(localStorage.getItem("user")).token;
        // Eliminar log innecesario del token en producción
        // console.log("Token utilizado:", token);
        
        await axios.get(baseURL + "/matchs?token=" + token)
        .then((response) => {
            console.log("Respuesta de listar partidas:", response.data);
            // El backend ahora siempre devuelve JSON.
            // Si la respuesta es exitosa (status 2xx), debe contener 'data'.
            if (response.data && Array.isArray(response.data.data)) {
                callback(response.data.data); // Pasa la lista de partidas al callback
            } else {
                // Si la respuesta 2xx no tiene el formato esperado (esto no debería pasar con el backend actual)
                console.error("Formato de respuesta inesperado (éxito):");
                callback([]);
                swal({
                    text: 'Respuesta inesperada del servidor',
                    icon: 'warning',
                    timer: '2500'
                });
            }
        })
        .catch((error) => {
            console.error("Error al listar partidas:", error);
            let errorMsg = 'Error de conexión con el servidor'; // Mensaje por defecto
            
            if (error.response) {
                // Error con respuesta del servidor (4xx, 5xx)
                console.log("Detalles del error:", {
                    status: error.response.status,
                    data: error.response.data
                });
                // Usa el 'detail' de la HTTPException del backend
                errorMsg = error.response?.data?.detail || `Error del servidor (${error.response.status})`;
            } else if (error.request) {
                // Error sin respuesta (problema de red, CORS, etc.)
                console.log("Error de solicitud sin respuesta:", error.request);
                errorMsg = 'No se pudo conectar con el servidor. Verifica tu conexión o la configuración de CORS.';
            } else {
                // Otro tipo de error (ej. configuración de Axios)
                console.log("Error general:", error.message);
                errorMsg = `Error: ${error.message}`;
            }
            
            swal({
                text: errorMsg,
                icon: 'error',
                timer: '3000' // Un poco más de tiempo para leer el error
            });

            callback([]); // Limpia la lista en caso de error
        });
    } catch (error) {
        // Error al obtener token o procesar antes de la llamada
        console.error("Error antes de llamar a la API:", error);
        swal({
            text: 'Error interno al preparar la solicitud',
            icon: 'error',
            timer: '2500'
        });
        callback([]);
    }
}

async function servicioPartida(postData, callback) {
  console.log("Enviando datos para crear partida:", postData);
    await axios.post(baseURL + "/match/add", postData)
    .then((response) => {
      console.log("Respuesta exitosa al crear partida:", response.data);
      // Verificar si la respuesta contiene id_match
      if (response.data && response.data.id_match) {
        callback({...postData, id_match: response.data.id_match});
        swal({
          text: 'Partida creada exitosamente',
          icon: 'success',
          timer: '1800'
        });
      } else {
        console.warn("La respuesta no contiene id_match:", response.data);
        // Intentar buscar si hay algún identificador en la respuesta
        const possibleId = response.data.id || response.data.match_id || response.data._id;
        callback({...postData, id_match: possibleId || "unknown"});
        swal({
          text: 'Partida creada, pero hubo un problema al procesar la respuesta',
          icon: 'warning',
          timer: '2500'
        });
      }
    })
      .catch((error) => {
        console.error("Error al crear partida:", error);
        if (error.response) {
          console.log("Detalles del error:", {
            status: error.response.status,
            data: error.response.data
          });
          
          if (error.response.status === 409) {
            swal({
              text: error.response.data.detail || "El nombre de la partida ya existe",
              icon: 'error',
              timer: '2500'
          })}
          else if (error.response.status === 422) {
            const errorMsg = error.response.data.detail && error.response.data.detail[0] ? 
              error.response.data.detail[0].msg : 
              "Error en los datos enviados";
            swal({
              text: errorMsg,
              icon: 'error',
              timer: '2500'
            });
          }
          else {
            swal({
              text: 'Error en el servidor: ' + error.response.status,
              icon: 'error',
              timer: '2500'
            });
          }
        } else {
          swal({
            text: 'Error de conexión con el servidor',
            icon: 'error',
            timer: '2500'
          });
          console.error("Error de conexión:", error);
        }
    })
  }

export {servicioListarGames, getToken, getNameUser, servicioPartida};
