import { noPictures } from "@itsa-develop/itsa-fe-components";
import { QueryClient } from "@tanstack/react-query";

export const APIS_VERSIONS = {
  security: import.meta.env.VITE_API_VERSION_SEC,
  core: import.meta.env.VITE_API_VERSION_CORE,
  inv: import.meta.env.VITE_API_VERSION_INV,
};

export const BASE_URL = import.meta.env.VITE_API;

export const CURRENT_MICRO_FRONTEND = import.meta.env.VITE_CURRENT_MICRO_FRONT;
export const CURRENT_SERVER_MICRO_FRONTEND = import.meta.env
  .VITE_CURRENT_SERVER_MICRO_FRONT;

export const MICRO_FRONTENDS = {
  backoffice: import.meta.env.VITE_MICRO_FRONTEND_BACKOFFICE,
  frontoffice: import.meta.env.VITE_MICRO_FRONTEND_FRONTOFFICE,
};

export const TYPE_ENVIRONMENT = import.meta.env.VITE_TYPE_ENVIRONMENT;

export const configQuery = {
  staleTime: 5 * 60 * 1000, // 5 minutos - los datos se consideran frescos por 5 minutos
  gcTime: 10 * 60 * 500, // 5 minutos - tiempo que se mantienen en cache
  retry: 1, // Solo reintentar una vez
  refetchOnWindowFocus: false, // No refetch al enfocar la ventana
  refetchOnReconnect: true, // Refetch al reconectar
};

export const KEY_STORE = {
  TOKEN: "token",
  REFRESH_TOKEN: "refresh_token",
  THEME: "theme",
  LAST_PATH: "lastPath",
};

export const errorsApi = {
  TOKEN_NOT_PROVIDED: "No se proporcionó token de autenticación.",
  TOKEN_NOT_VALID: "El token dado no es valido para ningun tipo de token",
};

export const basePath = "@/view";

export const permissionActions = {
  create: "create",
  update: "update",
};

export const FORM_IDS = {
  formClient: "formClient",
  formBasicPeople: "formBasicPeople",
};

export const DEFAULT_VALUES = {
  identificationTypeId: Number(
    import.meta.env.VITE_DEFAULT_IDENTIFICATION_TYPE_ID
  ),
  //countryId: Number(import.meta.env.VITE_DEFAULT_COUNTRY_ID),
  defaultCountryCode: import.meta.env.VITE_CONSTANT_COUNTRY,
};

//PAIS ECUADOR
//export const DEFAULT_COUNTRY = import.meta.env.VITE_CONSTANT_COUNTRY;

// //GOOGLE MAPS API KEY
// export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const LIST_TYPE_USER_ROLES = ["COD-ADMIN", "COD-USER"];

export const IMAGENS_DIRECTION = {
  noImage: noPictures,
};

export const DEFAULT_VALUES_FILTER = 0;

export const HEIGHT_TABLE = 720;

export const TAX_TYPE_CABE = {
  IVA: 1,
  ECO_VALUE: 2,
};
// Address type exclusions for specific business lines
export const VEHICLE_EXCLUDE_ADDRESS_TYPE_LABELS = ["ENTREGA"] as const;

export const OPTIONS_BOOLEAN = [
  { label: "Todos", value: 2 },
  { label: "Sí", value: 1 },
  { label: "No", value: 0 },
];

export const queryClient = new QueryClient();