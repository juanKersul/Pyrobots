import axios from "axios";
import swal from "sweetalert";

const baseURL = "http://127.0.0.1:8000";

const defaultdataPartida = {
  name: "",
  max_players: "",
  password: "",
  n_matchs: "",
  n_rounds_match: ""
}

async function servicioPartida(postData) {
  console.log("Creando partida con datos:", postData);
  await axios
    .post(baseURL + "/match/add", postData)
    .then(function (response) {
      console.log("Respuesta al crear partida:", response.data);
      // Verificar si la respuesta tiene el formato esperado
      if (response.data && (response.data.id_match || response.data.id)) {
        swal({
          text: 'Partida creada exitosamente.',
          icon: 'success',
          timer: '1800'
        });
      } else {
        console.warn("Respuesta no estándar del servidor:", response.data);
        swal({
          text: 'Partida posiblemente creada, pero hubo un problema con la respuesta.',
          icon: 'warning',
          timer: '2500'
        });
      }
    })
    .catch(function (error) {
      console.error("Error al crear partida:", error);
      if (error.response) {
        console.log("Detalles del error:", {
          status: error.response.status,
          data: error.response.data
        });
        
        if (error.response.status === 409) {
          swal({
            text: error.response.data.detail || "El nombre de la partida ya existe",
            icon: 'error'
          });
        }
        else if (error.response.status === 422) {
          const errorMsg = error.response.data.detail && error.response.data.detail[0] ? 
            error.response.data.detail[0].msg : 
            "Error en los datos enviados";
          swal({
            text: errorMsg,
            icon: 'error'
          });
        }
        else {
          swal({
            text: 'Error en el servidor: ' + error.response.status,
            icon: 'error'
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
    });
}

function handleSubmit(dataPartida) {
  const user = JSON.parse(localStorage.getItem("user"));
  const postData = {
    name: dataPartida.name,
    max_players: dataPartida.max_players,
    min_players: 2,
    password: dataPartida.password,
    n_matchs: dataPartida.n_matchs,
    n_rounds_matchs: dataPartida.n_rounds_match,
    user_creator: user.userlogin,
    token: user.token,
  };
  servicioPartida(postData);
}

export {handleSubmit, defaultdataPartida};
