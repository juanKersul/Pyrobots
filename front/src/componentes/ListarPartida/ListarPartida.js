import { Box, Button, Typography, Tab, Tabs, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, Grid, Card, CardContent, CardActions, IconButton, Tooltip, TextField, InputAdornment } from '@mui/material';
import { getDataGamesUser } from '../../store/Partidas/actions';
import UnirsePatida from '../UnirsePartida/UnirsePartida';
import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

// Estilos personalizados
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#121212',
  color: theme.palette.common.white,
  borderBottom: '1px solid #333',
  padding: '12px 16px',
  '&.MuiTableCell-head': {
    fontWeight: 'bold',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#1e1e1e',
  },
   '&:nth-of-type(even)': {
    backgroundColor: '#121212',
  },
  '& td, & th': {
     color: '#e0e0e0',
     borderBottom: '1px solid #333',
     padding: '12px 16px',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// Componente de Avatar para robots
const RobotAvatar = ({ initial, color }) => {
  return (
    <Box 
      sx={{
        width: 30, 
        height: 30, 
        borderRadius: '50%', 
        backgroundColor: color, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '14px',
        marginRight: 0.5
      }}
    >
      {initial}
    </Box>
  );
};

function ListarPartida({ getDataGamesUser }) {
  const [listPartidas, setListPartidas] = useState([]);
  const [viewMode, setViewMode] = useState('tarjetas');
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener datos de partidas
  useEffect(() => {
    // Mock data inicial para pruebas rápidas de UI
    // const mockGames = [
    //   { id: 1, name: "Partida 1", current_players: 1, max_players: 2, min_players: 2, n_matchs: 2, n_rounds_matchs: 2, status: "UNIRSE", user_creator: "user1:a@b.c", robots: [{initial: 'D', color: '#d32f2f'}]},
    //   { id: 2, name: "Partida Larga Nombre", current_players: 1, max_players: 2, min_players: 2, n_matchs: 5, n_rounds_matchs: 3, status: "ESPERANDO JUGADORES", user_creator: "user2:d@e.f", robots: [{initial: 'D', color: '#d32f2f'}, {initial: 'S', color: '#1976d2'}]},
    //   { id: 233, name: "Sesión #233", current_players: 2, max_players: 3, min_players: 2, n_matchs: 2, n_rounds_matchs: 2, status: "UNIRSE", user_creator: "user1:a@b.c", robots: [{initial: 'V', color: '#388e3c'}, {initial: 'S', color: '#ffa000'}]},
    //   { id: 2323, name: "La última", current_players: 1, max_players: 2, min_players: 2, n_matchs: 10, n_rounds_matchs: 5, status: "ESPERANDO JUGADORES", user_creator: "user3:g@h.i", robots: [{initial: 'B', color: '#7b1fa2'}]},
    // ];
    // setListPartidas(mockGames);
    // Descomentar para usar datos reales:
    getDataGamesUser(setListPartidas);
  }, [getDataGamesUser]);

  // Usuario actual
  let user = JSON.parse(localStorage.getItem('user'));
  
  // Comprobar si el usuario es el creador de la partida
  const isCreatorOfMatch = (user, dataOfuserMatch) => {
    if (!dataOfuserMatch) return false;
    let username = dataOfuserMatch.split(":")[0];
    let email = dataOfuserMatch.split(":")[1];
    return (user === username || user === email);
  };

  // Filtrar partidas según estado
  const getFilteredGames = () => {
    if (!Array.isArray(listPartidas)) return [];

    let filtered = listPartidas;

    // Filtrar por estado (tab)
    if (tabValue === 1) { // Disponibles
      filtered = filtered.filter(game =>
        game.current_players < game.max_players && game.status !== 'FINALIZADA');
    } else if (tabValue === 2) { // En espera
      filtered = filtered.filter(game =>
        game.status === 'ESPERANDO' || game.status === 'ESPERANDO JUGADORES');
    }
    // else tabValue === 0 (Todas), no se filtra por estado

    // Filtrar por término de búsqueda (nombre o ID)
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(game.id).includes(searchTerm)
      );
    }

    return filtered;
  };

  // Obtener cantidad por estado
  const totalGames = Array.isArray(listPartidas) ? listPartidas.length : 0;
  const availableGames = Array.isArray(listPartidas) ? 
    listPartidas.filter(game => game.current_players < game.max_players && game.status !== 'FINALIZADA').length : 0;
  const waitingGames = Array.isArray(listPartidas) ? 
    listPartidas.filter(game => game.status === 'ESPERANDO' || game.status === 'ESPERANDO JUGADORES').length : 0;

  // Función para determinar el estado de la partida
  const getGameState = (game) => {
    if (game.status === 'ESPERANDO JUGADORES') return 'ESPERANDO JUGADORES';
    if (game.status === 'FINALIZADA') return 'FINALIZADA';
    return 'UNIRSE';
  };

  // Cambiar entre vistas
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleToggleView = (mode) => {
    setViewMode(mode);
  };

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Simula el tiempo transcurrido (reemplazar con lógica real si hay timestamp)
  const getTimeAgo = (gameId) => {
    // Placeholder - Debería calcularse basado en fecha de creación/actualización
    const minutes = (gameId % 15) + 5; // Ejemplo aleatorio
    return `Hace ${minutes} minutos`;
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto', color: 'white' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Box>
           <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Sesiones de Juego Activas
           </Typography>
           <Typography variant="subtitle1" sx={{ color: 'grey' }}>
              Únete a partidas existentes o crea una nueva
           </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          sx={{ borderRadius: '4px' }}
        >
          Crear Nueva Sesión
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
         <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant={tabValue === 0 ? "contained" : "outlined"}
              onClick={() => setTabValue(0)}
              sx={{ borderRadius: '20px', px: 2, textTransform: 'none', borderColor: '#333', color: tabValue !== 0 ? 'grey' : undefined, bgcolor: tabValue === 0 ? '#333' : undefined }}
            >
              {totalGames} Sesiones
            </Button>
            <Button
              variant={tabValue === 1 ? "contained" : "outlined"}
              onClick={() => setTabValue(1)}
              sx={{ borderRadius: '20px', px: 2, textTransform: 'none', borderColor: '#16803C', color: tabValue !== 1 ? '#16803C' : undefined, bgcolor: tabValue === 1 ? '#16803C' : undefined }}
            >
              {availableGames} Disponibles
            </Button>
            <Button
              variant={tabValue === 2 ? "contained" : "outlined"}
              onClick={() => setTabValue(2)}
              sx={{ borderRadius: '20px', px: 2, textTransform: 'none', borderColor: '#B18D12', color: tabValue !== 2 ? '#B18D12' : undefined, bgcolor: tabValue === 2 ? '#B18D12' : undefined }}
            >
              {waitingGames} En Espera
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="Buscar sesiones..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'grey' }} />
                  </InputAdornment>
                ),
                sx: { 
                  color: 'white', 
                  bgcolor: 'rgba(255, 255, 255, 0.09)',
                  borderRadius: '4px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                }
              }}
              InputLabelProps={{ sx: { color: 'grey' } }}
            />
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              sx={{ borderColor: '#333', color: 'white', textTransform: 'none' }}
              onClick={() => getDataGamesUser(setListPartidas)}
            >
              Actualizar
            </Button>
          </Box>
      </Box>

      <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={viewMode === 'tarjetas' ? 0 : 1}
          onChange={(event, newValue) => handleToggleView(newValue === 0 ? 'tarjetas' : 'tabla')}
          textColor="inherit"
          indicatorColor="primary"
           sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#6275C2',
            },
            '& .MuiTab-root': {
              color: 'grey',
              textTransform: 'none',
              fontSize: '1rem',
              '&.Mui-selected': {
                color: 'white',
              },
              '&:hover': {
                 backgroundColor: 'rgba(255, 255, 255, 0.05)',
                 borderRadius: '4px 4px 0 0'
              }
            },
          }}
        >
          <Tab label="Tarjetas" />
          <Tab label="Tabla" />
        </Tabs>
      </Box>

      {viewMode === 'tarjetas' && (
        <Grid container spacing={2}>
          {getFilteredGames().map((game) => {
            const gameState = getGameState(game);
            const stateColor =
              gameState === 'UNIRSE' ? '#16803C' :
              gameState === 'ESPERANDO JUGADORES' ? '#B18D12' : '#555';
            const timeAgo = getTimeAgo(game.id);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
                <Card sx={{
                  backgroundColor: '#1e1e1e',
                  color: 'white',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '8px',
                  boxShadow: 'none',
                  border: '1px solid #333',
                  transition: 'border-color 0.3s',
                  '&:hover': {
                    borderColor: '#555',
                  }
                }}>
                  <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                              {game.name || `Sesión #${game.id}`}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="caption" sx={{ color: 'grey', mr: 1 }}>
                                  {timeAgo}
                              </Typography>
                              <Tooltip title={`Nombre: ${game.name || 'Sin nombre'}\nCreador: ${game.user_creator || 'Desconocido'}`}>
                                <IconButton size="small" sx={{ color: 'grey' }}>
                                  <InfoIcon fontSize="small"/>
                                </IconButton>
                              </Tooltip>
                          </Box>
                      </Box>
                      <Box sx={{
                        backgroundColor: stateColor,
                        color: 'white',
                        py: 0.3,
                        px: 1,
                        borderRadius: '4px',
                        display: 'inline-block',
                        mb: 2,
                        fontSize: '0.75rem',
                        fontWeight: '500',
                      }}>
                        {gameState}
                      </Box>
                   </CardContent>

                   <CardContent sx={{ flexGrow: 1, py: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {[
                          { label: 'Jugadores:', value: `${game.current_players || '?'}/${game.max_players || '?'}` },
                          { label: 'Min. Jugadores:', value: game.min_players || '?' },
                          { label: 'Partidas:', value: game.n_matchs || '?' },
                          { label: 'Rondas:', value: game.n_rounds_matchs || '?' },
                        ].map(item => (
                           <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: 'grey', fontSize: '0.85rem' }}>
                                {item.label}
                              </Typography>
                              <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                {item.value}
                              </Typography>
                           </Box>
                        ))}
                   </CardContent>

                   <Box sx={{ p: 2 }}>
                      <Typography variant="body2" sx={{ color: 'grey', mb: 1, fontSize: '0.85rem' }}>
                        Robots en la sesión:
                      </Typography>
                      <Box sx={{ display: 'flex', mb: 2, minHeight: '30px' }}>
                        {Array.isArray(game.robots) && game.robots.length > 0 ? (
                          game.robots.map((robot, index) => (
                            <RobotAvatar key={index} initial={robot.initial} color={robot.color} />
                          ))
                        ) : (
                          <Typography variant="caption" sx={{ color: 'grey', fontStyle: 'italic' }}>N/A</Typography>
                        )}
                      </Box>
                      <CardActions sx={{ p: 0, justifyContent: 'center' }}>
                         <UnirsePatida
                           matchID={game.id}
                           maxPlayers={game.max_players}
                           minPlayers={game.min_players}
                           nameMatch={game.name}
                           nameCreatorMatch={game.user_creator}
                         />
                      </CardActions>
                   </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {viewMode === 'tabla' && (
        <TableContainer component={Paper} sx={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '8px' }}>
          <Table aria-label="customized table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell align="center">Jugadores</StyledTableCell>
                <StyledTableCell align="center">Min. Jug.</StyledTableCell>
                <StyledTableCell align="center">Partidas</StyledTableCell>
                <StyledTableCell align="center">Rondas</StyledTableCell>
                <StyledTableCell>Estado</StyledTableCell>
                <StyledTableCell>Robots</StyledTableCell>
                <StyledTableCell align="center">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredGames().map((game) => {
                const gameState = getGameState(game);
                const stateColor =
                  gameState === 'UNIRSE' ? '#16803C' :
                  gameState === 'ESPERANDO JUGADORES' ? '#B18D12' : '#555';

                return (
                  <StyledTableRow key={game.id}>
                    <StyledTableCell component="th" scope="row">
                      {game.name || `Sesión #${game.id}`}
                    </StyledTableCell>
                    <StyledTableCell align="center">{game.current_players || '?'}/{game.max_players || '?'}</StyledTableCell>
                    <StyledTableCell align="center">{game.min_players || '?'}</StyledTableCell>
                    <StyledTableCell align="center">{game.n_matchs || '?'}</StyledTableCell>
                    <StyledTableCell align="center">{game.n_rounds_matchs || '?'}</StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{
                        backgroundColor: stateColor,
                        color: 'white',
                        py: 0.3, px: 1, borderRadius: '4px',
                        display: 'inline-block', fontSize: '0.75rem', fontWeight: '500',
                      }}>
                        {gameState}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{ display: 'flex' }}>
                         {Array.isArray(game.robots) && game.robots.length > 0 ? (
                           game.robots.slice(0, 4).map((robot, index) => (
                             <RobotAvatar key={index} initial={robot.initial} color={robot.color} />
                           ))
                         ) : (
                           <Typography variant="caption" sx={{ color: 'grey' }}>-</Typography>
                         )}
                         {Array.isArray(game.robots) && game.robots.length > 4 && (
                             <Tooltip title={`+${game.robots.length - 4} más`}>
                                 <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', ml: 0.5 }}>
                                     +{game.robots.length - 4}
                                 </Box>
                             </Tooltip>
                         )}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                       <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Ver detalles">
                             <IconButton size="small" sx={{ color: 'grey' }}>
                                <InfoIcon fontSize="small" />
                             </IconButton>
                          </Tooltip>
                          <UnirsePatida
                            matchID={game.id}
                            maxPlayers={game.max_players}
                            minPlayers={game.min_players}
                            nameMatch={game.name}
                            nameCreatorMatch={game.user_creator}
                          />
                       </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default connect(null, {getDataGamesUser})(ListarPartida);