import "./Misil.css";

// Size Constants
const tamaño = 3;
const maxBorde = 561.55-tamaño;

// Logical Constants
const min = 0;
const maxMov = 1000;

function Misil({xmis, ymis, xmisf, ymisf, num, ronda}) {
    
    let show = false;
    if (xmis !== null && ymis !== null && xmisf !== null && ymisf !== null) {
        show = true;
    } else {
        show = false;
    }

    // Check Bordes
    if (xmis < min) { xmis = min;}
    if (ymis < min) { ymis = min;}
    if (xmis > maxMov) { xmis = maxMov;}
    if (ymis > maxMov) { ymis = maxMov;}
    if (xmisf < min) { xmisf = min;}
    if (ymisf < min) { ymisf = min;}
    if (xmisf > maxMov) { xmisf = maxMov;}
    if (ymisf > maxMov) { ymisf = maxMov;}

    //Misil: Aplicar Coordenadas.
    document.documentElement.style.setProperty("--xinitmis_" + num, (xmis*0.55) + "px");
    document.documentElement.style.setProperty("--yinitmis_" + num, (maxBorde-(ymis*0.55)) + "px");
    document.documentElement.style.setProperty("--xfinalmis_" + num, (xmisf*0.55) + "px");
    document.documentElement.style.setProperty("--yfinalmis_" + num, (maxBorde-(ymisf*0.55)) + "px");

    const misilanimar = { animation: `animatemis_${num} 1s linear forwards`}

    return (
        <div>
            {show && <div id={"Misil"} style={misilanimar} key={ronda*(num+1)}></div>}
        </div>
    );
}

export default Misil;