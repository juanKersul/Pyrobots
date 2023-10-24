import { Button, Box, Modal, MenuItem, InputLabel, FormControl, TextField } from '@mui/material';
import Select from '@mui/material/Select';
import { useHistory } from "react-router-dom";
import { useState, useEffect, useRef} from 'react';
import exportServiceListarRobots from '../Servicios/serviceListarRobots'
import swal from "sweetalert";

const SelectRobot = ({selectedRobotID, setSelectedRobotID}) => {

    const [listRobots, setListRobots] = useState([]);
    
    const handleChange = (e) => {
        setSelectedRobotID(e.target.value);
    };

    useEffect(() => {
        exportServiceListarRobots.serviceListRobots().then(listRobots => setListRobots(listRobots));
    }, [setListRobots]);
    
    return (
        <div>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Seleccione su Robot
                </InputLabel>
                <Select
                    sx={{
                        background: 'white',
                        color: 'black',
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedRobotID}
                    label="Robot"
                    onChange={handleChange}
                >
                    {
                        (Array.isArray(listRobots) && listRobots.length) ?
                        listRobots.map((robot, index) =>
                            <MenuItem key={index} value={robot.id}>
                                <em>{robot.name}</em>
                            </MenuItem>
                        )
                        :
                        <MenuItem value="">
                            <em>Debe agregar robots para poder combatir</em>
                        </MenuItem>
                    }
                </Select>
            </FormControl>
        </div>
    );
};

const InputModal = (props) => {
    const [selectedRobotID, setSelectedRobotID] = useState('');
    const [passRequired, setPassRequired] = useState(true);
    const [passMatch, setPassMatch] = useState("");
    const [joined, setJoined] = useState(false);
    const [open, setOpen] = useState(false);
    const history = useHistory();
    const state = useRef({});


    // vemos el estado para directamente darle la opcion de ir al Lobby
    useEffect(() => {
        if("Esperando Inicio" === props.stateMatch || 
        "Esperando Jugadores" === props.stateMatch) {
            setJoined(true);
            //Si ya te has unido no es necesario volver a pedir un password
            setPassRequired(false);
        }
    }, [props.stateMatch])
    
    // pasaje a Lobby con un estado
    const handleRouteLobby = () =>{
        if(joined) {
            // No se pasa el robotId pues no se deberia volver a seleccionar
            const listRobotsMatchs = 
                JSON.parse(localStorage.getItem('robotsMatchs'));
            const listOneElement = listRobotsMatchs.filter(elem =>
                elem.matchId === props.matchID)
            const OnerobotID = listOneElement[0].robotId;
            state.current = { ...props, 
                robotID: OnerobotID, 
                passMatch: passMatch,
                joined: true
            }
        } else {
            state.current = {
                ...props,
                passMatch: passMatch,
                robotID: selectedRobotID,
                joined: false
            }
        }
        
        history.push("/lobby", state.current);
    }
    
    // en caso de que la partida requiera contraseña
    // solo se mostrara si la partida requiere contraseña
    const onChangePasswordMatch = (e) => {
        setPassMatch(e.target.value)
    };
    
    const handleOpen = () => {
        if("Finalizada" !== props.stateMatch)
            setOpen(true);
    }

    // al elegir un robot y (de ser necesario un password match)
    const handleCloseToLobby = () => {
        if('' !== selectedRobotID || joined) {
            setOpen(false);
            handleRouteLobby();
        } else {
            swal({
                text: "Quiere Unirse ?, seleccione un Robot",
                icon: 'warning',
                timer: '1800'
            })
        }
    }
    
    // sino solo cerrar el modal
    const handleClose = () => {
        setOpen(false);
    }

    return (
        <form>
            <div>
            <Button onClick={handleOpen}>
                {props.stateMatch}
            </Button>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                {passRequired && 
                    <TextField
                    sx={{
                        background: 'white',
                        color: 'black',
                    }}
                    required
                    id="standard-password-input"
                    label="Password Match"
                    type="password"
                    autoComplete="current-password"
                    variant="standard"
                    value = {passMatch}
                    onChange = {onChangePasswordMatch}
                    />
                }
                {
                    !joined &&
                    <SelectRobot 
                        selectedRobotID = {selectedRobotID}
                        setSelectedRobotID = {setSelectedRobotID}
                    />
                }
                {

                }
                <Button variant="contained" onClick={handleCloseToLobby}>
                    {
                        joined ? 
                        'Ir al Lobby':
                        'Si has seleccionado a tu robot puedes ir al Lobby'
                    }
                </Button>
                <Button variant="contained" onClick={handleClose}>
                    Cerrar
                </Button>
                </Box>
            </Modal>
            </div>
        </form>
    );
}


const UnirsePartida = (props)  => {

    // Cambia el state match si espera jugadores o espera inicio
    // o ver resultados o finalizo
    const [stateMatch, setStateMatch] = useState("Unirse");
    useEffect(() => {
        if(localStorage.getItem('stateMatchs')) {
            let listStateMatchs = JSON.parse(localStorage.getItem('stateMatchs'));
            let listOfOneStateMatch = listStateMatchs.filter(element =>
                                            element.matchId === props.matchID);
            if(listOfOneStateMatch.length) {
                let objStateMatch = listOfOneStateMatch[0];
                setStateMatch(objStateMatch.state)
            }
        }
    }, [props.matchID])

    // Si tengo los datos en el localStorage me fijo si el usuario
    // esta unido entonces cambio a Esperando Jugadores o Listo para Iniciar
    
    // En el caso de ver Resultados si esta en ese estado se podria entrar
    // no en el Modal sino en algo que muestre los resultados

    return (
        <InputModal 
            matchID={props.matchID}
            maxPlayers={props.maxPlayers}
            minPlayers={props.minPlayers}
            nameMatch={props.nameMatch}
            nameCreatorMatch={props.nameCreatorMatch}
            stateMatch={stateMatch}
        />
    );
}

export default UnirsePartida;