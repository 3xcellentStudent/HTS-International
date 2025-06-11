export default interface ExportDeclarationType {
  commercialInvoiceNo: string
  exporterAccountNo: string
  exporterName: string
  exporterPhone: string
  exporterStreet: string
  exporterCity: string
  exporterPostalCode: string
  exporterProvince: string
  exporterCountry: string
  consigneeName: string
  consigneePhone: string
  consigneeStreet: string
  consigneeCity: string
  consigneePostalCode: string
  consigneeProvince: string
  consigneeCountry: string
  taxIdentificationNo: string
  invoicesArray: InvoicesArrayType[]
};

export interface InvoicesArrayType {
  invoiceNo: string
  purchaseNo: string
  parts: PartObjectType[]
}

export interface PartObjectType {
  partName: string
  partNumber: string
  tariffCode: string
  countryOfOrigin: string
  description: string
}