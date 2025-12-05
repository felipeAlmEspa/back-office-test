import { errorsApi, MICRO_FRONTENDS, permissionActions } from "@/constants";
import type { AxiosErrorType } from "@/types/axios";
import {
  clearLocalStorage,
  EMicroFrontends,
  IAgency,
  IItemTreeNode,
  ISubmodule,
  useAppLayoutStore,
} from "@itsa-develop/itsa-fe-components";
import { FieldErrors } from "react-hook-form";
import { DataNode } from "antd/es/tree";
import { DefaultOptionType } from "antd/es/select";
import { arrayRoutes, IRouteLazy } from "@/router/PrivateRoutes";
import {
  IAddressGoogleObject,
  IDirection,
} from "@/view/Core/Maintenance/People/interfaces";
import { IDataType } from "@/interface";
import { ISubclassesTreeNode } from "@/view/Spares/Maintenance/Subclasses/interfaces";

export const apiValidateAuthToken = (error: AxiosErrorType) => {
  if (
    error.response?.data.message === errorsApi.TOKEN_NOT_PROVIDED ||
    error.response?.data.message === errorsApi.TOKEN_NOT_VALID
  ) {
    clearLocalStorage();
    window.location.href = "/login";
  }
  return error;
};

type FilterOption = {
  text: string;
  value: string | number | boolean | null;
};

export function generateColumnFilters<TRecord extends Record<string, unknown>>(
  records: TRecord[],
  key: keyof TRecord,
  options?: {
    mapLabel?: (value: unknown, record?: TRecord) => string;
    mapValue?: (
      value: unknown,
      record?: TRecord
    ) => string | number | boolean | null;
    includeNull?: boolean;
    limit?: number;
    sort?: (a: FilterOption, b: FilterOption) => number;
  }
): FilterOption[] {
  const {
    mapLabel,
    mapValue,
    includeNull = false,
    limit,
    sort,
  } = options ?? {};

  const seen = new Set<string>();
  const filters: FilterOption[] = [];

  for (const record of records) {
    const raw = record[key] as unknown;
    const value = mapValue
      ? mapValue(raw, record)
      : (raw as string | number | boolean | null);
    const isNullish = value === undefined || value === null || value === "";

    if (!includeNull && isNullish) {
      continue;
    }

    const label = mapLabel ? mapLabel(raw, record) : String(value ?? "");
    const identity = `${typeof value}:${value as unknown as string}`;

    if (!seen.has(identity)) {
      seen.add(identity);
      filters.push({ text: label, value: value ?? null });
    }

    if (limit && filters.length >= limit) {
      break;
    }
  }

  if (sort) {
    filters.sort(sort);
  } else {
    // Default sort by text (case-insensitive)
    filters.sort((a, b) =>
      a.text.localeCompare(b.text, undefined, { sensitivity: "base" })
    );
  }

  return filters;
}

export const joinmModPath = (base: string, path: string) =>
  `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

export function getFirstSegment(path: string): string {
  if (!path) return "";
  return path.split("/")[0] ?? "";
}

export function getLastSegment(path: string): string {
  if (!path) return "";
  const [beforeQuery = ""] = path.split("?");
  const [beforeHash = ""] = beforeQuery.split("#");
  const trimmed = beforeHash.replace(/\/+$/, "");
  if (!trimmed) return "";
  const segments = trimmed.split("/").filter(Boolean);
  if (segments.length === 0) return "";
  const last = segments.pop() ?? "";
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

export function getFormModeFromPath(path: string): number | null {
  const action = getLastSegment(path).toLowerCase();

  if (action === permissionActions.create) {
    return 1;
  }

  if (action === permissionActions.update) {
    return 2;
  }

  return null;
}

export const errorMessageForm = (errors: FieldErrors): string => {
  const findAllErrorMessages = (errors: FieldErrors, prefix = ""): string[] => {
    const messages: string[] = [];

    for (const key in errors) {
      const error = errors[key];
      if (!error) continue;

      const fieldPath = prefix ? `${prefix}.${key}` : key;

      if ("message" in error && error.message) {
        messages.push(`• ${error.message as string}`);
      } else if (typeof error === "object" && !Array.isArray(error)) {
        const nested = findAllErrorMessages(error as FieldErrors, fieldPath);
        messages.push(...nested);
      }
    }
    return messages;
  };

  const allMessages = findAllErrorMessages(errors);

  if (allMessages.length === 0) {
    return "Error de validación";
  }

  if (allMessages.length === 1) {
    return (allMessages[0] ?? "").replace("• ", "");
  }

  return allMessages.join("\n");
};

export const updateTreeData = (
  list: DataNode[],
  key: React.Key,
  children: DataNode[]
): DataNode[] =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

export const filterOptions = (input: string, option?: DefaultOptionType) =>
  ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase());

export const flattenErrors = (
  errors: Record<string, string[] | string>
): string => {
  return Object.entries(errors)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: ${value.join(" | ")}`;
      }
      return `${key}: ${value}`;
    })
    .join("\n");
};

const normalizePath = (value: string | null | undefined): string => {
  if (!value) return "";
  return value.replace(/^\/+|\/+$/g, "").toLowerCase();
};

export const findProgramIdByPathFromAgencies = (
  agencies: IAgency[] | undefined,
  path: string
): number | null => {
  if (!agencies || !Array.isArray(agencies) || !path) return null;

  const target = normalizePath(path);
  if (!target) return null;

  const checkPrograms = (programs?: ISubmodule[] | null): number | null => {
    if (!programs) return null;
    for (const program of programs) {
      if (normalizePath(program?.path ?? null) === target) {
        return program.id;
      }
    }
    return null;
  };

  for (const agency of agencies) {
    const modules = agency?.modules ?? [];
    for (const mod of modules ?? []) {
      const foundAtModule = checkPrograms(mod?.submodules ?? []);
      if (foundAtModule !== null) return foundAtModule;

      const submodules = mod?.submodules ?? [];
      for (const sub of submodules ?? []) {
        const foundAtSub = checkPrograms(sub?.programs ?? []);
        if (foundAtSub !== null) return foundAtSub;

        const groups = sub?.groups ?? [];
        for (const group of groups ?? []) {
          const foundAtGroup = checkPrograms(group?.programs ?? []);
          if (foundAtGroup !== null) return foundAtGroup;
        }
      }
    }
  }

  return null;
};

export const findProgramIdByPath = (path: string): number | null => {
  const agencies: IAgency[] | undefined =
    useAppLayoutStore?.getState?.()?.agencies ?? [];
  return findProgramIdByPathFromAgencies(agencies, path);
};

export const normalizeParamsApi = (value: string): string | null => {
  if (!value) return null;
  return value;
};

export const rqMsg = (message?: string): string => {
  return `El campo ${message ?? ""} es requerido`;
};

export const typeMsg = (): string => {
  return `El tipo de dato es incorrecto`;
};

export const minMsg = (minValue: number): string => {
  return `El campo debe ser mayor a ${minValue}`;
};

export const maxMsg = (maxValue: number): string => {
  return `El campo debe ser menor a ${maxValue}`;
};

export const debounceStringFunction = (
  fn: (value: string) => void,
  delay: number
) => {
  let timer: ReturnType<typeof setTimeout>;
  return (value: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(value), delay);
  };
};

export const findFullPath = (target: string): string | null => {
  const normalizedTarget = (target ?? "").toLowerCase();
  function dfs(nodes: IRouteLazy[], prefix = ""): string | null {
    for (const node of nodes) {
      const currentPath = node.path ? `${prefix}${node.path}` : prefix;
      // Coincidencia incluyendo parámetros
      const normalizedCurrent = currentPath.toLowerCase();
      if (normalizedCurrent.includes(normalizedTarget)) {
        return currentPath;
      }
      if (node.children) {
        const childResult = dfs(node.children, `${currentPath}/`);
        if (childResult) return childResult;
      }
    }
    return null;
  }
  return dfs(arrayRoutes);
};

export const validateIdNumber = (id?: number): number | undefined => {
  try {
    const idString = String(id);
    const validNumber = parseInt(idString);
    return validNumber;
  } catch {
    return undefined;
  }
};

//Tranform google Address to IDirection
export const transformGoogleAddressToIDirection = (
  addressObj: IAddressGoogleObject,
  typesDirection: IDataType[],
  cantonId: number
) => {
  const addressTypeId = typesDirection[0]?.value;
  const primaryStreet = addressObj.intersection
    ? addressObj.intersection?.long_name.split("&")[0]
    : addressObj.route?.long_name;
  const secondaryStreet = addressObj.intersection
    ? addressObj.intersection?.long_name.split("&")[1]
    : "";
  if (addressTypeId && primaryStreet) {
    const addressData: IDirection = {
      addressTypeId: addressTypeId,
      primaryStreet: primaryStreet,
      secondaryStreet: secondaryStreet || "",
      cantonId: cantonId,
      latitude: addressObj.lat || 0,
      longitude: addressObj.long || 0,
      postalCode: addressObj.postal_code?.long_name || "",
      streetNumber: addressObj.street_number?.long_name || "",
    };
    return addressData;
  } else {
    return null;
  }
};
export const navigateToMicroFrontend = async (
  entorno: string,
  newParamsNewMicro: string
) => {
  switch (entorno) {
    case EMicroFrontends.itsaBackOffice:
      window.location.replace(
        `${MICRO_FRONTENDS.backoffice}${newParamsNewMicro}`
      );
      break;
    case EMicroFrontends.itsaFrontoffice:
      window.location.replace(
        `${MICRO_FRONTENDS.frontoffice}${newParamsNewMicro}`
      );
      break;
  }
};

export const errorMessageItemExists = (message: string): string => {
  const text = message ?? "";
  if (!text) return "";
  if (text.toLowerCase().includes("ya existe")) {
    return "Por favor revisar los items inactivos";
  }
  return text;
};

export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") return false;
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  
  return emailRegex.test(email.trim());
};
export const filterTreeNodes = (
  nodes: IItemTreeNode[],
  searchText: string
): IItemTreeNode[] => {
  if (!searchText.trim()) {
    return nodes;
  }

  const lowerSearchText = searchText.toLowerCase();

  return nodes
    .map((node) => {
      const name = String(node.name || "").toLowerCase();
      const matches = name.includes(lowerSearchText);

      // Filtrar recursivamente los hijos
      const filteredChildren = filterTreeNodes(node.children, searchText);

      // Si el nodo coincide o tiene hijos que coinciden, incluirlo
      if (matches || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
        };
      }

      return null;
    })
    .filter((node): node is IItemTreeNode => node !== null);
};


export const transformDataSubClassesToTreeNode = (
  data?: ISubclassesTreeNode[]
): IItemTreeNode[] => {
  if (!data) return [];
  const transformNode = (node: ISubclassesTreeNode, level: number = 0): IItemTreeNode => {
    return {
      id: node.id,
      name: node.name,
      active: node.isActive,
      parentId: node.parentSubclassId ?? undefined,
      fatherAllName: node.className,
      fatherAllId: node.classId,
      level,
      children: node.children?.map((child) => transformNode(child, level + 1)) ?? [],
    };
  };

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((node) => transformNode(node, 0));
};

export const normalizeString = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
};

export const getAgeFromISODate = (isoDate: string, todayDate?: Date): number | null => {
  if (!isoDate || typeof isoDate !== "string") return null;
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!year || !month || !day) return null;

  // Use UTC to avoid timezone/daylight issues
  const birthUTC = new Date(Date.UTC(year, month - 1, day));
  if (isNaN(birthUTC.getTime())) return null;

  const today = todayDate ?? new Date();
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  let age = todayUTC.getUTCFullYear() - birthUTC.getUTCFullYear();
  const m = todayUTC.getUTCMonth() - birthUTC.getUTCMonth();
  if (m < 0 || (m === 0 && todayUTC.getUTCDate() < birthUTC.getUTCDate())) {
    age--;
  }
  return age;
};

export const isAdultByBirthDate = (isoDate: string, minAge = 18, todayDate?: Date): boolean => {
  const age = getAgeFromISODate(isoDate, todayDate);
  if (age === null) return false;
  return age >= minAge;
};
