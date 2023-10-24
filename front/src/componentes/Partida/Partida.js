import {sendDataGame, modifyDataNameGame, modifyDataPasswordGame, 
        modifyDataRoundsGame, modifyDataGamesGame, modifyDataMaxPlayersGame} from '../../store/Partidas/actions';
import UnirsePatida from '../UnirsePartida/UnirsePartida';
import {connect} from 'react-redux';
import { useState } from 'react';

function ViewJoinMatch({dataMatch}){
  if(dataMatch.id_match !== "") 
    return (<UnirsePatida 
              matchID={dataMatch.id_match}
              maxPlayers={dataMatch.max_players}
              minPlayers={dataMatch.min_players}
              nameMatch={dataMatch.name}
              nameCreatorMatch={dataMatch.user_creator}
            />);
  else 
    return <div></div>;
}

function CrearPartida({sendDataGame, modifyDataNameGame, modifyDataPasswordGame, 
                      modifyDataRoundsGame, modifyDataGamesGame, modifyDataMaxPlayersGame}) {  
  const [dataMatch, getDataMatch] = useState({id_match: ""});
  
  return (
    
    (dataMatch.id_match !== "") ? 
      <ViewJoinMatch dataMatch= {dataMatch}/>
    :
    <div className="login-page">
      <div className="form">
        <form className="register-form">
          <input type="text" name="name" placeholder="Nombre de partida" 
          onChange={(e) => {modifyDataNameGame(e.target.value)}} required />

          <input type="number" name="max_players" placeholder="Cantidad de jugadores" 
          onChange={(e) => {modifyDataMaxPlayersGame(e.target.value)}} required/>

          <input type="password" name="password" placeholder="Contraseña" 
          onChange={(e) =>  modifyDataPasswordGame(e.target.value)} />

          <input type="number" name="n_matchs" placeholder="Cantidad de juegos" 
          onChange={(e) => modifyDataGamesGame(e.target.value)} required />
          
          <input type="number" name="n_rounds_match" placeholder="Cantidad de rondas" 
           onChange={(e) => modifyDataRoundsGame(e.target.value)} required />

          <input type="button" value="Submit" onClick={() => sendDataGame(getDataMatch)}/>
        </form>
        </div>
    </div>
  );
}

export default connect(null, {sendDataGame, modifyDataNameGame, modifyDataPasswordGame, 
                              modifyDataRoundsGame, modifyDataGamesGame, modifyDataMaxPlayersGame})(CrearPartida);
