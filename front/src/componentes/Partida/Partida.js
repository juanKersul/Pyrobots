import {sendDataGame, modifyDataNameGame, modifyDataPasswordGame, 
        modifyDataRoundsGame, modifyDataGamesGame, modifyDataMaxPlayersGame} from '../../store/Partidas/actions';
import UnirsePatida from '../UnirsePartida/UnirsePartida';
import {connect} from 'react-redux';
import { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

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
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: '#1e1e1e',
          p: 4,
          borderRadius: '8px',
          border: '1px solid #333'
        }}
      >
        <Typography component="h1" variant="h5" sx={{ color: 'white', mb: 3 }}>
          Crear Nueva Partida
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nombre de partida"
            name="name"
            autoFocus
            onChange={(e) => {modifyDataNameGame(e.target.value)}}
            variant="outlined"
            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
            InputProps={{ sx: { color: 'white', bgcolor: 'rgba(255, 255, 255, 0.09)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' } } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="max_players"
            label="Cantidad máxima de jugadores"
            type="number"
            id="max_players"
            onChange={(e) => {modifyDataMaxPlayersGame(e.target.value)}}
            variant="outlined"
            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
            InputProps={{ sx: { color: 'white', bgcolor: 'rgba(255, 255, 255, 0.09)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' } } }}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Contraseña (opcional)"
            type="password"
            id="password"
            autoComplete="new-password"
            onChange={(e) =>  modifyDataPasswordGame(e.target.value)}
            variant="outlined"
            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
            InputProps={{ sx: { color: 'white', bgcolor: 'rgba(255, 255, 255, 0.09)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' } } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="n_matchs"
            label="Cantidad de partidas"
            type="number"
            id="n_matchs"
            onChange={(e) => modifyDataGamesGame(e.target.value)}
            variant="outlined"
            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
            InputProps={{ sx: { color: 'white', bgcolor: 'rgba(255, 255, 255, 0.09)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' } } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="n_rounds_match"
            label="Cantidad de rondas por partida"
            type="number"
            id="n_rounds_match"
            onChange={(e) => modifyDataRoundsGame(e.target.value)}
            variant="outlined"
            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
            InputProps={{ sx: { color: 'white', bgcolor: 'rgba(255, 255, 255, 0.09)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' } } }}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => sendDataGame(getDataMatch)}
          >
            Crear Partida
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default connect(null, {sendDataGame, modifyDataNameGame, modifyDataPasswordGame, 
                              modifyDataRoundsGame, modifyDataGamesGame, modifyDataMaxPlayersGame})(CrearPartida);
