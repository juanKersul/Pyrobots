import {getToken, servicioListarGames, getNameUser, servicioPartida} from './service';

const defaultDataUser = {
    name: "",
    max_players: 0,
    min_players: 2,
    password: "",
    n_matchs: 0,
    n_rounds_matchs: 0,
    user_creator: getNameUser(),
    token: getToken()
};

function reducer(dataGame = defaultDataUser, action){ 
    const dataGameChange = (atrib, data) => {
        return {
            ...dataGame,
            [atrib]: data
        }
    };
    if (action.type === 'GET_DATA_GAMES_USER') servicioListarGames(action.data);
    else if (action.type === 'SEND_DATA_GAME') servicioPartida(dataGame, action.data); 
    else if (action.type === 'MODIFY_DATA_NAME_GAME') return dataGameChange("name", action.data);
    else if (action.type === 'MODIFY_DATA_MAX_PLAYERS_GAME') return dataGameChange("max_players", action.data); 
    else if (action.type === 'MODIFY_DATA_PASS_GAME') return dataGameChange("password", action.data); 
    else if (action.type === 'MODIFY_DATA_GAME_GAME') return dataGameChange("n_matchs", action.data); 
    else if (action.type === 'MODIFY_DATA_ROUNDS_GAME') return dataGameChange("n_rounds_matchs", action.data);
 
    return dataGame;
}

export default reducer;