import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Misil from '../Simulacion/Misil'

test("Renderiza Misil", () => {
    const misil = {xmis: 0, ymis: 0, xmisf: 700, ymisf: 700, num: 0, ronda: 0}

    render(
        <Misil xmis={misil.xmis} ymis={misil.ymis} xmisf={misil.xmisf} ymisf={misil.ymisf}
        num={misil.num} ronda={misil.ronda}/>
    )
    
    document.getElementById("Misil")
})