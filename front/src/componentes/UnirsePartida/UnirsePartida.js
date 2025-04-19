import { Button, Box, Modal, MenuItem, InputLabel, FormControl, TextField, Typography } from '@mui/material';
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
                <InputLabel 
                    id="demo-simple-select-label"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                    Seleccione su Robot
                </InputLabel>
                <Select
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.09)',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '& .MuiSvgIcon-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                        },
                        color: 'white',
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedRobotID}
                    label="Robot"
                    onChange={handleChange}
                    variant="outlined"
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
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: '#333',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: 'white', mb: 2 }}>
                      { joined ? 'Ir al Lobby' : 'Unirse a la Partida' }
                    </Typography>
                    {passRequired &&
                        <TextField
                            required
                            id="standard-password-input"
                            label="Password Match"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined"
                            InputLabelProps={{
                                sx: { color: 'rgba(255, 255, 255, 0.7)' },
                            }}
                            InputProps={{
                                sx: { 
                                    color: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.09)',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.23)',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                            value = {passMatch}
                            onChange = {onChangePasswordMatch}
                            fullWidth
                        />
                    }
                    {
                        !joined &&
                        <SelectRobot
                            selectedRobotID = {selectedRobotID}
                            setSelectedRobotID = {setSelectedRobotID}
                        />
                    }
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleClose}
                            sx={{ 
                                color: 'rgba(255, 255, 255, 0.7)', 
                                borderColor: 'rgba(255, 255, 255, 0.23)',
                                '&:hover': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                    bgcolor: 'rgba(255, 255, 255, 0.08)'
                                }
                            }}
                        >
                            Cerrar
                        </Button>
                        <Button variant="contained" onClick={handleCloseToLobby}>
                            {
                                joined ?
                                'Ir al Lobby':
                                'Unirse'
                            }
                        </Button>
                    </Box>
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