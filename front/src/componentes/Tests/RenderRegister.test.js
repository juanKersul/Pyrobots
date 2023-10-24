import { render } from '@testing-library/react';
import Registro from '../Registro/Register';
import { Provider } from "react-redux";
import store from '../../store/index';

test('Renderización de Regitro', () => {
  const component = render( 
  <Provider store={store}>
    <Registro />
  </Provider>);

  component.findAllByPlaceholderText('Nombre');
  component.findAllByPlaceholderText('Contraseña');
  component.findAllByPlaceholderText('Correo electrónico');
  component.findAllByText('Registrar');
  component.findAllByText('sign in');
});