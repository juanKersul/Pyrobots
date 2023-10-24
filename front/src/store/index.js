import reducerSimulation from './simulation/reducer';
import {createStore, combineReducers} from 'redux';
import reducerListGames from './Partidas/reducer';
import reducerRegister from './register/reducer';
import reducerRobots from './robots/reducer';

const reducers = combineReducers({
        reducerSimulation,
        reducerRegister,
        reducerRobots,
        reducerListGames
});

const store =  createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()    
);

export default store;