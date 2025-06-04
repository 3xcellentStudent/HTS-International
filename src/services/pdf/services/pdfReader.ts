import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import excelCreator from "../excel/excelCreator";

GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function pdfReader(buffer: ArrayBuffer) {
  getDocument({ data: buffer }).promise.then((doc) => {
    const {numPages} = doc;

    excelCreator()

    // for(let i = 1; i <= numPages; i++){
    //   doc.getPage(i).then((page) => {
    //     page.getTextContent().then((text) => {
    //       const sortedItems = text.items.filter((item): item is TextItem => 'str' in item && item.str.trim() !== '')
    //     });
    //   });
    // }
  });
}