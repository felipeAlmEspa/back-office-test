/**
 * Utilidades para validación de documentos de identificación de Ecuador
 */

import { ETypeContributorCode } from "@/enums";
import { IDataType } from "@/interface";

export enum EIdentificationTypeEcuador {
  CEDULA = "CEDULA",
  RUC = "RUC",
  ITE = "ITE",
  PASAPORTE = "PASAPORTE",
}

export interface IValidationResult {
  isValid: boolean;
  message?: string;
  type?: EIdentificationTypeEcuador;
}

/**
 * Valida una cédula ecuatoriana (10 dígitos)
 * Algoritmo: Módulo 10
 *
 * @param cedula - Número de cédula a validar
 * @returns Resultado de la validación
 */
export const validateCedulaEcuador = (cedula: string): IValidationResult => {
  // Eliminar espacios en blanco
  const cedulaClean = cedula.trim();

  // Verificar que tenga exactamente 10 dígitos
  if (!/^\d{10}$/.test(cedulaClean)) {
    return {
      isValid: false,
      message: "La cédula debe tener exactamente 10 dígitos numéricos",
    };
  }

  // Extraer los dígitos
  const digits = cedulaClean.split("").map(Number);

  // Los dos primeros dígitos deben corresponder a una provincia (01-24)
  const provincia = parseInt(cedulaClean.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) {
    return {
      isValid: false,
      message:
        "Los dos primeros dígitos deben corresponder a una provincia válida (01-24)",
    };
  }

  // El tercer dígito debe ser menor a 6 (0-5) para personas naturales
  const thirdDigit = digits[2];
  if (thirdDigit === undefined || thirdDigit >= 6) {
    return {
      isValid: false,
      message:
        "El tercer dígito debe ser menor a 6 para cédulas de personas naturales",
    };
  }

  // Algoritmo de validación módulo 10
  // Los primeros 9 dígitos se multiplican por un coeficiente
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    const digit = digits[i];
    const coef = coeficientes[i];
    if (digit === undefined || coef === undefined) continue;

    let producto = digit * coef;
    // Si el producto es mayor o igual a 10, se suma los dígitos (ej: 12 -> 1+2=3)
    if (producto >= 10) {
      producto = producto - 9;
    }
    suma += producto;
  }

  // Calcular el dígito verificador
  const residuo = suma % 10;
  const digitoVerificador = residuo === 0 ? 0 : 10 - residuo;

  // Comparar con el último dígito de la cédula
  const lastDigit = digits[9];
  if (lastDigit === undefined || digitoVerificador !== lastDigit) {
    return {
      isValid: false,
      message: "El dígito verificador no es válido",
    };
  }

  return {
    isValid: true,
    type: EIdentificationTypeEcuador.CEDULA,
  };
};

/**
 * Valida un RUC ecuatoriano (13 dígitos)
 * El RUC puede ser de tres tipos:
 * - Persona Natural (tipo de tercero = 6): Cédula + 001
 * - Sociedad Privada (tipo de tercero = 9): 10 dígitos + 001
 * - Sociedad Pública (tipo de tercero = 6): 10 dígitos + 0001
 *
 * @param ruc - Número de RUC a validar
 * @returns Resultado de la validación
 */
export const validateRUCEcuador = (ruc: string): IValidationResult => {
  // Eliminar espacios en blanco
  const rucClean = ruc.trim();

  // Verificar que tenga exactamente 13 dígitos
  if (!/^\d{13}$/.test(rucClean)) {
    return {
      isValid: false,
      message: "El RUC debe tener exactamente 13 dígitos numéricos",
    };
  }

  // Los dos primeros dígitos deben corresponder a una provincia (01-24)
  const provincia = parseInt(rucClean.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) {
    return {
      isValid: false,
      message:
        "Los dos primeros dígitos deben corresponder a una provincia válida (01-24)",
    };
  }

  // El tercer dígito indica el tipo de contribuyente
  const tercerDigito = parseInt(rucClean.charAt(2), 10);

  // RUC de Persona Natural (tercer dígito < 6)
  if (tercerDigito >= 0 && tercerDigito < 6) {
    // Los últimos 3 dígitos deben ser 001
    if (rucClean.substring(10, 13) !== "001") {
      return {
        isValid: false,
        message:
          "Para RUC de persona natural, los últimos 3 dígitos deben ser 001",
      };
    }

    // Validar los primeros 10 dígitos como cédula
    const cedulaValidation = validateCedulaEcuador(rucClean.substring(0, 10));
    if (!cedulaValidation.isValid) {
      return {
        isValid: false,
        message: `RUC de persona natural inválido: ${cedulaValidation.message}`,
      };
    }

    return {
      isValid: true,
      type: EIdentificationTypeEcuador.RUC,
    };
  }

  // RUC de Sociedad Privada (tercer dígito = 9)
  if (tercerDigito === 9) {
    // Los últimos 3 dígitos deben ser 001
    if (rucClean.substring(10, 13) !== "001") {
      return {
        isValid: false,
        message:
          "Para RUC de sociedad privada, los últimos 3 dígitos deben ser 001",
      };
    }

    // Algoritmo de validación módulo 11 para sociedades privadas
    const digits = rucClean.substring(0, 10).split("").map(Number);
    const coeficientes = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      const digit = digits[i];
      const coef = coeficientes[i];
      if (digit === undefined || coef === undefined) continue;
      suma += digit * coef;
    }

    const residuo = suma % 11;
    const digitoVerificador = residuo === 0 ? 0 : 11 - residuo;

    const lastDigit = digits[9];
    if (lastDigit === undefined || digitoVerificador !== lastDigit) {
      return {
        isValid: false,
        message:
          "El dígito verificador del RUC de sociedad privada no es válido",
      };
    }

    return {
      isValid: true,
      type: EIdentificationTypeEcuador.RUC,
    };
  }

  // RUC de Sociedad Pública (tercer dígito = 6)
  if (tercerDigito === 6) {
    // Los últimos 4 dígitos deben ser 0001
    if (rucClean.substring(9, 13) !== "0001") {
      return {
        isValid: false,
        message:
          "Para RUC de sociedad pública, los últimos 4 dígitos deben ser 0001",
      };
    }

    // Algoritmo de validación módulo 11 para sociedades públicas
    const digits = rucClean.substring(0, 9).split("").map(Number);
    const coeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;

    for (let i = 0; i < 8; i++) {
      const digit = digits[i];
      const coef = coeficientes[i];
      if (digit === undefined || coef === undefined) continue;
      suma += digit * coef;
    }

    const residuo = suma % 11;
    const digitoVerificador = residuo === 0 ? 0 : 11 - residuo;

    const lastDigit = digits[8];
    if (lastDigit === undefined || digitoVerificador !== lastDigit) {
      return {
        isValid: false,
        message:
          "El dígito verificador del RUC de sociedad pública no es válido",
      };
    }

    return {
      isValid: true,
      type: EIdentificationTypeEcuador.RUC,
    };
  }

  return {
    isValid: false,
    message: `El tercer dígito (${tercerDigito}) no corresponde a un tipo de RUC válido`,
  };
};

/**
 * Valida un ITE (Identificación Tributaria Especial) ecuatoriano
 * El ITE es para extranjeros sin cédula ecuatoriana
 * Formato: 13 dígitos, comienza con provincia válida
 *
 * @param ite - Número de ITE a validar
 * @returns Resultado de la validación
 */
export const validateITEEcuador = (ite: string): IValidationResult => {
  // Eliminar espacios en blanco
  const iteClean = ite.trim();

  // Verificar que tenga exactamente 13 dígitos
  if (!/^\d{13}$/.test(iteClean)) {
    return {
      isValid: false,
      message: "El ITE debe tener exactamente 13 dígitos numéricos",
    };
  }

  // Los dos primeros dígitos deben corresponder a una provincia (01-24) o 30 para extranjeros
  const provincia = parseInt(iteClean.substring(0, 2), 10);
  if ((provincia < 1 || provincia > 24) && provincia !== 30) {
    return {
      isValid: false,
      message:
        "Los dos primeros dígitos deben corresponder a una provincia válida (01-24) o 30 para extranjeros",
    };
  }

  // El tercer dígito debe ser 7 u 8 para ITE
  const tercerDigito = parseInt(iteClean.charAt(2), 10);
  if (tercerDigito !== 7 && tercerDigito !== 8) {
    return {
      isValid: false,
      message: "El tercer dígito de un ITE debe ser 7 u 8",
    };
  }

  // Validar usando el mismo algoritmo que la cédula para los primeros 10 dígitos
  const digits = iteClean.substring(0, 10).split("").map(Number);
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    const digit = digits[i];
    const coef = coeficientes[i];
    if (digit === undefined || coef === undefined) continue;

    let producto = digit * coef;
    if (producto >= 10) {
      producto = producto - 9;
    }
    suma += producto;
  }

  const residuo = suma % 10;
  const digitoVerificador = residuo === 0 ? 0 : 10 - residuo;

  const lastDigit = digits[9];
  if (lastDigit === undefined || digitoVerificador !== lastDigit) {
    return {
      isValid: false,
      message: "El dígito verificador del ITE no es válido",
    };
  }

  return {
    isValid: true,
    type: EIdentificationTypeEcuador.ITE,
  };
};

/**
 * Valida un pasaporte
 * El formato de pasaporte puede variar según el país
 * Generalmente es alfanumérico y tiene entre 6 y 9 caracteres
 *
 * @param pasaporte - Número de pasaporte a validar
 * @returns Resultado de la validación
 */
export const validatePasaporteEcuador = (
  pasaporte: string
): IValidationResult => {
  // Eliminar espacios en blanco
  const pasaporteClean = pasaporte.trim().toUpperCase();

  // Verificar que tenga entre 6 y 9 caracteres alfanuméricos
  if (!/^[A-Z0-9]{6,9}$/.test(pasaporteClean)) {
    return {
      isValid: false,
      message:
        "El pasaporte debe contener entre 6 y 9 caracteres alfanuméricos",
    };
  }

  // Verificar que no sea solo números (debe tener al menos una letra)
  if (/^\d+$/.test(pasaporteClean)) {
    return {
      isValid: false,
      message: "El pasaporte debe contener al menos una letra",
    };
  }

  return {
    isValid: true,
    type: EIdentificationTypeEcuador.PASAPORTE,
  };
};

/**
 * Función principal que detecta automáticamente el tipo de identificación
 * y aplica la validación correspondiente
 *
 * @param identification - Número de identificación a validar
 * @returns Resultado de la validación
 */
export const validateEcuadorianIdentification = (
  identification: string
): IValidationResult => {
  const identificationClean = identification.trim();

  // Si está vacío
  if (!identificationClean) {
    return {
      isValid: false,
      message: "La identificación no puede estar vacía",
    };
  }

  // Detectar el tipo de identificación basándose en la longitud y formato

  // 10 dígitos = Cédula
  if (/^\d{10}$/.test(identificationClean)) {
    return validateCedulaEcuador(identificationClean);
  }

  // 13 dígitos = RUC o ITE
  if (/^\d{13}$/.test(identificationClean)) {
    const tercerDigito = parseInt(identificationClean.charAt(2), 10);

    // Si el tercer dígito es 7 u 8, es ITE
    if (tercerDigito === 7 || tercerDigito === 8) {
      return validateITEEcuador(identificationClean);
    }

    // De lo contrario, validar como RUC
    return validateRUCEcuador(identificationClean);
  }

  // Alfanumérico = Pasaporte
  if (/^[A-Z0-9]{6,9}$/i.test(identificationClean)) {
    return validatePasaporteEcuador(identificationClean);
  }

  return {
    isValid: false,
    message:
      "Formato de identificación no reconocido. Debe ser: Cédula (10 dígitos), RUC (13 dígitos), ITE (13 dígitos) o Pasaporte (6-9 caracteres alfanuméricos)",
  };
};

/**
 * Validar tipo de contribuyente
 */

export const getTypeContributorbyRUC = (
  ruc: string,
  listTypesContributors: IDataType[]
): IDataType | undefined => {
  if (!/^\d{13}$/.test(ruc)) return undefined;

  const tercerDigito = Number(ruc[2]);

  if (tercerDigito >= 0 && tercerDigito <= 5) {
    return listTypesContributors.find(
      (t) => t.code === ETypeContributorCode.NATURAL
    );
  }

  if (tercerDigito === 9) {
    return listTypesContributors.find(
      (t) => t.code === ETypeContributorCode.PRIVADA
    );
  }

  if (tercerDigito === 6) {
    return listTypesContributors.find(
      (t) => t.code === ETypeContributorCode.PUBLICA
    );
  }

  return undefined;
};
