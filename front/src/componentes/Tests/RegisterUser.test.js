import { fireEvent, prettyDOM, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Registro from '../Registro/Register';
import { Provider } from "react-redux";
import store from '../../store/index';

const dataUser = {
    name: 'Alexis',
    password: 'HolA112##$',
    email: 'Alexis.centeno@mi.unc.edu.ar'
};

test('Regitro de un usuario', async () => {
    /*
    const mockName = jest.fn();
    const mockPass = jest.fn();
    const mockEmail = jest.fn();
    const mockRegister = jest.fn();
    const mockSignIn = jest.fn();
    render( 
    <Provider store={store}>
        <Registro sendDataUser= {() => console.log('Hola')} 
                    modifyDataName= {() => console.log('Hola')} 
                    modifyDataPassword= {() => console.log('Hola')} 
                    modifyDataEmail= {() => console.log('Hola')}/>
    </Provider>);
    */
    render( 
        <Provider store={store}>
            <Registro/>
        </Provider>);
        
    const inputUserRegister = screen.getByDisplayValue('Registrar');
    const inputUserName = screen.getByPlaceholderText('Nombre');
    const inputUserPass = screen.getByPlaceholderText('Contraseña');
    const inputUserEmail = screen.getByPlaceholderText('Correo electrónico');

    userEvent.type(inputUserName, dataUser.name);
    userEvent.type(inputUserPass, dataUser.password);
    userEvent.type(inputUserEmail, dataUser.email);
    userEvent.click(inputUserRegister);
    
    expect(inputUserName).toHaveValue(dataUser.name);
    expect(inputUserPass).toHaveValue(dataUser.password);
    expect(inputUserEmail).toHaveValue(dataUser.email);

    //const alert = await screen.findByRole('alert');
    //expect(alert).toBeInTheDocument();
    //expect(inputUserRegister).toHaveBeenCalledTimes(1);
});