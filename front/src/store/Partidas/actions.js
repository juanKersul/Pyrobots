const getDataGamesUser = (callback) => {
    return {
        type: "GET_DATA_GAMES_USER",
        data: callback
    }
};

const sendDataGame = (callback) => {
    return {
        type: "SEND_DATA_GAME",
        data: callback
    }
};

const modifyDataNameGame = (name) => {
    return {
        type: "MODIFY_DATA_NAME_GAME",
        data: name
    }
};

const modifyDataPasswordGame = (password) => {
    return {
        type: "MODIFY_DATA_PASS_GAME",
        data: password
    }
};

const modifyDataRoundsGame = (rounds) => {
    return {
        type: "MODIFY_DATA_ROUNDS_GAME",
        data: parseInt(rounds)
    }
};

const modifyDataMaxPlayersGame = (players) => {
    return {
        type: "MODIFY_DATA_MAX_PLAYERS_GAME",
        data: parseInt(players)
    }
};

const modifyDataGamesGame = (game) => {
    return {
        type: "MODIFY_DATA_GAME_GAME",
        data: parseInt(game)
    }
};

export {getDataGamesUser, sendDataGame, modifyDataNameGame, 
        modifyDataPasswordGame, modifyDataRoundsGame, modifyDataGamesGame,
        modifyDataMaxPlayersGame};
