import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const defaultimgRobot = "./robot.png"

const imgstyle = {
    width: "70px",
    height: "70px",
    border: "solid 0.5px black",
    backgroundColor: "lightGreen",
    borderRadius: "15px",
}


const Perfil = () => {

    const [perfilName, setperfilName] = useState("Pepe");
    const [perfilEmail, setperfilEmail] = useState("hola@gmail.com");
    const [perfilAvatar, setperfilAvatar] = useState(defaultimgRobot);
    const [tempAvatar, settempAvatar] = useState(defaultimgRobot);

    const selectedImg = event => {
        settempAvatar(event.target.files[0])
    }
    

    const headers = () => {
        return {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }
    };

    const subirImagen = async () => {
        let fileimg = new FormData();
        fileimg.append('file', tempAvatar);

        const baseURL = "http://127.0.0.1:8000";
        const tkn = JSON.parse(localStorage.getItem("user")).token;
        await axios.post(baseURL + "/ReplaceUserImage", fileimg, {params: {token: tkn}}, headers())
        .then(
            swal({
            text: 'Avatar Cambiado.',
            icon: 'success',
            timer: '1800'
          })
        )
        .catch(
            swal({
                text: 'Error al cambiar Avatar.',
                icon: 'error',
                timer: '1800'
            })
        )
    }

    useEffect(() => {
        const obtenerUsuario = async () => {
            const tkn = JSON.parse(localStorage.getItem("user")).token;
            const baseURL = "http://127.0.0.1:8000";
            const response = await axios.get(baseURL + "/GetUser", {params: { token: tkn }});
            setperfilAvatar(response.data.avatar);
            setperfilName(response.data.username);
            setperfilEmail(response.data.email);
        }
        obtenerUsuario();
      }, []) 

    return (
        <div className="form" style={{maxWidth: 500}}>
            <form>
                <Typography variant="h4"> Nombre de Usuario: </Typography>
                <Typography variant="h5" sx={{margin:2}}color={"green"}> {perfilName} </Typography>
                <Typography variant="h4"> Correo Electrónico: </Typography>
                <Typography variant="h5" sx={{margin:3}} color={"green"}> {perfilEmail} </Typography>
                <Typography variant="h4" sx={{margin:1}}> Avatar: </Typography>
                <img src={`data:image/png;base64,${perfilAvatar}`} style={imgstyle} alt=""></img>
                <Typography variant="h5" sx={{margin:2}}> Cambiar Avatar: </Typography>
                <div id="input-avatar" >
                    <input
                        className="input-file-img"
                        type="file"
                        multiple={ false }
                        accept="image/*"
                        onChange={selectedImg}
                    >
                    </input>
                    <button onClick={subirImagen}>Cambiar Avatar</button>
                </div>
            </form>
        </div>
    );
}

export default Perfil
