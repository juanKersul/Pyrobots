import {render, screen, fireEvent} from '@testing-library/react';
import axios from 'axios';
import Login from '../Login/Login';
jest.mock('axios') // reemplaza el axios real por un objeto fake

beforeEach(() => {
    render(<Login />) // Montamos el componente
    axios.get.mockClear() // para que no afecte el comportamiento de una prueba en otra prueba de algun pedido axios => un pedido distinto por prueba
})

test('Exiten los elementos de login', () => {
    // consultamos si existe este elemento en lo que renderiza este componente
    const texto_de_login = screen.getByText(/INICIAR SESIÓN/i);
    const texto_de_placeholder_1 = screen.getByPlaceholderText(/Email o Username/i);
    const texto_de_placeholder_2 = screen.getByPlaceholderText(/Password/i);
    expect(texto_de_login).toBeInTheDocument();
    expect(texto_de_placeholder_1).toBeInTheDocument();
    expect(texto_de_placeholder_2).toBeInTheDocument();
    // screen.debug(); // me retorna lo que hay en el render como un console.log
})

test('probando mock de axios', () => {
    const response = {
        data: [ 
          { token:"iamatoken" },
        ]
    };
})