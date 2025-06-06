import ExcelJS, { type CellValue, type Font, type Row } from "exceljs"

const workbook = new ExcelJS.Workbook();

const {colors, font} = {
  colors: {
    header: '#076dd3',
  },
  font: {name: 'Times New Roman'}
}

const worksheet = workbook.addWorksheet('My Sheet');

function createMetadata(){
  workbook.creator = 'Andrew Prokuda';
  workbook.lastModifiedBy = 'Andrew Prokuda';
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
}

function getCell(cellName: string, content: CellValue, font: Font){
  worksheet.getCell(cellName).value = content;
  worksheet.getCell(cellName).font = font;
}

function createColumns(array: Partial<ExcelJS.Column>[]){
  worksheet.columns = array;
}

function createRow(array: string[]): Row {
  return worksheet.addRow(array);
}

async function excelCreator(){
  createMetadata();

  // createCell(sheet, 'A1', 'Привет, мир!');
  // // createCell(sheet, 'A2', 'Ещё текст');
  // createCell(sheet, 'B2', 'Ещё текст');

  // createColumns(sheet, [
  //   { header: 'Имя', key: 'name', width: 20 },
  //   { header: 'Возраст', key: 'age', width: 10 },
  // ]);

  worksheet.mergeCells('A1:N1');
  // worksheet.getCell('A1').value = {
  //   richText: [
  //     { text: 'Certification of Origin', font: {size: 36, bold: true, color: {argb: colors.header}}},
  //     { text: '\nCanadian-United States-Mexico Agreement (CUSMA)', font: {size: 18, color: {argb: colors.header}}},
  //     { text: '\nTrada Mexico Estados Unido Canada (T-MEC)', font: { size: 18, color: {argb: colors.header}}},
  //     { text: '\nUnites States-Mexico-Canada Agreement (USMCA)', font: {size: 18, color: {argb: colors.header}}},
  //   ]
  // };
  worksheet.getCell('A1').alignment = {vertical: 'middle', horizontal: 'left', wrapText: true, indent: 3};
  worksheet.getRow(1).height = 195.95;

  const buffer = await workbook.xlsx.writeBuffer();
  (window as any).electronAPI.excelCreator(buffer);

  console.log('Файл создан!');

  return;
}

export default  excelCreator;