// js.js
let tokenClient;
let gapiInited = false;
let gisInited = false;

let authorizeButton = document.getElementById('authorize_button');
let signoutButton = document.getElementById('signout_button');

let fileManager = document.getElementById('file-manager');
let sheetManager = document.getElementById('sheet-manager');
let cellManager = document.getElementById('cell-manager');

let currentFileId = null;
let currentFileName = '';
let currentSheetName = '';

let output = document.getElementById('output');

// Botones y campos
let createFileButton = document.getElementById('create_file');
let listFilesButton = document.getElementById('list_files');
let fileListDiv = document.getElementById('file-list');

let createSheetButton = document.getElementById('create_sheet');
let listSheetsButton = document.getElementById('list_sheets');
let sheetListDiv = document.getElementById('sheet-list');

let viewCellsButton = document.getElementById('view_cells');
let cellContentDiv = document.getElementById('cell-content');

let updateCellButton = document.getElementById('update_cell');
let cellRangeInput = document.getElementById('cell_range');
let cellValueInput = document.getElementById('cell_value');

let deleteCellButton = document.getElementById('delete_cell');
let deleteCellRangeInput = document.getElementById('delete_cell_range');

let CLIENT_ID = '';
let SCOPES = '';

// Inicialización
async function initializeApp() {
  // Obtener CLIENT_ID y SCOPES desde el servidor
  try {
    const response = await fetch('/config');
    const config = await response.json();
    CLIENT_ID = config.CLIENT_ID;
    SCOPES = config.SCOPES;
    gisLoaded();
    gapi.load('client', initializeGapiClient);
  } catch (error) {
    appendPre('Error al obtener la configuración: ' + error);
  }
}

async function initializeGapiClient() {
  await gapi.client.init({
    // No es necesario el API_KEY
    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
      'https://sheets.googleapis.com/$discovery/rest?version=v4',
    ],
  });
  gapiInited = true;
  maybeEnableButtons();
}

// Cargar GIS
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // Se establecerá después
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    authorizeButton.style.display = 'block';
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }
}

function handleAuthClick() {
  tokenClient.callback = async (response) => {
    if (response.error) {
      throw response;
    }
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    fileManager.style.display = 'block';
    setupFileOperations();
  };

  if (gapi.client.getToken() === null) {
    // Solicitar token de acceso
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Refrescar token
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

function handleSignoutClick() {
  gapi.client.setToken('');
  authorizeButton.style.display = 'block';
  signoutButton.style.display = 'none';
  fileManager.style.display = 'none';
  sheetManager.style.display = 'none';
  cellManager.style.display = 'none';
  output.innerHTML = '';
  currentFileId = null;
  currentFileName = '';
  currentSheetName = '';
}

// Configurar operaciones de archivos
function setupFileOperations() {
  createFileButton.onclick = createFile;
  listFilesButton.onclick = listFiles;
}

async function createFile() {
  const folderName = 'appTEST';
  let folderId;

  // Verificar si la carpeta existe
  const folderResponse = await gapi.client.drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
    fields: 'files(id, name)',
  });

  if (folderResponse.result.files && folderResponse.result.files.length > 0) {
    folderId = folderResponse.result.files[0].id;
  } else {
    // Crear carpeta
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };
    const createFolderResponse = await gapi.client.drive.files.create({
      resource: folderMetadata,
      fields: 'id',
    });
    folderId = createFolderResponse.result.id;
    appendPre(`Carpeta creada con ID: ${folderId}`);
  }

  // Crear archivo dentro de la carpeta
  const fileMetadata = {
    name: 'Datos de Usuario ' + new Date().toLocaleString(),
    mimeType: 'application/vnd.google-apps.spreadsheet',
    parents: [folderId],
  };

  const response = await gapi.client.drive.files.create({
    resource: fileMetadata,
    fields: 'id, name',
  });
  currentFileId = response.result.id;
  currentFileName = response.result.name;
  document.getElementById('current-file-name').textContent = currentFileName;
  appendPre(`Archivo creado con ID: ${currentFileId}`);
  sheetManager.style.display = 'block';
  setupSheetOperations();
}

async function listFiles() {
  const response = await gapi.client.drive.files.list({
    q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  const files = response.result.files;
  fileListDiv.innerHTML = '';

  if (files && files.length > 0) {
    files.forEach((file) => {
      const fileButton = document.createElement('button');
      fileButton.textContent = file.name;
      fileButton.onclick = () => selectFile(file.id, file.name);
      fileListDiv.appendChild(fileButton);
    });
  } else {
    fileListDiv.textContent = 'No se encontraron archivos.';
  }
}

function selectFile(fileId, fileName) {
  currentFileId = fileId;
  currentFileName = fileName;
  document.getElementById('current-file-name').textContent = currentFileName;
  appendPre(`Archivo seleccionado: ${currentFileName}`);
  sheetManager.style.display = 'block';
  setupSheetOperations();
}

function setupSheetOperations() {
  createSheetButton.onclick = createSheet;
  listSheetsButton.onclick = listSheets;
}

async function createSheet() {
  const sheetTitle = prompt('Ingrese el nombre de la nueva hoja:');
  if (!sheetTitle) return;

  const requests = [
    {
      addSheet: {
        properties: {
          title: sheetTitle,
        },
      },
    },
  ];

  try {
    await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: currentFileId,
      resource: { requests },
    });
    appendPre(`Hoja "${sheetTitle}" creada.`);
  } catch (error) {
    appendPre('Error al crear la hoja: ' + error.result.error.message);
  }
}

async function listSheets() {
  const response = await gapi.client.sheets.spreadsheets.get({
    spreadsheetId: currentFileId,
  });

  const sheets = response.result.sheets;
  sheetListDiv.innerHTML = '';

  if (sheets && sheets.length > 0) {
    sheets.forEach((sheet) => {
      const sheetButton = document.createElement('button');
      sheetButton.textContent = sheet.properties.title;
      sheetButton.onclick = () => selectSheet(sheet.properties.title);
      sheetListDiv.appendChild(sheetButton);
    });
  } else {
    sheetListDiv.textContent = 'No se encontraron hojas.';
  }
}

function selectSheet(sheetName) {
  currentSheetName = sheetName;
  document.getElementById('current-sheet-name').textContent = currentSheetName;
  appendPre(`Hoja seleccionada: ${currentSheetName}`);
  cellManager.style.display = 'block';
  setupCellOperations();
}

function setupCellOperations() {
  viewCellsButton.onclick = viewCells;
  updateCellButton.onclick = updateCell;
  deleteCellButton.onclick = deleteCell;
}

async function viewCells() {
  if (!currentFileId || !currentSheetName) {
    appendPre('Debe seleccionar un archivo y una hoja.');
    return;
  }

  const range = `${currentSheetName}`;
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: currentFileId,
      range: range,
    });

    const values = response.result.values;
    cellContentDiv.innerHTML = '';

    if (values && values.length > 0) {
      values.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            const cellDiv = document.createElement('div');
            cellDiv.textContent = `Celda ${String.fromCharCode(65 + colIndex)}${rowIndex + 1}: ${cell}`;
            cellContentDiv.appendChild(cellDiv);
          }
        });
      });
    } else {
      cellContentDiv.textContent = 'La hoja está vacía.';
    }
  } catch (error) {
    appendPre('Error al obtener el contenido de las celdas: ' + error.result.error.message);
  }
}

async function updateCell() {
  const cellRange = cellRangeInput.value;
  const newValue = cellValueInput.value;

  if (!cellRange || !newValue) {
    appendPre('Debe ingresar el rango y el nuevo valor.');
    return;
  }

  const range = `${currentSheetName}!${cellRange}`;
  const values = [[newValue]];

  try {
    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: currentFileId,
      range: range,
      valueInputOption: 'RAW',
      resource: { values },
    });
    appendPre(`Celda ${range} actualizada con "${newValue}".`);
  } catch (error) {
    appendPre('Error al actualizar la celda: ' + error.result.error.message);
  }
}

async function deleteCell() {
  const cellRange = deleteCellRangeInput.value;

  if (!cellRange) {
    appendPre('Debe ingresar el rango de la celda a eliminar.');
    return;
  }

  const range = `${currentSheetName}!${cellRange}`;
  const values = [['']];

  try {
    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: currentFileId,
      range: range,
      valueInputOption: 'RAW',
      resource: { values },
    });
    appendPre(`Contenido de la celda ${range} eliminado.`);
  } catch (error) {
    appendPre('Error al eliminar el contenido de la celda: ' + error.result.error.message);
  }
}

function appendPre(message) {
  const textContent = `${message}\n`;
  output.textContent += textContent;
  output.scrollTop = output.scrollHeight;
}

// Inicializar la aplicación
window.onload = initializeApp;
