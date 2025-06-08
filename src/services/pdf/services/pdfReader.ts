import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import type ExportDeclarationType from "../../../types/pdf-data.type";
import pdfDataModel from "../model/json/pdf-data.sorted.model.json"
import filterPoints from "../model/type/dictionary/filter-points"
import appConfig from "../../../app.config.json";
import type { InvoicePartsType } from "../model/type/filter-points.type";
// import excelCreator from "../excel/excelCreator";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default class PdfService {

  private state: ExportDeclarationType = pdfDataModel;
  private mainLoopIndex: number = 0;

  constructor(){}

  public readPdfDoc(buffer: ArrayBuffer, action: (state: ExportDeclarationType) => void){
    getDocument({ data: buffer }).promise.then((document) => {
      this.readPage(document)
      action(this.state)
    });
  }

  private async readPage(document: PDFDocumentProxy){
    const {numPages} = document;

    for(let i = 1; i <= numPages; i++){
      const page = await document.getPage(i);
      const text = await page.getTextContent();
      const sortedItems = text.items.filter((item): item is TextItem => 'str' in item && item.str.trim() !== '');

      this.state.exporterPhone = sortedItems[4].str
      this.state.commercialInvoiceNo = sortedItems[5].str

      // if(i === 1){
      this.switchFilter(sortedItems)
      // }

      
      
      // console.log(this.state)
      console.log("---------------------------------------------------------------------------------")
      console.log("Page number: ", i)
      console.log(sortedItems)
      console.log("---------------------------------------------------------------------------------")
    }
  }

  private switchFilter(array: TextItem[]){

    const {COMMERCIAL_INV_NO, CONSIGNEE_CUSTOMER_NO, SHIPMENT_INFORMATION, INVOICE_PARTS} = filterPoints;

    while(this.mainLoopIndex < array.length){
      switch(array[this.mainLoopIndex].str){
        case COMMERCIAL_INV_NO.value: {
          COMMERCIAL_INV_NO.plusIndexes.forEach(({fieldName, index}) => {
            this.state[fieldName] = array[this.mainLoopIndex + index].str;
          })
          this.mainLoopIndex += COMMERCIAL_INV_NO.plusIndexes[COMMERCIAL_INV_NO.plusIndexes.length - 1].index + 1;
        } case CONSIGNEE_CUSTOMER_NO.value: {
          CONSIGNEE_CUSTOMER_NO.plusIndexes.forEach(({fieldName, index}) => {
            this.state[fieldName] = array[this.mainLoopIndex + index].str;
          })
          this.mainLoopIndex += CONSIGNEE_CUSTOMER_NO.plusIndexes[CONSIGNEE_CUSTOMER_NO.plusIndexes.length - 1].index + 1;
        } case SHIPMENT_INFORMATION.value: {
          SHIPMENT_INFORMATION.plusIndexes.forEach(({fieldName, index}) => {
            this.state[fieldName] = array[this.mainLoopIndex + index].str;
          })
          this.mainLoopIndex += SHIPMENT_INFORMATION.plusIndexes[SHIPMENT_INFORMATION.plusIndexes.length - 1].index + 1;
        } case INVOICE_PARTS.value: {
          const countryOfOrigin = array[this.mainLoopIndex + INVOICE_PARTS.countryOfOriginIndex].str
          const {acceptedCountriesOfOrigin} = appConfig;

          if(countryOfOrigin.includes(acceptedCountriesOfOrigin[0] || acceptedCountriesOfOrigin[1])){

            const invoiceObject: InvoicePartsType = {}

            INVOICE_PARTS.plusIndexes.forEach(({fieldName, index}) => {
              this.state["parts"] = array[this.mainLoopIndex + index].str;
            })

            this.state["in"].push(invoiceObject)
          }
        } default: {
          this.mainLoopIndex++;
        }
      }
    }
  }
}

// function pdfReader(buffer: ArrayBuffer, action: (state: PdfDataType) => void){
  
//   getDocument({ data: buffer }).promise.then((document) => {
//     const {numPages} = document;

//     // excelCreator()

//     for(let i = 1; i <= numPages; i++){
//       document.getPage(i).then((page) => {
//         page.getTextContent().then((text) => {
//           const sortedItems = text.items.filter((item): item is TextItem => 'str' in item && item.str.trim() !== '');

//           state.shippersData.shippersPhone = sortedItems[4].str
//           state.commercialInvoiceNo = sortedItems[5].str
//           // sortedItems.forEach((item) => {
//           //   item.str === 'Commercial Inv. No.'
//           // })
          
//           console.log(sortedItems)
//           console.log("---------------------------------------------------------------------------------")
//         });
//       });
//     }
//   });
// }

// function filter(value: string, sortedItems: TextItem[]){
//   // switch(type){
//   //   case 'Commercial Inv. No.'
//   // }
// }