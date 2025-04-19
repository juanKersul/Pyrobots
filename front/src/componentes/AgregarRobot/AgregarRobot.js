import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { sendDataRobot, modifyName, modifyAvatar, modifyConfig } from '../../store/robots/actions';
import IdeEditor from '../IdeEditor';
import { API, endpoints, getToken, alertSwal } from '../../store/api';
import swal from 'sweetalert';
import { serviceUpdateRobot } from '../../store/robots/serviceRobots';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

// Robot statistics component - extracts stats from robot code
const RobotStats = ({ code }) => {
  const [stats, setStats] = useState({
    hasValidStructure: false,
    methodCount: 0,
    offensiveMoves: 0,
    defensiveMoves: 0,
    scannerUsage: 0,
    movementCommands: 0,
  });
  
  // Update stats whenever code changes
  useEffect(() => {
    const newStats = analyzeRobotCode(code);
    setStats(newStats);
  }, [code]);
  
  return (
    <div style={{ border: '1px solid #444', padding: '15px', marginTop: '20px', borderRadius: '5px' }}>
      <h2>Estadísticas del Robot</h2>
      {stats.hasValidStructure ? (
        <div>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li>Métodos Definidos: {stats.methodCount}</li>
            <li>Comandos Ofensivos: {stats.offensiveMoves}</li>
            <li>Comandos Defensivos: {stats.defensiveMoves}</li>
            <li>Uso de Escáner: {stats.scannerUsage}</li>
            <li>Comandos de Movimiento: {stats.movementCommands}</li>
          </ul>
        </div>
      ) : (
        <p style={{ color: '#dc3545' }}>Estructura de código inválida. Verifica que tu robot extienda la clase Robot y tenga los métodos requeridos.</p>
      )}
    </div>
  );
};

// Function to validate and analyze robot code
const analyzeRobotCode = (code) => {
  // Default stats object
  const stats = {
    hasValidStructure: false,
    methodCount: 0,
    offensiveMoves: 0,
    defensiveMoves: 0,
    scannerUsage: 0,
    movementCommands: 0,
  };

  // Check if code contains required elements
  const hasRobotClass = code.includes('class') && code.includes('(Robot)');
  const hasInitializeMethod = code.includes('def initialize(self)');
  const hasRespondMethod = code.includes('def respond(self)');
  
  stats.hasValidStructure = hasRobotClass && hasInitializeMethod && hasRespondMethod;
  
  // Count custom methods (excluding initialize and respond)
  const methodMatches = code.match(/def\s+\w+\s*\([^)]*\)/g) || [];
  stats.methodCount = methodMatches.length;
  
  // Count offensive moves
  const offensivePatterns = ['self.cannon', 'self.fire'];
  stats.offensiveMoves = countPatternOccurrences(code, offensivePatterns);
  
  // Count defensive moves
  const defensivePatterns = ['self.shield', 'self.evade'];
  stats.defensiveMoves = countPatternOccurrences(code, defensivePatterns);
  
  // Count scanner usage
  const scannerPatterns = ['self.scan', 'self.scanned', 'self.point_scanner', 'self.get_direction'];
  stats.scannerUsage = countPatternOccurrences(code, scannerPatterns);
  
  // Count movement commands
  const movementPatterns = ['self.drive'];
  stats.movementCommands = countPatternOccurrences(code, movementPatterns);
  
  return stats;
};

// Helper function to count occurrences of multiple patterns
const countPatternOccurrences = (text, patterns) => {
  return patterns.reduce((count, pattern) => {
    const regex = new RegExp(pattern, 'g');
    const matches = text.match(regex) || [];
    return count + matches.length;
  }, 0);
};

const AvatarUploader = ({ modifyAvatar, previewUrl }) => (
  <div style={{ border: '1px solid #444', padding: '15px', borderRadius: '5px' }}>
    <h2>Avatar del Robot</h2>
    {previewUrl && (
      <div style={{ marginBottom: '15px', textAlign: 'center' }}>
        <p>Avatar actual:</p>
        <img 
          src={previewUrl} 
          alt="Vista previa del avatar" 
          style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '5px', marginBottom: '10px' }} 
        />
      </div>
    )}
    <input
      style={{ display: 'block', margin: '10px 0' }}
      type="file"
      multiple={false}
      accept="image/*"
      name="avatar"
      onChange={(e) => modifyAvatar(e.target.files[0])}
    />
  </div>
);

// Function to create a file blob from code string
const createFileFromCode = (code, filename) => {
  const blob = new Blob([code], { type: 'text/plain' });
  const file = new File([blob], filename, { type: 'text/plain' });
  return file;
};

// Function to upload robot to backend
const uploadRobotToBackend = async (codeFile, avatarFile, robotName) => {
  const files = new FormData();
  files.append('config', codeFile);
  files.append('avatar', avatarFile);
  
  try {
    const response = await API.post(endpoints.uploadRobot, files, {
      params: {
        name: robotName,
        tkn: getToken()
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    });
    
    swal({
      text: response.data.msg,
      icon: 'success',
      timer: '1800'
    });
    
    return true;
  } catch (error) {
    let message = "Error al guardar el robot";
    
    if (error.response) {
      if (error.response.status === 409) {
        message = "El robot ya existe";
      } else if (error.response.status === 422) {
        message = "El archivo no cumple con los requisitos";
      } else if (error.response.status === 400 || error.response.status === 404) {
        message = "Error de sesión, por favor vuelva a iniciar sesión";
      }
    }
    
    swal({
      text: message,
      icon: 'error',
      timer: '2500'
    });
    
    return false;
  }
};

const UserRobotCreate = ({ sendDataRobot, modifyName, modifyAvatar, modifyConfig }) => {
  console.log("--- UserRobotCreate Component Rendered ---");

  // Get URL search parameters outside useEffect
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const isEdit = urlParams.get('edit') === 'true';
  const id = urlParams.get('id'); // Now 'id' is defined in the component scope

  // Updated initial code example
  const initialCode = `from routers.robot.robot_class import Robot

class default1(Robot):
    def initialize(self):
        pass

    def respond(self):
        direction = self.get_direction()
        distance = self.scanned()
        if(direction == 0):
            self.drive(90, 50)
            self.point_scanner(90, 5)
            if(distance < 1500):
                self.cannon(0, distance)
        elif(direction == 90):
            self.drive(180, 50)
            self.point_scanner(180, 5)
            if(distance < 1500):
                self.cannon(90, distance)
        elif(direction == 180):
            self.drive(270, 50)
            self.point_scanner(270, 5)
            if(distance < 1500):
                self.cannon(180, distance)
        elif(direction == 270):
            self.drive(0, 50)
            self.point_scanner(0, 5)
            if(distance < 1500):
                self.cannon(270, distance)
        else:
            self.drive(0, 50)
`;

  const [robotCode, setRobotCode] = useState(initialCode);
  const [isValidRobot, setIsValidRobot] = useState(true);
  const [robotName, setRobotName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [robotId, setRobotId] = useState(null);
  const [pageTitle, setPageTitle] = useState('Crear Robot');

  // Fetch robot data when in edit mode
  useEffect(() => {
    console.log("--- useEffect Hook Executed ---");

    console.log(`useEffect - isEdit: ${isEdit}, id: ${id}`);

    if (isEdit && id) {
      console.log("Modo edición activado para robot ID:", id);
      setIsEditMode(true);
      setRobotId(id);
      setPageTitle('Editar Robot');

      const fetchRobotDataForEdit = async () => {
        try {
          const currentToken = getToken();
          if (!currentToken) {
            throw new Error("No authentication token found.");
          }

          console.log("1. Solicitando lista de robots...");
          const listResponse = await API.get(endpoints.listRobots, {
            // Assuming listRobots now expects token in header based on other calls
            // headers: { 'Authorization': `Bearer ${currentToken}` }  <-- REVERT THIS
            // If it still uses query param: params: { token: currentToken } <-- USE THIS INSTEAD
            params: { token: currentToken }
          });

          if (!listResponse.data || !Array.isArray(listResponse.data)) {
            throw new Error("Failed to fetch or invalid robot list format.");
          }

          console.log("Lista de robots recibida, buscando ID:", id);
          // Find the robot by ID (ensure type consistency, ID from URL is string)
          const robotFromList = listResponse.data.find(robot => robot.id.toString() === id);

          if (!robotFromList) {
            throw new Error(`Robot with ID ${id} not found in the list.`);
          }

          console.log("Robot encontrado en la lista:", robotFromList);

          // Set Name
          const cleanName = robotFromList.name.includes('_') ? robotFromList.name.split('_')[0] : robotFromList.name;
          setRobotName(cleanName);
          modifyName(cleanName);

          // Set initial avatar preview from list data if available (e.g., if list includes base64 image)
          if (robotFromList.image) { // Assuming list might contain 'image' as base64
             setAvatarPreview(`data:image/png;base64,${robotFromList.image}`);
             console.log("Vista previa del avatar establecida desde la lista.");
          }

          // Fetch Code and Image in parallel
          console.log("2. Solicitando código e imagen para el robot ID:", id);
          const [codeResponse, imageResponse] = await Promise.all([
            API.get(endpoints.getRobotCode, {
              // Pass token and robot_id as query params as per original service
              params: { token: currentToken, robot_id: id }
            }),
            API.get(endpoints.imageRobot, {
              // Pass token and robot_id as query params as per original service
              params: { token: currentToken, robot_id: id }
            })
          ]);

          // Process Code
          if (codeResponse.data) {
            console.log("Código recibido, longitud:", codeResponse.data.length);
            setRobotCode(codeResponse.data);
            modifyConfig(codeResponse.data);
          } else {
            console.warn("La respuesta de código no contiene datos, usando fallback.");
            setRobotCode(initialCode.replace('default1', cleanName));
            modifyConfig(initialCode.replace('default1', cleanName));
          }

          // Process Image (overwrites preview from list if image service returns something)
          if (imageResponse.data) {
             // Assuming imageResponse.data is base64 string
             const imageUrl = `data:image/png;base64,${imageResponse.data}`;
             setAvatarPreview(imageUrl);
             console.log("Vista previa del avatar actualizada desde el servicio de imagen.");
          } else {
             console.warn("La respuesta de imagen no contiene datos.");
             // Keep preview from list if image service fails, or set null if neither had it
             if (!robotFromList.image) setAvatarPreview(null);
          }

          console.log("Datos del robot (nombre, código, avatar) cargados para edición.");

        } catch (error) {
          console.error("Error al cargar datos del robot para edición:", error);
          let errorMsg = error.message || "Error desconocido al cargar datos del robot.";

          if (axios.isAxiosError(error) && error.response) {
             console.error("Detalles del error de API:", {
                 status: error.response.status,
                 data: error.response.data,
                 config: error.config // Log request config too
             });
             errorMsg = `Error ${error.response.status}: ${error.response.data?.detail || error.message}`;
             if (error.response.status === 401 || error.response.status === 403) {
                 errorMsg = "Sesión inválida o expirada.";
             } else if (error.response.status === 404) {
                 // Check which request failed if possible from error.config.url
                 errorMsg = `Recurso no encontrado (${error.config.url}).`;
             }
          } else if (!axios.isCancel(error)) {
             // Handle non-API errors or non-response errors
             console.error("Error no relacionado con API o sin respuesta:", error);
          }

          swal({
            title: "Error al Cargar Robot",
            text: errorMsg,
            icon: "error"
          }).then(() => {
             if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 403 || error.message.includes("not found")) {
                window.location.href = "/"; // Redirect on critical errors
             }
          });
          // Fallback to initial state
          setRobotCode(initialCode);
          modifyConfig(initialCode);
          setRobotName('');
          modifyName('');
          setAvatarPreview(null);
        }
      };

      fetchRobotDataForEdit();
    } else {
        console.log("useEffect - Modo creación o sin ID");
        // Set initial state for CREATE mode
        setRobotCode(initialCode);
        modifyConfig(initialCode); // Update Redux store if needed
        setRobotName(''); // Clear name for creation mode
        modifyName(''); // Clear Redux name
        setAvatarPreview(null); // Clear avatar preview
        setIsEditMode(false);
        setRobotId(null);
        setPageTitle('Crear Robot');
    }
    // Dependencies: Include things that, if changed, should trigger refetch/reset
    // 'id' and 'isEdit' are now stable within this render cycle, but including them clarifies dependencies
  }, [initialCode, modifyConfig, modifyName, id, isEdit]);

  // Validate code whenever it changes
  useEffect(() => {
    const stats = analyzeRobotCode(robotCode);
    setIsValidRobot(stats.hasValidStructure);
  }, [robotCode]);

  const handleCodeChange = (value) => {
    setRobotCode(value);
    modifyConfig(value);
  };

  const handleNameChange = (value) => {
    setRobotName(value);
    modifyName(value);
  };

  const handleAvatarChange = (file) => {
    setAvatar(file);
    modifyAvatar(file);
    
    // Crear una URL para previsualizar la imagen
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSave = async () => {
    if (!isValidRobot) {
      swal({
        text: 'El código del robot no es válido. Verifica que tenga la estructura correcta.',
        icon: 'error',
        timer: '2500'
      });
      return;
    }

    if (!robotName.trim()) {
      swal({
        text: 'Por favor, ingresa un nombre para tu robot.',
        icon: 'error',
        timer: '2500'
      });
      return;
    }
    
    console.log(`${isEditMode ? 'Actualizando' : 'Guardando'} Robot...`);
    
    // Crear archivo con el código del robot
    const filename = `${robotName.trim()}.py`;
    const codeFile = createFileFromCode(robotCode, filename);
    
    if (isEditMode) {
      // Usar el servicio real de actualización en lugar de la simulación
      swal({
        title: "Actualizando robot",
        text: "Actualizando robot en el servidor...",
        icon: "info",
        buttons: false,
        closeOnClickOutside: false,
      });
      
      // Preparar los datos del robot para la actualización
      const robotData = {
        name: robotName,
        config: codeFile,
        avatar: avatar // Puede ser null si no se cambió
      };
      
      // Llamar al servicio de actualización
      const result = await serviceUpdateRobot(robotData, robotId);
      
      if (result.success) {
        // Redirigir a la lista de robots después de un corto tiempo
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } else {
      // Crear un nuevo robot
      const success = await uploadRobotToBackend(codeFile, avatar, robotName);
      
      if (success) {
        // Redirigir a la lista de robots
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    }
  };

  const handleTest = () => {
    if (!isValidRobot) {
      swal({
        text: 'El código del robot no es válido. Verifica que tenga la estructura correcta.',
        icon: 'error',
        timer: '2500'
      });
      return;
    }
    
    swal({
      title: "Probando robot",
      text: "Esta función aún no está implementada completamente.",
      icon: "info",
    });
  };

  return (
    <div id="create-robot-container" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>{pageTitle}</h1>
        <div>
          <button 
            onClick={handleSave} 
            style={{ 
              marginRight: '10px', 
              padding: '8px 15px', 
              cursor: 'pointer',
              backgroundColor: isValidRobot ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {isEditMode ? 'Actualizar' : 'Guardar'}
          </button>
          <button 
            onClick={handleTest} 
            style={{ 
              padding: '8px 15px', 
              backgroundColor: isValidRobot ? '#28a745' : '#6c757d', 
              color: 'white', 
              border: 'none', 
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Probar
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Left Column */}
        <div style={{ flex: '2' }}>
          <div id="input-nombre-robot" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nombre del Robot</label>
            <input
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
              type="text"
              placeholder="Ingresa un nombre para tu robot"
              name="nameValue"
              value={robotName}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          {/* Removed Tabs Container - Only Editor remains */}
          <IdeEditor code={robotCode} onCodeChange={handleCodeChange} />
          
          {!isValidRobot && (
            <div style={{ marginTop: '10px', color: '#dc3545' }}>
              ⚠️ El código no tiene la estructura correcta de un robot. Debe extender la clase Robot y tener los métodos initialize y respond.
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ flex: '1' }}>
          <AvatarUploader modifyAvatar={handleAvatarChange} previewUrl={avatarPreview} />
          <RobotStats code={robotCode} />
        </div>
      </div>
    </div>
  );
}

export default connect(null, { sendDataRobot, modifyName, modifyAvatar, modifyConfig })(UserRobotCreate);