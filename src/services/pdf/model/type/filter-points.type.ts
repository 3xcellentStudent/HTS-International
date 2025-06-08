export default interface FilterPointsType {
  COMMERCIAL_INV_NO: PointObjectType
  CONSIGNEE_CUSTOMER_NO: PointObjectType
  SHIPMENT_INFORMATION: PointObjectType
  INVOICE_PARTS: InvoicePartsType[]
}

export interface PointObjectType {value: string, plusIndexes: []}

export interface InvoicePartsType {
  invoiceNo: number,
  purchaseNo: string,
  parts: PartType[]
}

export interface PartType {
  partName: string,
  partNumber: string,
  tariffCode: string,
  countryOfOrigin: string,
  description: string,
}