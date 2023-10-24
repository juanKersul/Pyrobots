import { render } from '@testing-library/react'
import RobotEnJuego from '../Simulacion/RobotEnJuego'

test("Renderiza RobotEnJuego", () => {

    const robot = {
        id: 0, imagen: "https://opengameart.org/sites/default/files/styles/medium/public/robot-preview.png",
        x: 500, y: 1000, xf: 700, yf: 1000, nombre: 'Joe-dete Nintendo', vida: 45, mira: 360, motor: 0
    }

    const component = render(
        <RobotEnJuego imagen={robot.imagen} x={robot.x} y={robot.y} xf={robot.xf} yf={robot.yf}
        nombre={robot.nombre} num={0} vida={robot.vida} motor={robot.motor} mira={robot.mira}
        ronda={0}/>
    )

    component.getByText(`${robot.nombre}`)
})

test("Vida correcta del RobotEnJuego", () => {

    const robot = {
        id: 0, imagen: "https://opengameart.org/sites/default/files/styles/medium/public/robot-preview.png",
        x: 500, y: 1000, xf: 700, yf: 1000, nombre: 'Joe-dete Nintendo', vida: 45, mira: 360, motor: 0
    }

    render(
        <RobotEnJuego imagen={robot.imagen} x={robot.x} y={robot.y} xf={robot.xf} yf={robot.yf}
        nombre={robot.nombre} num={0} vida={robot.vida} motor={robot.motor} mira={robot.mira}
        ronda={0}/>
    )
    
    const robotexto = document.getElementById("RobotStats");
    const vida = robotexto.querySelector('.vida');
    const vidastyle = getComputedStyle(vida);
    expect(vidastyle.width).toBe(`${3.5*robot.vida}px`);
})