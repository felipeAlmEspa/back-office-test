export enum ELineBusinessClientType {
  CORE = "core",
  SPARE = "spares",
  VEHICLE = "vehicles",
  WORKSHOP = "workshops",
  WHOLESALE = "wholesale",
}

export enum ECustomerCodeType {
  LINEA_PARA_EL_HOGAR = "NUC015",
  MOTOS = "NUC036",
  LLANTAS = "NUC035",
}

export enum EDataTypeCode {
    WHOLESALE_SALE_TYPE = "LMA001",
    WORKSHOP_WORK_AREA = "TAL002",
    WORKSHOP_PROCESS_TYPE = "TAL003",
    WORKSHOP_PROCESS_STATUS = "TAL004",
    PROFESSION = "NUC009",
    COUNTRY = "NUC003",
}

/**
 * Mapea el nombre de la línea de negocio al código de tipo de cliente correspondiente
 * Esta función usa el nombre de la línea (que viene del módulo actual) en lugar de IDs hardcodeados
 * @param lineBusinessName - Nombre de la línea de negocio (puede tener tildes)
 * @returns El código de tipo de cliente (NUC015, NUC036, NUC035) o null si no se encuentra
 */
export function getCustomerCodeTypeByLineBusinessName(lineBusinessName: string): string | null {
  const normalized = lineBusinessName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();

  switch (normalized) {
    case "LINEA PARA EL HOGAR":
    case "PARA EL HOGAR":
      return ECustomerCodeType.LINEA_PARA_EL_HOGAR;
    case "MOTOS":
      return ECustomerCodeType.MOTOS;
    case "LLANTAS":
      return ECustomerCodeType.LLANTAS;
    default:
      return null;
  }
}


export function getCustomerCodeTypeByLineBusinessId(lineBusinessId: number): string | null {
  const idToName: Record<number, string> = {
    2: "MOTOS",
    3: "LÍNEA PARA EL HOGAR",
    4: "LLANTAS",
  };
  const name = idToName[lineBusinessId];
  return name ? getCustomerCodeTypeByLineBusinessName(name) : null;
}

export function ELineBussinessClientParse(value?: string): ELineBusinessClientType {
  const normalized = (value ?? "").trim().toLowerCase();

  switch (normalized) {
    case "core":
    case ELineBusinessClientType.CORE.toLowerCase():
      return ELineBusinessClientType.CORE;

    case "spare":
    case ELineBusinessClientType.SPARE.toLowerCase():
      return ELineBusinessClientType.SPARE;

    case "vehicle":
    case "vehicles":
    case ELineBusinessClientType.VEHICLE.toLowerCase():
      return ELineBusinessClientType.VEHICLE;

    case "workshop":
    case "workshops":
    case ELineBusinessClientType.WORKSHOP.toLowerCase():
      return ELineBusinessClientType.WORKSHOP;

    case "wholesale":
    case ELineBusinessClientType.WHOLESALE.toLowerCase():
      return ELineBusinessClientType.WHOLESALE;

    default:
      return ELineBusinessClientType.CORE;
  }
}

export function ELineBussinessClientToKey(value: ELineBusinessClientType): string {
  switch (value) {
    case ELineBusinessClientType.CORE:
      return "core";
    case ELineBusinessClientType.SPARE:
      return "spares";
    case ELineBusinessClientType.VEHICLE:
      return "vehicles";
    case ELineBusinessClientType.WORKSHOP:
      return "workshops";
    case ELineBusinessClientType.WHOLESALE:
      return "wholesale";
    default:
      return "core";
  }
}
export enum EBusinessLineId {
  WORKSHOPS = 1,
  VEHICLES = 6,
}

export enum EIdentificationTypeCode {
  RUC = "TD062",
  CEDULA = "TD063",
  PASAPORTE = "TD064",
}

export enum ESupplierTypeId {
  NACIONAL = 90,
  INTERNACIONAL = 91,
}

export enum ESearchSpareItemType {
  SPARE_ITEM = "spareItem",
  EQUIVALENT_SPARE_ITEM = "equivalentSpareItem",
}


export enum EUserRoleCodes {
  adminRepuestos = "COREP",
  adminTalleres = "CORTALL",
}

export enum EItemTypeLine {
  SPARE = "spare",
  TEST_ITEM = "testItem",
}

export enum ETypeIdentificationCode {
  CEDULA = "TD063",
  ITE = "TD354",
  PASAPORTE = "TD064",
  RUC = "TD062",
}

export enum ETypeContributorCode{
  NATURAL = "TD102",
  PRIVADA = "TD103",
  PUBLICA = "TD104",
}