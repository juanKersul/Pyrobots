import {sendDataSimulation, modifyDataRound, addRobot, removeRobot} from '../../store/simulation/actions';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React, { useEffect, useState } from "react";
import {listRobots} from './serviceSimulation';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import { useHistory } from 'react-router-dom';
import List from '@mui/material/List';
import {connect} from 'react-redux';

function CheckRobots({addRobot, removeRobot}){
  const [lista, setLista] = useState([]); 
  const [checkList, setCheckList] = useState([]);

  useEffect(() => {
    listRobots().then(listaRobots => {
      setLista(listaRobots);
      setCheckList(Array.from({length: listaRobots.length}, () => false));
    });
  }, []);

  const checkedChange = (i) => {
    setCheckList(checkList.map((value, j) => (j === i)? !checkList[i] : value));
    if(!checkList[i]) addRobot(lista[i].id);
    else removeRobot(lista[i].id);
  };

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {lista.map((value, i) => ( 
                <ListItem key={value.name} disablePadding>
                  <ListItemButton onClick={() => checkedChange(i)} dense>
                    <ListItemIcon>
                      <Checkbox edge="start" checked={checkList[i]} tabIndex={-1} disableRipple
                        inputProps={{ 'aria-labelledby': `checkbox-list-label-${value.name}` }}/>
                    </ListItemIcon>
                    <ListItemText id={ `checkbox-list-label-${value.name}`} primary={`Robot: ${value.name}`} />
                  </ListItemButton>
                </ListItem>
            ))}
          </List>
  );
}

function CreateSimulation({sendDataSimulation, modifyDataRound, addRobot, removeRobot, callback}) {
  return (
    <div className="login-page">
      <div className="form">
        <form className="register-form">
          
          <input type="number" name="n_rounds_simulations" placeholder="Cantidad de rondas" 
          onChange={(e) => modifyDataRound(e.target.value)} min="1" max="10000" required />

          <p>Robots que combatirán</p>
          <CheckRobots addRobot= {addRobot} removeRobot= {removeRobot}/>
          
          <input type="button" value="Ejecutar partida" onClick={() => sendDataSimulation(callback)}/>
        </form>
        </div>
    </div>
  );
}

function PageSimulation({sendDataSimulation, modifyDataRound, addRobot, removeRobot}){
  const [sendData, setSendData] = useState(false);  
  const history = useHistory();
  useEffect(() => {
    if (sendData) history.push('/simulacion');
  }, [sendData, history]);

  return <CreateSimulation sendDataSimulation= {sendDataSimulation} 
                                            modifyDataRound={modifyDataRound} 
                                            addRobot={addRobot} 
                                            removeRobot={removeRobot}
                                            callback= {setSendData}/>;
}

export default connect(null, {sendDataSimulation, modifyDataRound, addRobot, removeRobot})(PageSimulation);