import "./RobotEnJuego.css";

//The Robot size is 21x21px but it is scaled as 55%.
const tamaño = 11.55;
const maxBorde = 561.55-tamaño;

// Logical Constants
const min = 0;
const max = 100;
const maxMov = 1000;
const maxMira = 360;

function RobotEnJuego({imagen, x, y, xf, yf, nombre, num, vida, motor, mira, ronda}) {

    // Check BordesRobotImages
    if (x < min) { x = min;}
    if (y < min) { y = min;}
    if (x > maxMov) { x = maxMov;}
    if (y > maxMov) { y = maxMov;}
    if (xf < min) { xf = min;}
    if (yf < min) { yf = min;}
    if (xf > maxMov) { xf = maxMov;}
    if (yf > maxMov) { yf = maxMov;}

    // Check Vida Limit
    if (vida > max) { vida = max;}
    if (vida < min) { vida = min;}
    
    // Check motor Limit
    if (motor > max) { motor = max;}
    if (motor < min) { motor = min;}

    // Check mira Limit
    if (mira > maxMira) { mira = maxMira;}
    if (mira < min) { mira = min;}

    //Robot: Aplicar Coordenadas.
    document.documentElement.style.setProperty("--xinit_" + num, (x*0.55) + "px");
    document.documentElement.style.setProperty("--yinit_" + num, (maxBorde-(y*0.55)) + "px");
    document.documentElement.style.setProperty("--xfinal_" + num, (xf*0.55) + "px");
    document.documentElement.style.setProperty("--yfinal_" + num, (maxBorde-(yf*0.55)) + "px");

    const robotanimar = { animation: `animate_${num} 1s linear forwards`}
    
    //Robot: Estadísitcas.
    let rimagen = imagen;
    const robotstats = { transform: `translate(100%, ${num*105}%)`}
    const robotvid = { width: `${3.5*vida}px`}
    
    /*
    if (vida === 0) {
        rimagen = "https://toppng.com/uploads/preview/dead-pixel-society-black-and-white-pixel-11563243949kkuykxltej.png";
    }
    */

    return (
    <div key={ronda*(num+1)}>
        <div style={robotanimar} id="RobotEnJuego">
            <img src={`data:image/png;base64,${rimagen}`} alt=""></img>
            <p className="nombre">{nombre}</p>
        </div>
        <div style={robotstats} id="RobotStats">
            <img src={`data:image/png;base64,${rimagen}`} alt=""></img>
            <b className="nombre">Nombre: {nombre}</b>
            <b className="vidatext">{vida}%</b>
            <div className="maxvida"></div>
            <div style={robotvid} className="vida"></div>
            <b className="mira">Mira: {mira}°</b>
            <b className="motor">Motor: {motor}%</b>
        </div>
    </div>
    );
}

export default RobotEnJuego;