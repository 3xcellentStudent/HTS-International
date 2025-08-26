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
  private countriesOfOriginArray = appConfig.countriesOfOriginArray;
  private currentPageNumber = 1;

  public async readPdfDoc(buffer: ArrayBuffer, action: (state: ExportDeclarationType) => void){
    const lock = await getDocument({ data: buffer }).promise.then(async (document) => {
      await this.readPage(document)

      return true;
    });
    if(lock) action(this.state);
  }

  private async readPage(document: PDFDocumentProxy){
    const {numPages} = document;

    // for(let i = 1; i <= numPages; i++){
    while(this.currentPageNumber <= numPages){
      const page = await document.getPage(this.currentPageNumber);
      const text = await page.getTextContent();
      const sortedItems = text.items.filter((item): item is TextItem => 'str' in item && item.str.trim() !== '');

      this.state.exporterPhone = sortedItems[4].str
      this.state.commercialInvoiceNo = sortedItems[5].str

      this.mainLoopIndex = 0;

      // if(i === 1){
      this.arrayFilter(sortedItems)
      // }

      
      
      // console.log("---------------------------------------------------------------------------------")
      // console.log("Page number: ", this.currentPageNumber)
      // console.log(sortedItems)
      // console.log("---------------------------------------------------------------------------------")
      this.currentPageNumber++;
    }
  }

  private arrayFilter(array: TextItem[]){

    const {COMMERCIAL_INV_NO, CONSIGNEE_CUSTOMER_NO, SHIPMENT_INFORMATION, INVOICES_ARRAY} = filterPoints;

    while(this.mainLoopIndex < array.length){
      const oneString = array[this.mainLoopIndex].str;

      if(oneString === COMMERCIAL_INV_NO.value){
        COMMERCIAL_INV_NO.plusIndexes.forEach(({fieldName, index}) => {
          this.state[fieldName] = array[this.mainLoopIndex + index].str;
        })
        this.mainLoopIndex += COMMERCIAL_INV_NO.plusIndexes[COMMERCIAL_INV_NO.plusIndexes.length - 1].index + 1;
        // return;
      } else if(oneString === CONSIGNEE_CUSTOMER_NO.value){
        CONSIGNEE_CUSTOMER_NO.plusIndexes.forEach(({fieldName, index}) => {
          this.state[fieldName] = array[this.mainLoopIndex + index].str;
        })
        this.mainLoopIndex += CONSIGNEE_CUSTOMER_NO.plusIndexes[CONSIGNEE_CUSTOMER_NO.plusIndexes.length - 1].index + 1;
        // return;
      } else if(oneString === SHIPMENT_INFORMATION.value){
        SHIPMENT_INFORMATION.plusIndexes.forEach(({fieldName, index}) => {
          this.state[fieldName] = array[this.mainLoopIndex + index].str;
        })
        this.mainLoopIndex += SHIPMENT_INFORMATION.plusIndexes[SHIPMENT_INFORMATION.plusIndexes.length - 1].index + 1;
        // return;
      } else if(oneString.includes(INVOICES_ARRAY.value)){
        const purchaseNoElement = array[this.mainLoopIndex + INVOICES_ARRAY.purchaseNo].str;

        const purchaseNo = purchaseNoElement.includes(" ") ? purchaseNoElement.split(" ")[0] : purchaseNoElement;

        const newInvoiceObject: InvoicePartsType = {
          invoiceNo: array[this.mainLoopIndex + INVOICES_ARRAY.invoiceNo].str,
          purchaseNo,
          parts: [],
        };
        this.state.invoicesArray.push(newInvoiceObject);
        this.mainLoopIndex++;
        // return;
      } else if(this.countriesOfOriginArray.includes(oneString.toUpperCase())){
        const partObject = {
          partName: "",
          partNumber: "",
          tariffCode: array[this.mainLoopIndex + 1].str,
          countryOfOrigin: array[this.mainLoopIndex].str,
          description: ""
        }

        const part = array[this.mainLoopIndex + 4].str;

        if(part.includes(" ") || part.length > 2){
          const [partName, partNumber] = part.split(" ");

          partObject.partName = partName;
          partObject.partNumber = partNumber;
          partObject.description = array[this.mainLoopIndex + 6].str;
          this.mainLoopIndex += 6
        } else {
          partObject.partName = part;
          partObject.partNumber = array[this.mainLoopIndex + 5].str;
          partObject.description = array[this.mainLoopIndex + 7].str;
          this.mainLoopIndex += 7
        }

        this.state.invoicesArray.at(-1)?.parts.push(partObject);
      } else {
        this.mainLoopIndex++;
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