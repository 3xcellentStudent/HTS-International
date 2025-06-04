import { useCallback, useState } from 'react';
import './App.css'
import pdfReader from './services/pdf/services/pdfReader';

export default function App(){

const [fileName, setFileName] = useState<string | null>(null);

const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContents = e.target?.result;
      // console.log("Вот содержимое файла:", fileContents);
      pdfReader(fileContents as ArrayBuffer)


      // дальше можешь делать с fileContents всё что хочешь
    };

    reader.onerror = (err) => {
      console.error("Ошибка при чтении файла:", err);
    };

    reader.readAsArrayBuffer(file); // или .readAsText(file) если нужен текст
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  return (
    <div className='drop_file_container' onDrop={handleDrop} onDragOver={handleDragOver} >
      {fileName ? `Файл: ${fileName}` : 'Перетащи файл сюда'}
    </div>
  );
}
