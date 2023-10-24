import "./Tablero.css";
import RobotEnJuego from "./RobotEnJuego";
import Misil from "./Misil";
import {useState, useEffect} from "react";

function Tablero({rondas, RobotImages}) {
    const [rondaActual, setrondaActual] = useState(1);

    const [vida, setVida] = useState(rondas[0].map(robot => robot.vida));
    const [x, setX] = useState(rondas[0].map(robot => robot.x));
    const [y, setY] = useState(rondas[0].map(robot => robot.y));
    const [xf, setXf] = useState(rondas[0].map(robot => robot.xf));
    const [yf, setYf] = useState(rondas[0].map(robot => robot.yf));
    const [id, setId] = useState(rondas[0].map(robot => robot.id));
    const [nombre, setNombre] = useState(rondas[0].map(robot => robot.nombre));
    const [motor, setMotor] = useState(rondas[0].map(robot => robot.motor));
    const [mira, setMira] = useState(rondas[0].map(robot => robot.mira));
    const [xmis, setXmis] = useState(rondas[0].map(robot => robot.xmis));
    const [ymis, setYmis] = useState(rondas[0].map(robot => robot.ymis));
    const [xmisf, setXmisf] = useState(rondas[0].map(robot => robot.xmisf));
    const [ymisf, setYmisf] = useState(rondas[0].map(robot => robot.ymisf));
    
    useEffect( () => {
        if (rondaActual < rondas.length) {
            setTimeout(() => {
                setVida(rondas[rondaActual].map(robot => robot.vida));
                setX(rondas[rondaActual].map(robot => robot.x));
                setY(rondas[rondaActual].map(robot => robot.y));
                setXf(rondas[rondaActual].map(robot => robot.xf));
                setYf(rondas[rondaActual].map(robot => robot.yf));
                setId(rondas[rondaActual].map(robot => robot.id));
                setNombre(rondas[rondaActual].map(robot => robot.nombre));
                setMotor(rondas[rondaActual].map(robot => robot.motor));
                setMira(rondas[rondaActual].map(robot => robot.mira));
                setXmis(rondas[rondaActual].map(robot => robot.xmis));
                setYmis(rondas[rondaActual].map(robot => robot.ymis));
                setXmisf(rondas[rondaActual].map(robot => robot.xmisf));
                setYmisf(rondas[rondaActual].map(robot => robot.ymisf));
                setrondaActual(rondaActual+1);    
            }, 960);
        }
    }, [rondaActual, rondas]);

    const output = [];
    rondas[rondaActual-1].forEach((_, i) => {
        output.push(
            <li key={id[i]}>
                <RobotEnJuego imagen={RobotImages[i]} x={x[i]} y={y[i]} xf={xf[i]} yf={yf[i]} nombre={nombre[i]}
                num={i} vida={vida[i]} motor={motor[i]} mira={mira[i]} ronda={rondaActual}/> 
                <Misil xmis={xmis[i]} ymis={ymis[i]} xmisf={xmisf[i]} ymisf={ymisf[i]} num={i} ronda={rondaActual}/>
            </li>
        );
    });

    //Ultima Ronda.
    const vivos = ["Supervivientes:"];
    if (rondaActual === rondas.length) {
        //Listar Robots vivos.
        rondas[rondaActual-1].forEach((robot) => {
            if (robot.vida > 0) {
                vivos.push(
                    <div key={robot.nombre}>
                        {` "${robot.nombre}"`}
                    </div>
                );
            }
        });
        //Añadir Mensaje de Supervivientes
        output.push(
            <div key={rondaActual} className="supervivientes">
                {vivos}
            </div>
        );
    }

    return (
        <div>
            <div id="Tablero">
                {output}
            </div>
        </div>
    )
}

export default Tablero;