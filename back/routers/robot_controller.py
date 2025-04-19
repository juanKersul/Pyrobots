from fastapi import APIRouter, HTTPException, UploadFile, File
from crud import robot_service
from crud.robot_service import add_robot, get_image_name, get_code_by_id
import shutil
from typing import Optional
import base64
robot_end_points = APIRouter()


def store_config(file: UploadFile, owner: str):
    file.file.seek(0)
    new_filename = file.filename.replace(".py", "_" + owner + ".py")
    with open("routers/robots/" + new_filename, "wb+") as upload_folder:
        shutil.copyfileobj(file.file, upload_folder)


def store_avatar(file: UploadFile):
    file.file.seek(0)
    with open("routers/robots/avatars/" + file.filename, "wb+") as upload_folder:
        shutil.copyfileobj(file.file, upload_folder)


@robot_end_points.post("/upload/robot")
async def robot_upload(
    *, config: UploadFile, avatar: Optional[UploadFile] = File(None), name: str, tkn: str):
    """Cargar Robot

    Args:
        config (UploadFile): archivo del robot.
        avatar (UploadFile): imagen del robot.
        name (str): nombre del robot.
        tkn (str): token.
        username (str): nombre de usuario.

    Raises:
        HTTPException: 409: El robot ya existe.
        HTTPException: 400: El usuario no existe.
        HTTPException: 422: El nombre del Robot con el archivo no se corresponden.
        HTTPException: 440: El token no es correcto o está expirado.

    Returns:
        _type_: _description_
    """
    no_avatar = True
    if avatar != None:
        avatar_name = "P" + avatar.filename
        no_avatar = False
    else:
        avatar_name = "default.jpeg"
    msg = add_robot(config, avatar_name, name, tkn)
    # El robot ya existe
    if "ya existe" in msg:
        raise HTTPException(status_code=409, detail=msg)
    # Los nombres para el robot no se corresponden
    if "requisitos" in msg:
        raise HTTPException(status_code=422, detail=msg)
    # Token invalido o expirado
    if "Token" in msg:
        raise HTTPException(status_code=440, detail="Sesión expirada")
    # Tomamos el nombre del usuario y el nombre del archivo
    username = msg.split(":")[1]
    avatar_name = msg.split(":")[2]
    msg = msg.split(":")[0]
    store_config(config, username)
    if not no_avatar:
        avatar.filename = avatar_name
        store_avatar(avatar)
    return {"msg": msg}


@robot_end_points.get("/robots")
def read_robots(token: str):
    """Listar Robots

    Args:
        token (str): token

    Returns:
        str: Error
        List[Robots]: Lista de robots.
    """
    try:
        print(f"\n--- Endpoint /robots llamado con token: {token[:10]}... ---")
        msg = robot_service.read_robots(token)
        print(f"Resultado del servicio: {type(msg)}")
        
        if isinstance(msg, str):
            print(f"Error en formato string: {msg}")
            if "'>' not supported between instances of 'int' and 'str'" in msg:
                raise HTTPException(status_code=401, detail="No autorizado, debe logearse")
            # Si es otro mensaje de error
            raise HTTPException(status_code=500, detail=msg)
            
        print(f"Devolviendo lista de robots: {len(msg)} encontrados")
        return msg
    except Exception as e:
        # Capturar cualquier excepción no manejada
        import traceback
        error_msg = str(e)
        print(f"Error no manejado en el endpoint: {error_msg}")
        print(traceback.format_exc())
        
        status_code = 500
        if "tuple index out of range" in error_msg:
            error_msg = "Error al procesar los datos de robots. Contacte al administrador."
            
        # Verificar si 'detail' ya está en el mensaje (caso HTTPException)
        if hasattr(e, 'detail'):
            error_msg = e.detail
            
        raise HTTPException(status_code=status_code, detail=error_msg)

@robot_end_points.get("/image")
def get_image(token,robot_id):
    image_name = get_image_name(token,robot_id)
    path = "routers/robots/avatars/"+image_name
    with open(path, 'rb') as f:
        base64image = base64.b64encode(f.read())
    return base64image

@robot_end_points.get("/robot/code")
def get_robot_code(token: str, robot_id: int):
    """Obtener el código fuente de un robot

    Args:
        token (str): Token de autenticación
        robot_id (int): ID del robot

    Returns:
        str: Código fuente del robot
    """
    try:
        # Verificar que el usuario sea dueño del robot
        code = get_code_by_id(token, robot_id)
        
        if isinstance(code, str) and "error" in code.lower():
            raise HTTPException(status_code=403, detail=code)
        
        return code
    except Exception as e:
        error_msg = str(e)
        if "404" in error_msg or "not found" in error_msg.lower():
            raise HTTPException(status_code=404, detail="Robot no encontrado")
        if "403" in error_msg or "permiso" in error_msg.lower() or "autoriza" in error_msg.lower():
            raise HTTPException(status_code=403, detail="No tienes permiso para acceder a este robot")
        
        raise HTTPException(status_code=500, detail=f"Error al obtener código: {error_msg}")

@robot_end_points.put("/robot/update")
async def robot_update(
    *, config: UploadFile, avatar: Optional[UploadFile] = File(None), name: str, tkn: str, robot_id: int):
    """Actualizar un robot existente

    Args:
        config (UploadFile): archivo del robot actualizado.
        avatar (UploadFile, optional): imagen del robot actualizada.
        name (str): nombre del robot (sin cambios).
        tkn (str): token del usuario.
        robot_id (int): ID del robot a actualizar.

    Raises:
        HTTPException: 404: El robot no existe.
        HTTPException: 403: No tienes permiso para editar este robot.
        HTTPException: 422: El nombre del Robot no coincide con el robot a actualizar.
        HTTPException: 440: El token no es correcto o está expirado.

    Returns:
        dict: Mensaje de éxito.
    """
    try:
        no_avatar = True
        if avatar is not None:
            avatar_name = "P" + avatar.filename
            no_avatar = False
        else:
            avatar_name = None
        
        # Llamar al servicio para actualizar el robot
        msg = robot_service.update_robot(config, avatar_name, name, tkn, robot_id)
        
        # Si hay error, lanzar excepción HTTP correspondiente
        if "no existe" in msg:
            raise HTTPException(status_code=404, detail=msg)
        if "permiso" in msg:
            raise HTTPException(status_code=403, detail=msg)
        if "requisitos" in msg or "coincide" in msg:
            raise HTTPException(status_code=422, detail=msg)
        if "Token" in msg:
            raise HTTPException(status_code=440, detail="Sesión expirada")
        
        # Procesamos la respuesta exitosa
        if ":" in msg:
            parts = msg.split(":")
            username = parts[1]
            if len(parts) > 2:
                avatar_name = parts[2]
            msg = parts[0]
            
            # Guardar el archivo de configuración actualizado
            store_config(config, username)
            
            # Guardar el avatar si se proporcionó uno nuevo
            if not no_avatar:
                avatar.filename = avatar_name
                store_avatar(avatar)
        
        return {"msg": msg}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar robot: {str(e)}")