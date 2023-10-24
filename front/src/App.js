import React, {useState} from 'react' 
import HomepageLogin from './componentes/HomePageLogin';
import HomePageUser from "./componentes/HomePageUser";
import { Provider } from "react-redux";
import store from './store/index';

function App() {
  const [login, setLogin] = useState(false);
  
  React.useEffect(() => {
    if (localStorage.getItem("user")) setLogin(true)
    else setLogin(false);
  }, []);

  if(!login) return (
    <Provider store={store}>
      <HomePageUser/>
    </Provider>);
  else return (
    <Provider store={store}>
      <HomepageLogin/>
    </Provider>
  );
}

export default App;
