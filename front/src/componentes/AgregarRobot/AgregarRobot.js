import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { sendDataRobot, modifyName, modifyAvatar, modifyConfig } from '../../store/robots/actions';
import IdeEditor from '../IdeEditor';
import { API, endpoints, getToken, alertSwal } from '../../store/api';
import swal from 'sweetalert';

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

const AvatarUploader = ({ modifyAvatar }) => (
  <div style={{ border: '1px solid #444', padding: '15px', borderRadius: '5px' }}>
    <h2>Avatar del Robot</h2>
    {/* Basic file input, can be replaced with a fancier component */}
    <input
      style={{ display: 'block', margin: '10px 0' }}
      type="file"
      multiple={false}
      accept="image/*"
      name="avatar"
      onChange={(e) => modifyAvatar(e.target.files[0])}
    />
    {/* Add image preview logic here if needed */}
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
    
    console.log("Guardando Robot...");
    console.log("Nombre:", robotName);
    console.log("Code:", robotCode);
    
    // Create a Python file from the code string
    const filename = `${robotName.trim()}.py`;
    const codeFile = createFileFromCode(robotCode, filename);
    
    // Send the code file and avatar to the backend
    await uploadRobotToBackend(codeFile, avatar, robotName);
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
    
    console.log("Probando Robot...");
    console.log("Code:", robotCode);
    // TODO: Implement testing logic (maybe send to backend?)
  };

  return (
    <div id="create-robot-container" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Crear Robot</h1>
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
            Guardar
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
          <AvatarUploader modifyAvatar={handleAvatarChange} />
          <RobotStats code={robotCode} />
        </div>
      </div>
    </div>
  );
}

export default connect(null, { sendDataRobot, modifyName, modifyAvatar, modifyConfig })(UserRobotCreate);