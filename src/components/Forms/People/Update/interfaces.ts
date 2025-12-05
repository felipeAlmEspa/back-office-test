export interface IPeoplePhone {
  phoneId?: number;
  phoneTypeId: number;
  phoneNumber: string;
  primary: boolean;
}

export interface IUpdatePhonePeopleRequest {
  personId: number;
  phones: IPeoplePhone[];
}

export interface IUpdatePhonePeopleResponse {
  totalUpdated: number;
  totalCreated: number;
  totalFailed: number;
}

export interface IUpdateDirectionPeople {
  addressTypeId: number;
  primaryStreet: string;
  cantonId: number;
  streetNumber?: string;
  postalCode?: string;
  parishId?: number;
  latitude?: number;
  reference?: string;
  secondaryStreet?: string;
  longitude?: number;
  directionId?: number;
  isActive?: boolean;
}

export interface IUpdateDirectionPeopleRequest {
  personId: number;
  directions: IUpdateDirectionPeople[];
}

export interface IUpdateDirectionPeopleResponse {
  totalUpdated: number;
  totalCreated: number;
  totalFailed: number;
}

// Interfaz para crear una nueva dirección (POST)
export interface ICreateDirectionRequest {
  personId: number;
  addressTypeId: number;
  primaryStreet: string;
  cantonId: number;
  secondaryStreet?: string;
  streetNumber?: string;
  latitude?: number;
  longitude?: number;
  postalCode?: string;
  reference?: string;
  parishId?: number;
}

export interface ICreateDirectionResponse {
  id: number;
  message?: string;
}

export interface IEmailResponse {
  emailId?: number;
  emailTypeId: number;
  email: string;
  primary: boolean;
}

export interface IUpdateEmailPeopleRequest {
  personId: number;
  emails: IEmailResponse[];
}

export interface IUpdateEmailPeopleResponse {
  totalUpdated: number;
  totalCreated: number;
  totalFailed: number;
}

export interface IUpdatePersonNaturalData {
  names?: string;
  lastNames?: string;
  genderId?: number;
  civilStatusId?: number;
  birthCountryId?: number;
  birthDate?: string;
  professionId?: number;
  spouseIdentificationId?: number;
}

export interface IUpdatePersonLegalData {
  companyName?: string;
  socialReason?: string;
}

export interface IUpdatePersonRequest {
  naturalPersonData?: IUpdatePersonNaturalData;
  legalPersonData?: IUpdatePersonLegalData;
}

export interface IUpdatePersonResponse {
  id: number;
  identification: string;
  identificationTypeId: number;
}
