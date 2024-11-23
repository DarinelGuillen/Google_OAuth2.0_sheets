# Gestor de Google Sheets

Una aplicación simple web para interactuar con Google Drive y Google Sheets, permitiendo a los usuarios autenticarse con su cuenta de Google y gestionar archivos, hojas y celdas de manera intuitiva. Para entender el funcionamiento de sheet y la interacion con ellos, y tener persistencia de datos.

## Características

- **Autenticación Segura**: Los usuarios pueden iniciar sesión utilizando su cuenta de Google mediante OAuth 2.0.
- **Gestión de Archivos**:
    - Crear nuevos archivos de Google Sheets dentro de una carpeta específica en Google Drive.
    - Listar archivos existentes de Google Sheets en el Drive del usuario.
    - Seleccionar un archivo para realizar operaciones.
- **Gestión de Hojas**:
    - Crear nuevas hojas dentro de un archivo de Google Sheets.
    - Listar hojas existentes dentro del archivo seleccionado.
    - Seleccionar una hoja para interactuar con sus celdas.
- **Gestión de Celdas**:
    - Visualizar celdas con contenido en la hoja seleccionada.
    - Editar el contenido de celdas específicas.
    - Eliminar el contenido de celdas específicas.

## Requisitos Previos

- **Node.js** instalado en tu sistema.
- Una cuenta de Google.
- Credenciales de OAuth 2.0 obtenidas desde la Consola de Desarrolladores de Google.

## Configuración

1. **Clonar el Repositorio**

    `git clone https://github.com/tu_usuario/gestor-google-sheets.git cd gestor-google-sheets`
    
2. **Instalar Dependencias**
    `npm install`
    
3. **Obtener Credenciales de Google**
    
    - Accede a la Consola de Desarrolladores de Google.
    - Crea un nuevo proyecto o utiliza uno existente.
    - Habilita las APIs de **Google Drive** y **Google Sheets**.
    - Configura la pantalla de consentimiento de OAuth 2.0.
    - Crea credenciales de OAuth 2.0 para una aplicación web.
    - Añade `http://localhost:3000` a los **Orígenes JavaScript Autorizados**.
    - Añade `http://localhost:3000` a los **URIs de Redirección Autorizados**.
    - Descarga el archivo JSON de credenciales o copia el **Client ID**.
4. **Configurar Variables de Entorno**
    
    Crea un archivo `.env` en la raíz del proyecto y añade tu `CLIENT_ID`:

    `CLIENT_ID=TU_CLIENT_ID`
    
    **Nota**: No compartas este archivo ni lo subas a repositorios públicos.
    
5. **Ejecutar la Aplicación**
    `npm start`
    
    La aplicación estará disponible en `http://localhost:3000`.
    

## Uso

1. **Iniciar Sesión**
    
    - Al abrir la aplicación, haz clic en **"Iniciar sesión con Google"**.
    - Autoriza los permisos solicitados.
2. **Gestión de Archivos**
    
    - **Crear Nuevo Archivo**: Crea un nuevo archivo de Google Sheets dentro de la carpeta `appTEST` en tu Google Drive.
    - **Listar Archivos**: Muestra una lista de tus archivos de Google Sheets. Haz clic en un archivo para seleccionarlo.
3. **Gestión de Hojas**
    
    - **Crear Nueva Hoja**: Añade una nueva hoja al archivo seleccionado.
    - **Listar Hojas**: Muestra las hojas existentes en el archivo. Haz clic en una hoja para seleccionarla.
4. **Gestión de Celdas**
    
    - **Ver Celdas con Contenido**: Muestra todas las celdas con contenido en la hoja seleccionada.
    - **Editar Celda**:
        - Ingresa el rango de la celda (por ejemplo, `A1`).
        - Ingresa el nuevo valor.
        - Haz clic en **"Actualizar Celda"**.
    - **Eliminar Celda**:
        - Ingresa el rango de la celda a eliminar.
        - Haz clic en **"Eliminar Celda"**.
5. **Cerrar Sesión**
    
    - Haz clic en **"Cerrar sesión"** para finalizar la sesión.

## Tecnologías Utilizadas

- **Frontend**:
    - HTML5 y CSS3 para la estructura y estilos.
    - JavaScript para la lógica del cliente.
    - Google APIs Client Library para JavaScript.
- **Backend**:
    - Node.js y Express para servir la aplicación y manejar la configuración.
    - dotenv para manejar variables de entorno.

## Estructura del Proyecto

- `app.js`: Servidor Express que sirve la aplicación y proporciona las credenciales de forma segura.
- `index.html`: Archivo HTML principal con la interfaz de usuario.
- `js.js`: Lógica del cliente para manejar la autenticación y las interacciones con las APIs de Google.
- `style.css`: Estilos CSS para la aplicación.
- `.env`: Archivo para almacenar variables de entorno (no incluido en el repositorio).
- `package.json`: Archivo de configuración de npm con las dependencias y scripts.

## Consideraciones de Seguridad

- Las credenciales sensibles (`CLIENT_ID`) se manejan a través de variables de entorno y no se exponen en el código fuente del cliente.
- Asegúrate de no subir el archivo `.env` a ningún repositorio público.
- Los tokens de acceso se manejan de forma segura utilizando la biblioteca de Google Identity Services.