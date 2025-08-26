import { useCallback, useEffect, useState } from 'react';
import './App.css'
import type PdfDataType from './types/pdf-data.type';
import PdfService from './services/pdf/services/PdfService';
import ExcelService from './services/excel/ExcelService';

export default function App(){

  const pdfService = new PdfService();
  const excelService = new ExcelService();

  const [fileName, setFileName] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<PdfDataType>()

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContents = e.target?.result;
      // console.log("Вот содержимое файла:", fileContents);
      // pdfReader(fileContents as ArrayBuffer, setPdfData)
      pdfService.readPdfDoc(fileContents as ArrayBuffer, setPdfData)
    };

    reader.onerror = (err) => {
      console.error("Ошибка при чтении файла:", err);
    };

    reader.readAsArrayBuffer(file); // или .readAsText(file) если нужен текст
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  // useCallback(() => {
  //   console.log(pdfData?.commercialInvoiceNo)
  //   if(!!pdfData?.commercialInvoiceNo.length){
  //     excelService.createExcelFile(pdfData);
  //   }
  // }, [pdfData?.commercialInvoiceNo])

  useEffect(() => {
    if(!!pdfData?.commercialInvoiceNo.length){
      // console.log(pdfData)
      excelService.createExcelFile(pdfData);
    }
  }, [pdfData?.commercialInvoiceNo])

  return (
    <div className='drop_file_container' onDrop={handleDrop} onDragOver={handleDragOver} >
      {fileName ? `File: ${fileName}` : 'Drop your PDF file'}
    </div>
  );
}
