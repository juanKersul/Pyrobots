import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Tablero from '../Simulacion/Tablero'

test("Renderiza Tablero", () => {
    //Carga de las rondas
    const rondas = [];
    const ronda0 = [];
    const ronda1 = [];
    const ronda2 = [];
    const ronda3 = [];
    const defaultimgRobot = "./robot.png"

    // Robot ID - IMG - Coordendas x;y - nombre
    ronda0.push({id: 0, x: 500, y: 1000, xf: 700, yf: 1000, nombre: 'Joe', vida: 45, mira: 360, motor: 0, xmis: 500, ymis: 1000, xmisf: 500, ymisf: 340});
    ronda0.push({id: 1, x: 0, y: 0, xf: 100, yf: 100, nombre: 'Mati', vida: 100, mira: 360, motor: 0, xmis: null, ymis: null, xmisf: null, ymisf: null});
    ronda0.push({id: 2, x: 400, y: 280, xf: 500, yf: 340, nombre: 'Mario', vida: 96, mira: 45, motor: 0, xmis: null, ymis: null, xmisf: null, ymisf: null});
    ronda0.push({id: 3, x: 0, y: 0, xf: 500, yf: 500, nombre: 'Steve', vida: 100, mira: 360, motor: 0, xmis: null, ymis: null, xmisf: null, ymisf: null});

    ronda1.push({id: 0, x: 700, y: 1000, xf: 900, yf: 1000, nombre: 'Joe', vida: 45, mira: 360, motor: 0, xmis: 700, ymis: 1000, xmisf: 500, ymisf: 340});
    ronda1.push({id: 1, x: 100, y: 100, xf: 260, yf: 260, nombre: 'Mati', vida: 100, mira: 360, motor: 0, xmis: null, ymis: null, xmisf: null, ymisf: null});
    ronda1.push({id: 2, x: 500, y: 340, xf: 500, yf: 340, nombre: 'Mario', vida: 0, mira: 45, motor: 0, xmis: null, ymis: null, xmisf: null, ymisf: null});
    ronda1.push({id: 3, x: 500, y: 500, xf: 1000, yf: 1000, nombre: 'Steve', vida: 100, mira: 360, motor: 0, xmis: null, ymis: null, xmisf: null, ymisf: null});

    ronda2.push({id: 0, x: 900, y: 1000, xf: 1000, yf: 900, nombre: 'Joe', vida: 45, mira: 360, motor: 0, xmis: 900, ymis: 1000, xmisf: 500, ymisf: 340});
    ronda2.push({id: 1, x: 260, y: 260, xf: 260, yf: 260, nombre: 'Mati', vida: 100, mira: 360, motor: 0, xmis: null, ymis: null, xmisf: null, ymisf: null});
    ronda2.push({id: 2, x: 500, y: 340, xf: 500, yf: 340, nombre: 'Mario', vida: 0, mira: 45, motor: 0, xmis: null, ymis: null, xmisf: null, ymisf: null});
    ronda2.push({id: 3, x: 1000, y: 1000, xf: 1000, yf: 1000, nombre: 'Steve', vida: 20, mira: 360, motor: 0, xmis: 1000, ymis: 1000, xmisf: 300, ymisf: 220});

    ronda3.push({id: 0, x: 1000, y: 900, xf: 1000, yf: 900, nombre: 'Joe', vida: 45, mira: 360, motor: 0, xmis: null, ymis: null, xmisf: null, ymisf: null});
    ronda3.push({id: 1, x: 260, y: 260, xf: 260, yf: 260, nombre: 'Mati', vida: 80, mira: 360, motor: 0, xmis: null, ymis: null, xmisf: null, ymisf: null});
    ronda3.push({id: 2, x: 500, y: 340, xf: 500, yf: 340, nombre: 'Mario', vida: 0, mira: 45, motor: 0, xmis: null, ymis: null, xmisf: null, ymisf: null});
    ronda3.push({id: 3, x: 1000, y: 1000, xf: 1000, yf: 1000, nombre: 'Steve', vida: 20, mira: 360, motor: 0, xmis: null, ymis: null, xmisf: null, ymisf: null});

    rondas[0] = ronda0;
    rondas[1] = ronda1;
    rondas[2] = ronda2;
    rondas[3] = ronda3;

    const RobotImages = {defaultimgRobot, defaultimgRobot, defaultimgRobot, defaultimgRobot}

    const component = render(<Tablero rondas={rondas} RobotImages={RobotImages}/>);
    component.getByText('Joe');
    component.getByText('Mati');
    component.getByText('Mario');
    component.getByText('Steve');
})