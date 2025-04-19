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