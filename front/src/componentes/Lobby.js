import { Box, styled, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button, Typography } from '@mui/material';
import { BrowserRouter as Switch, Route } from "react-router-dom";
import {iniciarPartida} from './iniciarPartida/iniciarPartida';
import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import MuiToolbar from '@mui/material/Toolbar';
import MuiAppBar from '@mui/material/AppBar';
import HomepageLogin from './HomePageLogin';
import * as React from 'react';
import swal from "sweetalert";

const Toolbar = styled(MuiToolbar)(({ theme }) => ({
  height: 64,
  [theme.breakpoints.up('sm')]: {
    height: 70,
  },
}));

const AppBar = (props) => {
  return <MuiAppBar elevation={0} position="fixed" {...props} />;
}

const rightLink = {
  fontSize: 16,
  color: 'common.white',
  ml: 3,
};

// Si es el usuario no se puede unir por algun motivo del back se lo patea afuera
// ,o sea, si te quieres unir pasas al Lobby por un momento hasta que sucesa 2 cosas: o te patea afuera o te quedas adentro y puedes ver quienes estan jugando
const Lobby = () => {
  const [stateOfMatch, setStateOfMatch] = useState("Esperando Jugadores");
  const [socketDisconnect, setSocketDisconnect] = useState(false);
  const [usersJoin, setUsersJoin] = useState([]); // array vacio
  const [usersJoinChange, setUsersJoinChange] = useState(false);
  //const [initFinalized, setInitFinalized] = useState(false);
  // const [goHome, setGoHome] = useState(false);
  //elementos traidos como un objeto de UnirsePartida
  // matchID: props.matchID,
  // maxPlayers: props.maxPlayers,
  // minPlayers: props.minPlayers,
  // nameMatch: props.nameMatch,
  // nameCreatorMatch: props.nameCreatorMatch,
  // passMatch: passMatch
  // const history = useHistory();
  let locationOfState = useLocation();
  let objectState = locationOfState.state;
  // console.log(objectState)
  
  let user = JSON.parse(localStorage.getItem('user'));
  const nameUser = user.userlogin;
  //const [startMatchResponse, setStartMatchResponse] = useState({});
  //const [resultMatchResponse, setResultMatchResponse] = useState({});
  //Funcion que filtra de todos las partidas con usuarios unidos a los que
  //se necesitan de la partida actual en la que me encuentro
  
  const [dataSocket] = useState({
    matchId: objectState.matchID,
    robotId: objectState.robotID,
    tkn: user.token,
    minPlayersNeeded: objectState.minPlayers,
    joined: objectState.joined,
    nameCreatorMatch: objectState.nameCreatorMatch
  })
  

  
  const handleInitMatch = async () => {
    await iniciarPartida({id_match: dataSocket.matchId, token: user.token})
    .then( response => {
      if(response.state === 'OK'){
        swal({text: 'Ganador: ' + response.data.ganador,icon: 'success'});
      } else {
        swal({text: 'ERROR',icon: 'error'});
      }
    }); 
  };
  const isCreatorOfMatch = (user, dataOfuserMatch) => {
    //dataOfuserMatch, nameCreatorMatch: "loco:ivanpereyra6654@gmail.com"
    let username = dataOfuserMatch.split(":")[0];
    let email = dataOfuserMatch.split(":")[1];
    return (user === username || user === email);
  }

  // Construccion del socket y comunicacion establecida
  const ws = useRef(null);
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/match/${dataSocket.matchId}/${dataSocket.tkn}/${dataSocket.robotId}`);
    ws.current = socket;
  }, [dataSocket])

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
const addRobotMatchInLocalStorage = (matchID, robotID, user) => {
  //Actualizar LocalStorage de los robots en la partida solo sobre el usuario
  //Debe estar dentro de un condicional que aseguro que no se repite valores
  // user son usuarios unidos
  //Problema de un espacio, que hace false la igualdad, ej.:"k" !== " k"
  // lo soluciona el trim que esta en el user del que proviene el parametro
  if(user === nameUser) {
    if(localStorage.getItem('robotsMatchs')) {
      let listRobotsMatchs = JSON.parse(localStorage.getItem('robotsMatchs'));
      listRobotsMatchs.push({
        matchId: matchID,
        robotId: robotID,
        user: user
      });
      localStorage.setItem('robotsMatchs',
      JSON.stringify(listRobotsMatchs));     
    } else {
      localStorage.setItem('robotsMatchs',JSON.stringify([{
        matchId: matchID,
        robotId: robotID,
        user:user
      }]));
    }
  }
}
const removeRobotMatchInLocalStorage = (matchID) => {
  //Actualizar LocalStorage de los robots en la partida
  //Debe estar dentro de un condicional que aseguro que no se repite valores
  if(localStorage.getItem('robotsMatchs')) {
    let listRobotsMatchs = JSON.parse(localStorage.getItem('robotsMatchs'));
    let filtredRobotsMatchs = listRobotsMatchs.filter(elem =>
                                  elem.matchId !== matchID)
    localStorage.setItem('robotsMatchs',
    JSON.stringify(filtredRobotsMatchs));
  }
}

const isUserJoinAdded = (idJoinMatch, userName, robotName,
  listUsersJoin) => {
    let result = false;
    let value = listUsersJoin.findIndex(elem => elem.matchId === idJoinMatch && elem.name === userName && elem.robot === robotName)
    if(-1 !== value)
      result = true;
    return result;
};
//Almacenamiento de los usuarios que se van uniendo
const addUserJoin = (idJoinMatch, userName, robotName) => {

  let usersJoinLocalStorage = [];
  if(localStorage.getItem('usersJoin')) {
    usersJoinLocalStorage = JSON.parse(localStorage.getItem('usersJoin'));
  }
  if(Array.isArray(usersJoinLocalStorage) && usersJoinLocalStorage.length) {
      if(!isUserJoinAdded(idJoinMatch, userName, robotName, usersJoinLocalStorage)) {
        usersJoinLocalStorage.push({
          matchId : idJoinMatch,
          name : userName,
          robot : robotName,
        });
        localStorage.setItem('usersJoin',
        JSON.stringify(usersJoinLocalStorage));
        //Sobre robot en la partida del usuario
        addRobotMatchInLocalStorage(idJoinMatch, dataSocket.robotId, userName);
      }
  } else {
      localStorage.setItem('usersJoin', JSON.stringify([{
        matchId : idJoinMatch,
        name : userName,
        robot : robotName,
      }]));
      addRobotMatchInLocalStorage(idJoinMatch, dataSocket.robotId, userName);
  }
}



const removeUserJoin = (idJoinMatch, userName, robotName) => {
  let usersJoinLocalStorage = [];
  if(localStorage.getItem('usersJoin')) {
    usersJoinLocalStorage = JSON.parse(localStorage.getItem('usersJoin'));
    if(Array.isArray(usersJoinLocalStorage)
    && usersJoinLocalStorage.length) {
      if(isUserJoinAdded(idJoinMatch, userName, robotName, usersJoinLocalStorage)) {
        // elem.matchId === idJoinMatch && elem.name === userName && elem.robot === robotName
        let filtredArray = usersJoinLocalStorage.filter(elem => elem.matchId !== idJoinMatch || elem.name !== userName || elem.robot !== robotName)
        localStorage.setItem('usersJoin', JSON.stringify(filtredArray));
        removeRobotMatchInLocalStorage(idJoinMatch);
      }
    }
  }
}

const handleMessageJoin = (message) => {
// "join":"usuario:robot, usuario:robot"
let listMessage = message.split(",")
for(let element of listMessage) {
  let user = element.split(":")[0];
  let robot = element.split(":")[1];
  addUserJoin(dataSocket.matchId, user.trim(), robot.trim())
}
}

const handleMessageLeave = (message) => {
  let user = message.split(":")[0];
  let robot = message.split(":")[1];
  removeUserJoin(dataSocket.matchId, user.trim(), robot.trim())
}

const handleOutMatch = () => {
  localStorage.removeItem('usersJoin');
  setUsersJoin([]);
  ws.current.send(JSON.stringify({"connection": "close"}));
  setSocketDisconnect(true);
  
}

  useEffect(() => {

  
    //usamos onopen para esta seguro que hay una conexion que esta escuchando
    //el msj que vamos a enviar

  ws.current.onopen = () => {

      ws.current.onmessage = (e) => {
        if(e.data) {
          let objResponse = JSON.parse(e.data)
          if(objResponse.join) {
            handleMessageJoin(objResponse.join);
            setUsersJoinChange(true);
          } else if(objResponse.leave) {
            handleMessageLeave(objResponse.leave);
            setUsersJoinChange(true);
          } else {
            alert(JSON.parse(e.data).status);
            //Cerrada - loco:default1 => estoy unido a la partida
            // esto pasa pues al salir del componente el socket se cierra
            // y al volver a conectarse salta esto, si eres el creador
            // de la partida sino sale esto
            // Cerrada - El usuario ya esta en la partida
            // ws.current.close();/////////////////////////cierro socket
            // setGoHome(true);
          }
        }
      }
    }// eslint-disable-next-line
  }, [socketDisconnect, dataSocket, nameUser])

useEffect(() => {
              // Me da info si se cerro la conexion del websocket
              ws.current.onclose = (event) =>
              {
                  alert('Onclose called' + JSON.stringify(event, Object.getOwnPropertyNames(event)));
                  // alert('code is' + event.code);
                  // alert('reason is ' + event.reason);
                  // alert('wasClean  is' + event.wasClean);
              }
}, [])

////////////////////////////////////////////////////////////////////////////////
useEffect(() => {

  const filtredUsersJoinOfMatch = (idJoinMatch, listUsersJoin) => {
      let filtredArray = listUsersJoin.filter(elem => elem.matchId === idJoinMatch)
      return filtredArray;
  }

  let usersJoinLocalStorage = [];
  if(localStorage.getItem('usersJoin')) {
    usersJoinLocalStorage = JSON.parse(localStorage.getItem('usersJoin'));
    if(Array.isArray(usersJoinLocalStorage) && usersJoinLocalStorage.length) {
      setUsersJoin(filtredUsersJoinOfMatch(dataSocket.matchId, usersJoinLocalStorage));
      setUsersJoinChange(false);
    }
  } 
  
  return () => {
    setUsersJoinChange(false);
  }
}, [usersJoinChange, dataSocket])
//////////////////////////////////////////////////////////////////////////////  
useEffect(() => {
  if(socketDisconnect) {
    setStateOfMatch("Unirse");
  } else {
    if(usersJoin.length && usersJoin.length === dataSocket.minPlayersNeeded) {
      setStateOfMatch("Esperando Inicio");
    }
  }
}, [socketDisconnect, usersJoin, dataSocket])
////////////////////////////////////////////////////////////////////////////////
useEffect(() => {
  //Actualizar LocalStorage de la partida sobre su estado
  if(localStorage.getItem('stateMatchs')) {
      let listStateMatchs = JSON.parse(localStorage.getItem('stateMatchs'));
      let listUpdateStateMatchs = listStateMatchs.filter(element =>
                                      element.matchId !== dataSocket.matchId);
      listUpdateStateMatchs.push({
        matchId: dataSocket.matchId,
        state: stateOfMatch
      });
      localStorage.setItem('stateMatchs',
      JSON.stringify(listUpdateStateMatchs));     
  } else {
      localStorage.setItem('stateMatchs',JSON.stringify([{
        matchId: dataSocket.matchId,
        state: stateOfMatch
      }]));
  }
}, [stateOfMatch, dataSocket])
////////////////////////////////////////////////////////////////////////////////



  const ListUserJoin = () => {
    return (
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {(Array.isArray(usersJoin) && usersJoin.length) &&
        usersJoin.map((elem, index) => 
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar alt="User avatar" src="#" />
            </ListItemAvatar>
            <ListItemText primary={elem.name} secondary={elem.robot} />
          </ListItem>
        )}
      </List>
    );
  }

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ flex: 0 }} />
          <Button
            variant="h6"
            underline="none"
            color="inherit"
            sx={{ fontSize: 24}} >
            {nameUser}
          </Button>
          {!socketDisconnect &&           
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="button"
              underline="none"
              sx={rightLink} >
              {objectState.nameMatch}
              Estado: {stateOfMatch}
            </Button>
            {!isCreatorOfMatch(nameUser , dataSocket.nameCreatorMatch) &&
              <Button
                variant="button"
                underline="none"
                onClick={handleOutMatch}
                sx={rightLink} >
                  {'Abandonar Partida'}
              </Button>
            }
            {isCreatorOfMatch(nameUser , dataSocket.nameCreatorMatch) &&
              <Button
                variant="button"
                underline="none"
                onClick={handleInitMatch}
                sx={rightLink} >
                {'Iniciar Partida'}
              </Button>
            }
          </Box>
          }
        </Toolbar>
      </AppBar>
      <Typography variant="h3" component="h4">
        {stateOfMatch}
      </Typography>
      <ListUserJoin/>
      <Switch> 
            <Route exact path="/home" component={HomepageLogin} />
      </Switch>
    </div>
  )
}

export default Lobby;
