import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import type ExportDeclaration from "../../../types/pdf-data.type";
import pdfDataModel from "../model/json/pdf-data.sorted.model.json"
import filterPoints from "../model/type/dictionary/filter-points"
// import excelCreator from "../excel/excelCreator";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default class PdfService {

  private state: ExportDeclaration = pdfDataModel;
  private index: number = 0;

  constructor(){}

  public readPdfDoc(buffer: ArrayBuffer, action: (state: ExportDeclaration) => void){
    getDocument({ data: buffer }).promise.then((document) => {
      this.readPage(document)
      action(this.state)
    });
  }

  private readPage(document: PDFDocumentProxy){
    const {numPages} = document;

    for(let i = 1; i <= numPages; i++){
      document.getPage(i).then((page) => {
        page.getTextContent().then((text) => {
          const sortedItems = text.items.filter((item): item is TextItem => 'str' in item && item.str.trim() !== '');

          this.state.exporterPhone = sortedItems[4].str
          this.state.commercialInvoiceNo = sortedItems[5].str
          // sortedItems.forEach((item) => {
          //   item.str === 'Commercial Inv. No.'
          // })

          this.switchFilter(sortedItems)
          
          console.log(this.state)
          console.log("---------------------------------------------------------------------------------")
          // console.log(sortedItems)
          // console.log("---------------------------------------------------------------------------------")
        });
      });
    }
  }

  private switchFilter(array: TextItem[]){
    // console.log(array)
    const {COMMERCIAL_INV_NO, CONSIGNEE_CUSTOMER_NO, SHIPMENT_INFORMATION} = filterPoints;
    while(this.index < array.length){
      // array[this.index].str === COMMERCIAL_INV_NO.value ? console.log(array[this.index].str + "===" + COMMERCIAL_INV_NO.value) : null;
      switch(array[this.index].str){
        case COMMERCIAL_INV_NO.value: {
          COMMERCIAL_INV_NO.plusIndexes.forEach(({fieldName, index}) => {
            this.state[fieldName] = array[this.index + index].str;
          })
          this.index += COMMERCIAL_INV_NO.plusIndexes[COMMERCIAL_INV_NO.plusIndexes.length - 1].index + 1;
        }
        case CONSIGNEE_CUSTOMER_NO.value: {
          COMMERCIAL_INV_NO.plusIndexes.forEach(({fieldName, index}) => {
            this.state[fieldName] = array[this.index + index].str;
          })
          this.index += CONSIGNEE_CUSTOMER_NO.plusIndexes[CONSIGNEE_CUSTOMER_NO.plusIndexes.length - 1].index + 1;
        }
        case SHIPMENT_INFORMATION.value: {
          COMMERCIAL_INV_NO.plusIndexes.forEach(({fieldName, index}) => {
            this.state[fieldName] = array[this.index + index].str;
          })
          this.index += SHIPMENT_INFORMATION.plusIndexes[SHIPMENT_INFORMATION.plusIndexes.length - 1].index + 1;
        }
        default: {
          this.index++;
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