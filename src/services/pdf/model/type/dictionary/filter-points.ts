// import type FilterPointsType from "../filter-points.type";

const filterPoints = {
  COMMERCIAL_INV_NO: {value: "Commercial Inv. No.", plusIndexes: [
    {index: 1, fieldName: "exporterAccountNo"},
    {index: 2, fieldName: "exporterName"},
    {index: 4, fieldName: "exporterStreet"},
  ]},
  CONSIGNEE_CUSTOMER_NO: {value: "Consignee Customer No.",plusIndexes: [
    {index: 1, fieldName: "consigneeName"},
    {index: 4, fieldName: "consigneeStreet"},
  ]},
  SHIPMENT_INFORMATION: {value: "Shipment Information:", plusIndexes: [
    {index: 1, fieldName: "exporterCity"},
    {index: 2, fieldName: "exporterProvince"},
    {index: 3, fieldName: "exporterPostalCode"},
    {index: 4, fieldName: "exporterCountry"},
    {index: 5, fieldName: "consigneeCity"},
    {index: 6, fieldName: "consigneeProvince"},
    {index: 7, fieldName: "consigneePostalCode"},
    {index: 8, fieldName: "consigneeCountry"},
  ]},
}

export default filterPoints;