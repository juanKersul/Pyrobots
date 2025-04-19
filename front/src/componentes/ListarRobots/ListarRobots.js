import {
    robotListUser,
    getImageRobotsAndSaveInListImage,
    getRobotType,
    getTypeColor,
    generateBattleStats
} from './auxiliares.js';
import {getDataRobotsUser, getImageRobotsUser} from '../../store/robots/actions';
import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import './ListarRobots.css';
import { Link } from 'react-router-dom';

// Componente para cada tarjeta de robot
const RobotCard = ({ robot, onEdit, onBattle }) => {
    const robotType = robot.type || getRobotType(robot);
    const typeColor = robot.color || getTypeColor(robotType);
    const stats = robot.ratio ? robot : generateBattleStats(robot);
    
    return (
        <div className="robot-card">
            <div className="robot-header">
                <h3>{robot.name}</h3>
                <button className="menu-button">⋮</button>
            </div>
            <div className="robot-type" style={{ backgroundColor: typeColor }}>
                {robotType}
            </div>
            <div className="robot-avatar" style={{ backgroundColor: typeColor }}>
                {robot.image && <img src={`data:image/png;base64,${robot.image}`} alt={robot.name} />}
            </div>
            <div className="robot-stats">
                <div className="stat">
                    <span>Victorias</span>
                    <span className="win-count">{stats.wins}</span>
                </div>
                <div className="stat">
                    <span>Derrotas</span>
                    <span className="loss-count">{stats.losses}</span>
                </div>
                <div className="stat">
                    <span>Ratio</span>
                    <span className="ratio">{stats.ratio}%</span>
                </div>
            </div>
            <div className="robot-actions">
                <button className="edit-button" onClick={() => onEdit(robot)}>
                    <i className="fas fa-pencil-alt"></i> Editar
                </button>
                <button className="battle-button" onClick={() => onBattle(robot)}>
                    <i className="fas fa-bolt"></i> Batalla
                </button>
            </div>
        </div>
    );
};

// Componente principal para listar robots
function ListarRobots({getDataRobotsUser, getImageRobotsUser}){
    const [robots, setRobots] = useState([]);
    const [filteredRobots, setFilteredRobots] = useState([]);
    const [responseDataRobot, setResponseDataRobot] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Todos');
    const [sortOrder, setSortOrder] = useState('Más recientes');
    const [isLoading, setIsLoading] = useState(true);
    
    // Cargar datos de robots
    useEffect(() => {
        if(responseDataRobot) {
            const robotList = robotListUser();
            console.log("Robots obtenidos:", robotList);
            
            if (robotList && Array.isArray(robotList)) {
                // Procesar robots para añadir imagen y otras propiedades
                getImageRobotsAndSaveInListImage(robotList, getImageRobotsUser, setProcessedRobots);
            } else {
                setIsLoading(false);
            }
        }
        else {
            console.log("Solicitando datos de robots...");
            getDataRobotsUser(setResponseDataRobot);
        }
    }, [responseDataRobot, getDataRobotsUser, getImageRobotsUser]);
    
    // Procesar robots después de obtener sus imágenes
    const setProcessedRobots = (processedRobots) => {
        setRobots(processedRobots);
        setFilteredRobots(processedRobots);
        setIsLoading(false);
    };
    
    // Filtrar robots según término de búsqueda y tipo
    useEffect(() => {
        if (robots.length > 0) {
            let filtered = robots;
            
            // Filtrar por término de búsqueda
            if (searchTerm) {
                filtered = filtered.filter(robot => 
                    robot.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            // Filtrar por tipo
            if (filterType !== 'Todos') {
                filtered = filtered.filter(robot => 
                    getRobotType(robot) === filterType
                );
            }
            
            // Ordenar robots
            if (sortOrder === 'Más victorias') {
                filtered = [...filtered].sort((a, b) => 
                    (b.matchs_won || 0) - (a.matchs_won || 0)
                );
            } else if (sortOrder === 'Mejor ratio') {
                filtered = [...filtered].sort((a, b) => {
                    const ratioA = a.matchs_pleyed ? (a.matchs_won / a.matchs_pleyed) : 0;
                    const ratioB = b.matchs_pleyed ? (b.matchs_won / b.matchs_pleyed) : 0;
                    return ratioB - ratioA;
                });
            }
            
            setFilteredRobots(filtered);
        }
    }, [searchTerm, filterType, sortOrder, robots]);
    
    // Manejar la edición de un robot
    const handleEditRobot = (robot) => {
        console.log("Editar robot:", robot);
        // Aquí se implementaría la navegación a la página de edición
    };
    
    // Manejar el inicio de una batalla con un robot
    const handleBattleRobot = (robot) => {
        console.log("Iniciar batalla con robot:", robot);
        // Aquí se implementaría la navegación a la página de batalla
    };
    
    // Contar robots activos (simulado para el ejemplo)
    const activeRobots = filteredRobots.length > 0 ? Math.ceil(filteredRobots.length * 0.7) : 0;
    
    return (
        <div className="robots-container">
            <div className="robots-header">
                <div className="title-section">
                    <h1>Mis Robots</h1>
                    <p>Gestiona y mejora tus robots de combate</p>
                </div>
                <Link to="/agregarRobot" className="create-button">
                    <i className="fas fa-plus"></i> Crear Nuevo Robot
                </Link>
            </div>
            
            <div className="robots-filters">
                <div className="search-bar">
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Buscar robots..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filter-options">
                    <div className="filter-dropdown">
                        <select 
                            value={filterType} 
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="Todos">Todos</option>
                            <option value="Ataque">Ataque</option>
                            <option value="Defensa">Defensa</option>
                            <option value="Velocidad">Velocidad</option>
                            <option value="Equilibrado">Equilibrado</option>
                        </select>
                    </div>
                    
                    <div className="sort-dropdown">
                        <select 
                            value={sortOrder} 
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="Más recientes">Más recientes</option>
                            <option value="Más victorias">Más victorias</option>
                            <option value="Mejor ratio">Mejor ratio</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="robots-status">
                <div className="robots-count">
                    <span className="count">{filteredRobots.length} Robots</span>
                    <span className="active-count">{activeRobots} Activos</span>
                </div>
                <button className="sort-button">
                    <i className="fas fa-sort"></i> Ordenar
                </button>
            </div>
            
            {isLoading ? (
                <div className="loading-container">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Cargando robots...</p>
                </div>
            ) : filteredRobots.length === 0 ? (
                <div className="no-robots">
                    <p>No se encontraron robots. ¡Crea tu primer robot!</p>
                </div>
            ) : (
                <div className="robots-grid">
                    {filteredRobots.map(robot => (
                        <RobotCard 
                            key={robot.id}
                            robot={robot}
                            onEdit={handleEditRobot}
                            onBattle={handleBattleRobot}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default connect(null, {getDataRobotsUser, getImageRobotsUser})(ListarRobots);