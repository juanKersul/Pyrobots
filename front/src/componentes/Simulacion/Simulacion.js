import Tablero from './Tablero';
import { useState, useEffect } from 'react';
import axios from "axios";

function Simulacion() {
  const rondas = JSON.parse(localStorage.getItem("simulacion"));
    

  const [RobotImages, setRobotImages] = useState([]);

  useEffect(() => {
    const obtenerImagen = async (robotId) => {
      const tkn = JSON.parse(localStorage.getItem("user")).token;
      const baseURL = "http://127.0.0.1:8000";
      const response = await axios.get(baseURL + "/image", {params: { token: tkn, robot_id: robotId }});
      
      setRobotImages(RobotImages => [...RobotImages, response.data]);
    }
    // eslint-disable-next-line
    rondas[0].map(robot => {
      obtenerImagen(robot.id);
    })// eslint-disable-next-line
  }, []) 
  
  if (rondas != null) {
    return (
      <div id="Simulacion">
        <Tablero rondas={rondas} RobotImages={RobotImages}/>
      </div>
    );
  } else {
    <div></div>
  }
}

export default Simulacion;