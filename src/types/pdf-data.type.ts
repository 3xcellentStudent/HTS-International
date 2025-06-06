export default interface ExportDeclaration {
  commercialInvoiceNo: string;
  exporterAccountNo: string;
  exporterName: string;
  exporterPhone: string;
  exporterStreet: string;
  exporterCity: string;
  exporterPostalCode: string;
  exporterProvince: string;
  exporterCountry: string;
  consigneeName: string;
  consigneePhone: string;
  consigneeStreet: string;
  consigneeCity: string;
  consigneePostalCode: string;
  consigneeProvince: string;
  consigneeCountry: string;
  taxIdentificationNo: string;
  parts: Part[];
};

export interface Part {
  partsInvoiceNo: string;
  partsPurchaseNo: string;
  partName: string;
  partNumber: string;
  tariffCode: string;
  description: string;
  countryOfOrigin: string;
};
