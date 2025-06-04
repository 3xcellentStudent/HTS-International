import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  excelCreator: (buffer: ArrayBuffer) => ipcRenderer.invoke('excel-creator', buffer)
});