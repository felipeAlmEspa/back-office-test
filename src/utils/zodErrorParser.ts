/* eslint-disable @typescript-eslint/no-explicit-any */


export interface ParsedFieldError {
  fieldPath: string; 
  fieldName: string; 
  message: string; 
  type: string; 
  index?: number; 
  parentField?: string; 
}

export const parseZodErrors = (
  errors: any,
  fieldPath: string = ""
): ParsedFieldError[] => {
  const parsedErrors: ParsedFieldError[] = [];

  
  if (errors && typeof errors === "object") {
    
    if (errors.message && errors.type) {
      const fullPath = fieldPath;
      const fieldName =
        fieldPath.split(".").pop() || fieldPath.split("[").shift() || "";

      parsedErrors.push({
        fieldPath: fullPath,
        fieldName,
        message: errors.message,
        type: errors.type,
        parentField: fieldPath.includes(".")
          ? fieldPath.split(".").slice(0, -1).join(".")
          : undefined,
      });
      return parsedErrors;
    }

    
    Object.keys(errors).forEach((key) => {
      const currentPath = fieldPath ? `${fieldPath}.${key}` : key;
      const value = errors[key];

      
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item && typeof item === "object") {
            const arrayPath = `${currentPath}[${index}]`;

            
            if (item.message && item.type) {
              parsedErrors.push({
                fieldPath: arrayPath,
                fieldName: key,
                message: item.message,
                type: item.type,
                index,
                parentField: currentPath,
              });
            } else {
              
              parsedErrors.push(...parseZodErrors(item, arrayPath));
            }
          }
        });
      }
      
      else if (value && typeof value === "object") {
        
        if (value.message && value.type) {
          parsedErrors.push({
            fieldPath: currentPath,
            fieldName: key,
            message: value.message,
            type: value.type,
            parentField: fieldPath,
          });
        } else {
          
          parsedErrors.push(...parseZodErrors(value, currentPath));
        }
      }
    });
  }

  return parsedErrors;
};

/**
 * Función para obtener el primer error de un campo específico
 * @param errors - Errores de Zod
 * @param fieldName - Nombre del campo a buscar
 * @returns Error parseado o null
 */
export const getFirstErrorForField = (
  errors: any,
  fieldName: string
): ParsedFieldError | null => {
  const parsedErrors = parseZodErrors(errors);
  return (
    parsedErrors.find(
      (error) =>
        error.fieldName === fieldName ||
        error.fieldPath === fieldName ||
        error.fieldPath.includes(fieldName)
    ) || null
  );
};

/**
 * Función para obtener todos los errores de un campo específico
 * @param errors - Errores de Zod
 * @param fieldName - Nombre del campo a buscar
 * @returns Array de errores parseados
 */
export const getAllErrorsForField = (
  errors: any,
  fieldName: string
): ParsedFieldError[] => {
  const parsedErrors = parseZodErrors(errors);
  return parsedErrors.filter(
    (error) =>
      error.fieldName === fieldName ||
      error.fieldPath === fieldName ||
      error.fieldPath.includes(fieldName)
  );
};

/**
 * Función para obtener errores por tipo
 * @param errors - Errores de Zod
 * @param errorType - Tipo de error (invalid_type, custom, etc.)
 * @returns Array de errores parseados
 */
export const getErrorsByType = (
  errors: any,
  errorType: string
): ParsedFieldError[] => {
  const parsedErrors = parseZodErrors(errors);
  return parsedErrors.filter((error) => error.type === errorType);
};

/**
 * Función para formatear errores en un formato legible
 * @param errors - Errores de Zod
 * @returns String con errores formateados
 */
export const formatZodErrors = (errors: any): string => {
  const parsedErrors = parseZodErrors(errors);

  if (parsedErrors.length === 0) {
    return "No hay errores";
  }

  return parsedErrors
    .map((error) => {
      const fieldInfo =
        error.index !== undefined
          ? `${error.fieldName}[${error.index}]`
          : error.fieldName;
      return `${fieldInfo}: ${error.message}`;
    })
    .join("\n");
};

/**
 * Hook personalizado para manejar errores de Zod de forma más fácil
 */
export const useZodErrorParser = () => {
  return {
    parseErrors: parseZodErrors,
    getFirstError: getFirstErrorForField,
    getAllErrors: getAllErrorsForField,
    getErrorsByType,
    formatErrors: formatZodErrors,
  };
};
