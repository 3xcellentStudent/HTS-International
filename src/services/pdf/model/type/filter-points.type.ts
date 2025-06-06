export default interface FilterPointsType {
  COMMERCIAL_INV_NO: PointObjectType
  CONSIGNEE_CUSTOMER_NO: PointObjectType
  SHIPMENT_INFORMATION: PointObjectType
}

export interface PointObjectType {value: string, plusIndexes: []}