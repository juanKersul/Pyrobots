from datetime import datetime
from pony.orm import db_session, commit, select
from models.entities import Robot, User
from crud.user_services import decode_JWT
from fastapi import UploadFile
from schemas import irobot


def validate_file(filename: str, file: UploadFile):
    """Validación de un archivo, i.e chequea extención '.py' y que el nombre del archivo sea usado dentro.

    Args:
        filename (str): Nombre de archivo a validar
        file (UploadFile): Archivo a validar

    Returns:
        bool: True en caso de que sea válido.
    """
    content = file.file.read().decode()
    is_valid = True
    if filename + ".py" != file.filename:
        is_valid = False
    if not (filename in content):
        is_valid = False
    return is_valid


@db_session
def add_robot(
    config_file: UploadFile,
    avatar_file: str,
    robot_name: str,
    user_token: str,
):
    """Agregar robot a la base de datos.

    Args:
        config_file (UploadFile): Archivo '.py' del robot.
        avatar_file (str): Imagen del robot.
        robot_name (str): Nombre del robot.
        user_token (str): Token.
        username (str): Nombre de usuario o email.

    Returns:
        str: Mensaje de retorno.
    """
    username = ""
    with db_session:
        decode_token = decode_JWT(user_token)
        vto = decode_token["expiry"]
        if not (str(vto) > str(datetime.now())) or (vto == 0):
            return "Token no válido"
        username = decode_token["userID"]
        if validate_file(robot_name, config_file):
            try:
                if avatar_file != "default.jpeg":
                    avatar_file = avatar_file[1:].split('.')
                    avatar_file[0] =  username + "_" + robot_name + '.'
                    avatar_file = "".join(avatar_file)
                Robot(
                    name=robot_name + "_" + username,
                    avatar=avatar_file,
                    matchs_pleyed=0,
                    matchs_won=0,
                    avg_life_time=0,
                    user_owner= username,
                )
                commit()
            except Exception as e:
                return str("El robot ya existe")
        else:
            return "El archivo no cumple los requisitos"
        return "Robot agregado con exito:" + username + ":" + avatar_file


@db_session
def read_robots(token: str):
    """Listar robots, consulta a la base de datos.

    Args:
        token (str): token.

    Returns:
        str: En caso de error.
        List[Robot]: Lista de robots.
    """
    with db_session:
        try:
            print(f"Starting read_robots with token: {token[:10]}...")
            decode_token = decode_JWT(token)
            print(f"Decoded token: {decode_token}")
            result = []

            if "expiry" not in decode_token or "userID" not in decode_token:
                print("Token inválido o mal formado - faltan campos")
                return "Token inválido o mal formado"
                
            if decode_token["expiry"] > str(datetime.now()):
                user_id = decode_token["userID"]
                print(f"User from token: {user_id}")
                
                # Verificar que el usuario existe en la base de datos
                try:
                    user_obj = User.get(username=user_id)
                    print(f"Found user in DB: {user_obj is not None}")
                    
                    if not user_obj:
                        return "Usuario no encontrado en la base de datos"
                    
                    # Obtener robots directamente de la relación en el usuario
                    try:
                        print(f"Getting robots through user's 'robots' relationship")
                        robots = list(user_obj.robots)
                        print(f"Found {len(robots)} robots for user {user_id}")
                        
                        # Convertir a formato de respuesta
                        result = [irobot.Robot.from_orm(r) for r in robots]
                        commit()
                    except Exception as e:
                        print(f"Error accessing user's robots: {str(e)}")
                        return f"Error al obtener robots del usuario: {str(e)}"
                except Exception as e:
                    print(f"Error finding user: {str(e)}")
                    return f"Error al buscar usuario: {str(e)}"
            else:
                print("Token expired")
                result = "Token no válido o expirado"
                
        except Exception as e:
            print(f"Top level error in read_robots: {str(e)}")
            import traceback
            print(traceback.format_exc())
            return f"Error interno: {str(e)}"
            
        return result


@db_session
def get_file_by_id(rob_id: int):
    """Obtener un archivo por su id

    Args:
        rob_id (int): id del archivo

    Returns:
        Any: Nombre del archivo del robot.
    """
    with db_session:
        robot = Robot[rob_id]
        filename = robot.name + ".py"
        return filename


@db_session
def add_default_robot(username: str):
    """Agregar robot por defecto.

    Args:
        username (str): Usuario al que agregar robot por defecto.
    """
    with db_session:
        Robot(
            name="default1" + "_" + username,
            matchs_pleyed=0,
            matchs_won=0,
            avg_life_time=0,
            user_owner=username,
            avatar = "default.jpeg"
        )
        commit()
        Robot(
            name="default2" + "_" + username,
            matchs_pleyed=0,
            matchs_won=0,
            avg_life_time=0,
            user_owner=username,
            avatar = "default.jpeg"
        )
        commit()

@db_session
def get_image_name(token,id):
    decode_token = decode_JWT(token)
    user = decode_token["userID"]
    with db_session:
        try:
            res = Robot[id]
            if (res.user_owner.username == user):
                return res.avatar
            else:
                return "default.jpeg"
        except:
            return "default.jpeg"

@db_session
def get_code_by_id(token: str, robot_id: int):
    """Obtener el código fuente de un robot por su ID.

    Args:
        token (str): Token de autenticación
        robot_id (int): ID del robot

    Returns:
        str: Código fuente del robot, o mensaje de error
    """
    print(f"\n--- DEBUG: get_code_by_id ---")
    print(f"Received robot_id: {robot_id} (Type: {type(robot_id)})")
    print(f"Received token (first 10 chars): {token[:10]}...")

    with db_session:
        try:
            decode_token = decode_JWT(token)
            print(f"Decoded token: {decode_token}")

            # Verificar si el token es válido
            if "expiry" not in decode_token or "userID" not in decode_token:
                print("DEBUG: Token invalid or malformed")
                return "Error: Token inválido o mal formado"

            if decode_token["expiry"] > str(datetime.now()):
                user = decode_token["userID"]
                print(f"Token valid. UserID: {user}")

                # Verificar que el usuario existe en la base de datos
                user_obj = User.get(username=user)
                if not user_obj:
                    print(f"DEBUG: User '{user}' not found in DB")
                    return "Error: Usuario no encontrado"
                print(f"DEBUG: User '{user}' found in DB.")

                # Buscar el robot por su ID
                try:
                    print(f"DEBUG: Attempting to fetch Robot[{robot_id}]")
                    robot = Robot[robot_id]
                    print(f"DEBUG: Robot found: {robot.to_dict() if robot else 'None'}")

                    # Verificar que el usuario es dueño del robot
                    if robot.user_owner.username != user:
                        print(f"DEBUG: Permission denied. Robot owner: {robot.user_owner.username}, Requester: {user}")
                        return "Error: No tienes permiso para acceder a este robot"
                    print(f"DEBUG: Permission granted.")

                    # Obtener el nombre del archivo del robot
                    robot_name = robot.name
                    file_path = f"routers/robots/{robot_name}.py"
                    print(f"DEBUG: Robot name from DB: {robot_name}")
                    print(f"DEBUG: Constructed file path: {file_path}")

                    # Leer el archivo
                    try:
                        print(f"DEBUG: Attempting to open file: {file_path}")
                        with open(file_path, 'r') as file:
                            code = file.read()
                            print(f"DEBUG: File read successfully. Code length: {len(code)}")
                            return code
                    except FileNotFoundError:
                         print(f"DEBUG: FileNotFoundError at path: {file_path}")
                         return f"Error: No se pudo encontrar el archivo del robot en la ruta esperada."
                    except Exception as e:
                        print(f"Error reading robot file: {e}")
                        return f"Error: No se pudo leer el archivo del robot: {e}"

                except Exception as e:
                    print(f"Error getting robot or checking permissions: {e}")
                    return "Error: Robot no encontrado o error de permisos"
            else:
                print("DEBUG: Token expired.")
                return "Error: Token expirado"
        except Exception as e:
            print(f"Error decoding JWT or during DB session: {e}")
            return f"Error general: {e}"

@db_session
def update_robot(
    config_file: UploadFile,
    avatar_file: str,
    robot_name: str,
    user_token: str,
    robot_id: int
):
    """Actualizar un robot existente en la base de datos.

    Args:
        config_file (UploadFile): Archivo '.py' actualizado del robot.
        avatar_file (str): Nombre de la imagen actualizada o None si no se cambia.
        robot_name (str): Nombre del robot (no debe cambiar).
        user_token (str): Token de autenticación.
        robot_id (int): ID del robot a actualizar.

    Returns:
        str: Mensaje de resultado.
    """
    with db_session:
        try:
            # Validar el token
            decode_token = decode_JWT(user_token)
            if "expiry" not in decode_token or "userID" not in decode_token:
                return "Token inválido o mal formado"
                
            if decode_token["expiry"] <= str(datetime.now()):
                return "Token no válido o expirado"
                
            username = decode_token["userID"]
            
            # Verificar que el usuario existe
            user = User.get(username=username)
            if not user:
                return "El usuario no existe"
            
            # Buscar el robot a actualizar
            try:
                robot = Robot[robot_id]
            except:
                return "El robot no existe"
            
            # Verificar que el usuario es dueño del robot
            if robot.user_owner.username != username:
                return "No tienes permiso para editar este robot"
            
            # Verificar que el nombre del robot a actualizar coincida
            robot_name_with_user = f"{robot_name}_{username}"
            if robot.name != robot_name_with_user:
                return f"El nombre del robot ({robot_name}) no coincide con el robot a actualizar ({robot.name.split('_')[0]})"
            
            # Validar el archivo de configuración
            if not validate_file(robot_name, config_file):
                return "El archivo no cumple los requisitos"
            
            # Actualizar avatar si se proporcionó uno nuevo
            if avatar_file:
                avatar_file = avatar_file[1:].split('.')
                avatar_file[0] = username + "_" + robot_name + '.'
                new_avatar = "".join(avatar_file)
                robot.avatar = new_avatar
            
            # No necesitamos cambiar el nombre, ya que debe ser el mismo
            
            # Guardar los cambios
            commit()
            
            return f"Robot actualizado con éxito:{username}:{robot.avatar}"
            
        except Exception as e:
            print(f"Error en update_robot: {e}")
            return f"Error al actualizar robot: {str(e)}"