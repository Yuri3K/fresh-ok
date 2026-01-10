import { LangCode } from "./langsController";


export interface Badge {
  color: string,
  i18n: Record<LangCode, string>,
  isActive: boolean,
  updatedAt: string,
  createdAt: string,
  priority: number,
}