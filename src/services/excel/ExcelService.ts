import ExcelJS, { type Borders } from "exceljs"
import type PdfDataType from '../../types/pdf-data.type';
import type { StylesConfigType } from "../../types/excel.service.type";

const {colors, fonts, border}: StylesConfigType = {
  colors: {
    header: '#005cc5',
  },
  fonts: {
    font8: {name: 'Times New Roman', size: 8},
    font: {name: 'Times New Roman', size: 9},
    font9Bold: {name: 'Times New Roman', size: 9, bold: true},
    font10_5Bold: {name: 'Times New Roman', size: 10.5, bold: true},
    font11: {name: 'Times New Roman', size: 11},
    font11Bold: {name: 'Times New Roman', size: 11, bold: true},
  },
  border: {
    top: {style:'thin'},
    left: {style:'thin'},
    bottom: {style:'thin'},
    right: {style:'thin'},
  },
}

export default class ExcelService {

  private workbook = new ExcelJS.Workbook();
  // private a = this.workbook.xlsx.readFile()
  private worksheet = this.workbook.addWorksheet('My Sheet');

  public async createExcelFile(data: PdfDataType){

    this.createMetadata();

    this.createTitle();

    this.setRowHeightAndAligment();

    this.createTable(data);

    this.addParts(data)

    const buffer = await this.workbook.xlsx.writeBuffer();
    (window as any).electronAPI.excelCreator(buffer);

    console.log('Файл создан!');
  }

  private createMetadata(){
    this.workbook.creator = 'Andrew Prokuda';
    this.workbook.lastModifiedBy = 'Andrew Prokuda';
    this.workbook.created = new Date();
    this.workbook.modified = new Date();
    this.workbook.lastPrinted = new Date();
  }

  private createTitle(){
    const worksheet = this.worksheet;

    worksheet.mergeCells('A1:N1');

    worksheet.columns.forEach((column) => {
      column.width = 9.8;
    });

    worksheet.getCell('A1').value = {
      richText: [
        { text: 'Certification of Origin', font: {size: 36, bold: true, color: {argb: colors.header}}},
        { text: '\nCanadian-United States-Mexico Agreement (CUSMA)', font: {size: 18, color: {argb: colors.header}}},
        { text: '\nTrada Mexico Estados Unido Canada (T-MEC)', font: { size: 18, color: {argb: colors.header}}},
        { text: '\nUnites States-Mexico-Canada Agreement (USMCA)', font: {size: 18, color: {argb: colors.header}}},
      ]
    };

    worksheet.getCell('A1').alignment = {vertical: 'middle', horizontal: 'left', wrapText: true, indent: 3};

    worksheet.getRow(1).height = 195.95;
  }

  private createTable(data: PdfDataType){
    const worksheet = this.worksheet;

    const {
      exporterCity, exporterCountry, exporterName, exporterPhone, exporterPostalCode, exporterProvince, 
      exporterStreet, taxIdentificationNo, consigneeName, consigneeCity, consigneePostalCode, 
      consigneeProvince, consigneeStreet
    } = data;

    const {font, font9Bold, font10_5Bold} = fonts;

    const rangedCellsArray = [
      {from: "B2", to: "G2", isMerge: true, border: {top: border.top, left: border.left}, content: "1. Blanket Period: (dd/mm/yyyy)", font: font9Bold},
      {from: "B3", to: "B3", isMerge: false, border: {left: border.left, bottom: border.bottom}, content: "From:", font},
      {from: "E3", to: "E3", isMerge: false, border: {bottom: border.bottom}, content: "To:", font},
      {from: "B4", to: "G4", isMerge: true, border: {left: border.left}, content: "3. Certifier's Name and Address:", font: font9Bold},
      {from: "B5", to: "G5", isMerge: true, border: {left: border.left}, content: exporterName, font},
      {from: "B6", to: "G6", isMerge: true, border: {left: border.left}, content: exporterStreet, font},
      {from: "B7", to: "G7", isMerge: true, border: {left: border.left}, content: `${exporterCity}, ${exporterProvince}`, font},
      {from: "B8", to: "G8", isMerge: true, border: {left: border.left}, content: exporterPostalCode, font},
      {from: "B9", to: "G9", isMerge: true, border: {left: border.left}, content: exporterCountry, font},
      {from: "B10", to: "B10", isMerge: true, border: {left: border.left}, content: "Telephone:", font},
      {from: "C10", to: "G10", isMerge: true, content: `${exporterPhone}   TAX IDENTIFICATION #: ${taxIdentificationNo}`, font},
      {from: "B11", to: "C11", isMerge: true, border: {left: border.left}, content: "E-Mail Address:", font},
      {from: "D11", to: "G11", isMerge: true, content: "alina.hladkina@hitechseals.com", font},
      {from: "B12", to: "G12", isMerge: true, border: {left: border.left, bottom: border.bottom}, content: "Certifying Party:", font},
      {from: "C3", to: "D3", isBorder: false, isMerge: true, border: {bottom: border.bottom}, content: new Date(), font},
      {
        from: "F3", to: "G3", isBorder: false, isMerge: true, 
        border: {bottom: border.bottom}, 
        content: this.setDayBeforeTodayNextYear(), font
      },
      {from: "B13", to: "G13", isMerge: true, border: {left: border.left}, content: "5. Producer's Name and Address:", font: font9Bold},
      {from: "B14", to: "G14", isMerge: true, border: {left: border.left}, content: "AS PER THE CERTIFIER ", font},
      {from: "B15", to: "G18", isMerge: true, border: {left: border.left}, font},
      {from: "B19", to: "B19", isMerge: true, border: {left: border.left}, content: "Telephone:", font},
      {from: "C19", to: "G19", isMerge: true, font},
      {from: "B20", to: "C20", isMerge: true, border: {left: border.left, bottom: border.bottom}, content: "E-Mail Address:", font},
      {from: "D20", to: "G20", isMerge: true, border: {bottom: border.bottom}, font},
      // {from: "D22", to: "G38", isMerge: true, border, font},
      {from: "B21", to: "C21", isMerge: true, border, content: "7a. Part Number", font: font10_5Bold},
      {from: "D21", to: "G21", isMerge: true, border, content: "7b. Description of the Goods", font: font10_5Bold},
      {from: "H2", to: "M3", isMerge: true, border, font},
      {from: "H4", to: "M4", isMerge: true, border: {right: border.right, left: border.left}, content: "4. Exporter's Name and Address:", font: font9Bold},
      {from: "H5", to: "M5", isMerge: true, border: {right: border.right, left: border.left}, content: "AS PER CERTIFIER ", font},
      {from: "H6", to: "M10", isMerge: true, border: {right: border.right, left: border.left}, font},
      {from: "H11", to: "H11", isMerge: true, border: {left: border.left}, content: "Telephone:", font},
      {from: "I11", to: "M11", isMerge: true, border: {right: border.right}, font},
      {from: "H12", to: "I12", isMerge: true, border: {left: border.left, bottom: border.bottom}, content: "E-Mail Address:",font},
      {from: "J12", to: "M12", isMerge: true, border: {right: border.right, bottom: border.bottom}, font},
      {from: "H13", to: "M13", isMerge: true, border: {right: border.right, left: border.left}, content: "6. Importer's Name and Address:", font: font9Bold},
      {from: "H14", to: "M14", isMerge: true, border: {right: border.right, left: border.left}, content: "CUSTOMER'S ADDRESS ", font},
      {from: "H15", to: "M15", isMerge: true, border: {right: border.right, left: border.left}, font},
      {from: "H16", to: "M16", isMerge: true, border: {right: border.right, left: border.left}, content: consigneeName, font},
      {from: "H17", to: "M17", isMerge: true, border: {right: border.right, left: border.left}, content: consigneeStreet, font},
      {
        from: "H18", to: "M18", isMerge: true, border: {right: border.right, left: border.left}, 
        content: `${consigneeCity}, ${consigneeProvince} ${consigneePostalCode}`, font
      },
      {from: "H19", to: "M20", isMerge: true, border: {right: border.right, bottom: border.bottom, left: border.left}, font},
      {from: "H21", to: "I21", isMerge: true, border, content: "8. HS Tariff Classification", font: {...font, bold: true}},
      {from: "J21", to: "K21", isMerge: true, border, content: "9. Origin Criterion", font: font10_5Bold},
      {from: "L21", to: "M21", isMerge: true, border, content: "10. Country of Origin", font: font10_5Bold},
      // {from: "H22", to: "I38", isMerge: true, border, font},
      // {from: "J22", to: "K38", isMerge: true, border, font},
      // {from: "L22", to: "M38", isMerge: true, border, font},
    ]

    rangedCellsArray.forEach((object) => {
      const {from, to, isMerge, font} = object
      worksheet.getCell(from, to).font = font;
      if(isMerge) worksheet.mergeCells(`${from}:${to}`);
      if(!!object?.border) worksheet.getCell(from, to).border = object?.border;
      if(!!object?.content) worksheet.getCell(from, to).value = object?.content;
    })
  }

  private setDayBeforeTodayNextYear(){
    const date = new Date();

    date.setFullYear(date.getFullYear() + 1);

    date.setDate(date.getDate() - 1);

    return date;
  }

  private setRowHeightAndAligment(){
    const rowHeightArray = [
      {height: 20.1, rows: [2, 3, 4, 10, 11, 12, 13, 19, 20, 42, 43, 44, 45, 46, 47]},
      {height: 15, rows: [5, 6, 7, 8, 9, 14, 15, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36 ,37, 38, 39]},
      {height: 39.95, rows: [21]},
      {height: 57.95, rows: [40]},
    ]

    rowHeightArray.forEach(({height, rows}) => {
      rows.forEach((row) => {
        this.worksheet.getRow(row).height = height;
        this.worksheet.getRow(row).alignment = {vertical: 'middle', horizontal: 'left', wrapText: false, indent: 0};
      })
    })
  }

  private addParts(data: PdfDataType){
    const {invoicesArray} = data;
    const {font8, font11, font11Bold} = fonts;

    let tableStepFromStart = 22;
    const partsTableEndRow = 38;

    let i = 0;

    while(i < invoicesArray.length){
      const {invoiceNo, purchaseNo, parts} = invoicesArray[i];

      if(!!parts.length && i < partsTableEndRow){
        // if(tableStepFromStart > 22) this.addPartByStep(tableStepFromStart);

        const objectByStep = this.addPartByStep(tableStepFromStart);

        objectByStep.column7a.value = `INV# ${invoiceNo}`;
        objectByStep.column7b.value = `PO# ${purchaseNo}`;
        objectByStep.column7a.font = font11Bold;
        objectByStep.column7b.font = font11Bold;

        i++;
        tableStepFromStart++;

        parts.forEach((part) => {
          const {countryOfOrigin, description, partName, partNumber, tariffCode} = part;
          const fullPartName = `${partName} ${partNumber}`;

          const columnsByStep = this.addPartByStep(tableStepFromStart);

          columnsByStep.column7a.value = fullPartName;
          columnsByStep.column7b.value = description;
          columnsByStep.columnTariffCode.value = tariffCode;
          columnsByStep.columnCountryOfOrigin.value = countryOfOrigin;

          columnsByStep.column7a.font = fullPartName.length > 13 ? font8 : font11;
          columnsByStep.column7b.font = font11;
          columnsByStep.columnTariffCode.font = font11;
          columnsByStep.columnCountryOfOrigin.font = font11;

          // i++;
          tableStepFromStart++;
          console.log(i)
        })
        tableStepFromStart++;
      } else {
        // this.addPartByStep(tableStepFromStart + i)
        i++;
        continue;
      }
    }
  }

  private addPartByStep(step: number){
    const localBorderObject = {right: border.right, left: border.left}

    this.worksheet.mergeCells(`B${step}:C${step}`);
    this.worksheet.mergeCells(`D${step}:G${step}`);
    this.worksheet.mergeCells(`H${step}:I${step}`);
    this.worksheet.mergeCells(`L${step}:M${step}`);

    const column7a = this.worksheet.getCell(`B${step}:C${step}`);
    const column7b = this.worksheet.getCell(`D${step}:G${step}`);
    const columnTariffCode = this.worksheet.getCell(`H${step}:I${step}`);
    const columnCountryOfOrigin = this.worksheet.getCell(`L${step}:M${step}`);

    column7a.border = localBorderObject;
    column7b.border = localBorderObject;
    columnTariffCode.border = localBorderObject;
    columnCountryOfOrigin.border = localBorderObject;

    return {column7a, column7b, columnTariffCode, columnCountryOfOrigin};
  }

}