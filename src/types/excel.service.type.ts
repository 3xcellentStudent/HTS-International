import type { Borders } from "exceljs";

export interface StylesConfigType {
  colors: {header: string}, 
  fonts: {
    font8: FontObjectType
    font: FontObjectType
    font9Bold: FontObjectType
    font10_5Bold: FontObjectType
    font11: FontObjectType
    font11Bold: FontObjectType
  }, 
  border: Partial<Borders>
}

export interface FontObjectType {name: string, size: number, bold?: boolean}