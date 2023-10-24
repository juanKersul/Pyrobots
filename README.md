# PYROBOTS

## DEPLOY

1. ir al directorio del back

    ```sh
    cd back
    ```

2. Crear entorno virtual

    ```sh
    sudo apt-get install virtualenv
    virtualenv -p /usr/bin/python3 <nombre>
    ```

3. Activar el entorno virtual

    ```sh
    source <nombre>/bin/activate
    ```

    > Para desactivar venv: ```$ deactivate```

4. Instalar los requeriments

    ```sh
    pip install -r requeriments.txt
    ```

5. Levantar el servidor de FastApi

    ```sh
    uvicorn main:app --reload
    ```

6. ir al directorio del front

    ```sh
    cd front
    ```

7. Instalar los requeriments

    ```sh
    npm install
    ```

8. Levantar el servidor de React

    ```sh
    npm start
    ```

## USO

### LOGUEO

1. debes registrarte con un mail y password para poder acceder a la aplicacion
2. debes verificar tu cuenta con el link que te llega al mail
3. ya puedes acceder a la aplicacion con tu mail y password

### SUBIR UN ROBOT

1. necesitas crear un archivo .py con el mismo nombre que el robot que ademas contenga

    - ```py
        from routers.robot.robot_class import Robot
        ```

    - una clase con el mismo nombre que el archivo que herede de Robot
    - un metodo initialize donde puedes crear e inizializar variables
    - un metodo respond donde manejes la logica del robot

#### ejemplo

```py
    from routers.robot.robot_class import Robot
class default1(Robot):
    def initialize(self):
        pass
    def respond(self):
        direction = self.get_direction()
        distance= self.scanned()
        if(direction==0):
            self.drive(90,50)
            self.point_scanner(90,5)
            if(distance<1500):
                self.cannon(0,distance)
        elif(direction==90):
            self.drive(180,50)
            self.point_scanner(180,5)
            if(distance<1500):
                self.cannon(90,distance)
        elif(direction==180):
            self.drive(270,50)
            self.point_scanner(270,5)
            if(distance<1500):
                self.cannon(180,distance)
        elif(direction==270):
            self.drive(0,50)
            self.point_scanner(0,5)
            if(distance<1500):
                self.cannon(270,distance)
        else:
            self.drive(0,50)
```

### EJECUTAR UNA SIMULACION

1. dirigirse a la pestaña de simulacion
2. seleccionar los robots que se desea simular y la cantidad de rondas
3. presionar el boton de simular
