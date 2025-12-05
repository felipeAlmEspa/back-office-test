export interface ModalLocationSelectorOnOk {
  countryId: number;
  provinceId: number;
  cantonId: number;
  parishId: number;
  otherCountryDescription: string;
}
export interface IMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface IDataTypeRequest {
  codeType: string;
  businessLine?: string;
}

export interface ICatalog {
  value: number;
  label: string;
}
export interface IDataType {
  value: number;
  label: string;
  code: string;
}

export interface IDataTypeNumber {
  code: number;
  label: string;
  value: number;
}

// Direction
export interface ICantonsByName {
  cantonId: number;
  cantonName: string;
  provinceId: number;
  provinceName: string;
}

export interface IRequestCantons {
  province_id?: number;
  cantonName?: string;
}

export interface IRequestParishes {
  canton_id?: number;
  parishName?: string;
}

export interface IRequestPagination {
  page?: number;
  perPage?: number;
  order?: string;
  orderBy?: string;
}

export interface IRequestSubactEconomical {
  economicActivityId?: number;
}


export interface IDataType {
  value: number;
  code: string;
  label: string;
  codeType?: string;
  status?: boolean;
}


export interface ICollaborator {
  id: number;
  personId: number;
  identification: string;
  names: string;
  lastNames: string;
  email?: string;
  phone?: string;
  status: boolean;
}

export interface ICollaboratorsFilters {
  identification?: string;
  names?: string;
  lastNames?: string;
}