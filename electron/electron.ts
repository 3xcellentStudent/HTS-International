import { app, BrowserWindow, ipcMain } from "electron";
import fs from 'fs';
// import path from 'path';
import path, { dirname, resolve } from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const preloadPath = resolve(dirname(__filename), 'preload.js');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: preloadPath
      // nodeIntegration: false, // лучше отключить!
      // contextIsolation: true, // обязательно для preload
      // preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadURL('http://localhost:5173'); // если dev
  // win.loadFile('dist/index.html'); // если прод
  win.webContents.openDevTools();
}

ipcMain.handle('excel-creator', async (event, buffer) => {
  fs.writeFileSync('output.xlsx', Buffer.from(buffer));
  return 'Файл успешно сохранён';
});

app.whenReady().then(createWindow);