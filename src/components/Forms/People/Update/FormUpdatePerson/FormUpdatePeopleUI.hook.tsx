import { IPeopleBasicData } from "@/view/Core/Maintenance/People/interfaces";
import { useForm, UseFormReturn, FieldErrors } from "react-hook-form";
import { IDataType, ICatalog } from "@/interface";
import { useErrorFormulario } from "@/hooks/useErrorNotification";
import { useZodErrorParser } from "@/utils/zodErrorParser";
import { useCallback, useEffect, useMemo } from "react";
import { useGetPersonById, peopleKeys } from "@/services/people/people.service";
import { useApiGetQuery } from "@/api/axiosMethods";
import { APIS_VERSIONS } from "@/constants";
import { API_ROUTES } from "@/api/routes";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useGetCountries, useGetTypesSubactEconomical } from "@/services/catalogs/catalog.service";
import { TNotificationProps, useModalResponsive, useNotification } from "@itsa-develop/itsa-fe-components";
import { FormBasicPeopleUI } from "../../Create/FormBasicPeople/FormBasicPeopleUI.controller";
import { useUpdatePerson } from "@/services/people/peopleUpdate.services";
import { useQueryClient } from "@tanstack/react-query";

export interface FormBasicPeopleUIHookProps {
  methods: UseFormReturn<IPeopleBasicData>;
  typesIdentifications: IDataType[];
  isLoadingTypesIdentifications: boolean;
  typesGender: IDataType[];
  isLoadingTypesGender: boolean;
  typesCivilStatus: IDataType[];
  isLoadingTypesCivilStatus: boolean;
  typesIdentificationSelect: string;
  countries: IDataType[];
  isValidForm?: boolean;
  handleFormSubmit: () => void;
  errorFormMessage: (errors: FieldErrors) => void;
  formatAllErrors: () => string;
  handleCantonChange: (cantonId: number) => void;
  isLoading: boolean;
  personData: IPeopleBasicData | undefined;
  civilStatusSelect: string;
  onChangeSpouse: (value?: number) => void;
  handleOpenModalAddSpouse: () => void;
  typesActEconomical: ICatalog[];
  typesSubactEconomical: ICatalog[];
  isLoadingTypesActEconomical: boolean;
  isLoadingTypesSubactEconomical: boolean;
  spousePersonData?: IPeopleBasicData;
  spouseFullName: string;
  isLoadingSpouseData: boolean;
  isDirty: boolean;
  isUpdating: boolean;
  openNotificationWithIcon: (notificationProps: TNotificationProps) => void;
  openModal: (config: {
    title: string;
    content: React.ReactNode;
    height?: string | "auto";
    footer?: React.ReactNode;
    closable?: boolean;
  }) => void;
  closeModal: () => void;
}

export interface UseFormBasicPeopleUIOptions {
  onSuccessUpdate?: () => void;
}


export const useFormBasicPeopleUI = (
  personId: number,
  options?: UseFormBasicPeopleUIOptions
): FormBasicPeopleUIHookProps => {
  const { formatErrors } = useZodErrorParser();
  const { openNotificationWithIcon } = useNotification();
  const queryClient = useQueryClient();
  const { data: personData, isLoading, isError } = useGetPersonById(personId);
  const { openModal, closeModal } = useModalResponsive();
  const methods = useForm<IPeopleBasicData>({
    mode: "all",
  });

  useEffect(() => {
    if (personData) {
      methods.reset(personData);
    }
  }, [personData, methods]);

  const {
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = methods;

  const { errorFormMessage } = useErrorFormulario();
  const { listTypesIdentifications, isLoadingTypesIdentifications } = useCatalogs();
  const { listTypesGender, isLoadingTypesGender } = useCatalogs();
  const { listTypesCivilStatus, isLoadingTypesCivilStatus } = useCatalogs();
  const { listTypesActEconomical, isLoadingTypesActEconomical } = useCatalogs();
  const { data: countries } = useGetCountries();
  const { mutate: updatePerson, isPending: isUpdating } = useUpdatePerson(personId, {
    onSuccess: () => {
      openNotificationWithIcon({
        type: "success",
        message: "Persona actualizada",
        description: "La información se ha actualizado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: peopleKeys.personById(personId) });
      options?.onSuccessUpdate?.();
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || "Error al actualizar";
      openNotificationWithIcon({
        type: "error",
        message: "Error al actualizar",
        description: errorMessage,
      });
    },
  });

  const onSubmit = useCallback((data: IPeopleBasicData) => {
    const payload: {
      catalogActEconomicalId?: number;
      catalogSubactEconomicalId?: number | null;
      naturalPersonData?: {
        id?: number;
        names?: string;
        lastNames?: string;
        genderId?: number;
        civilStatusId?: number;
        birthCountryId?: number;
        birthDate?: string;
        spouseIdentificationId?: number;
      };
      legalPersonData?: {
        id?: number;
        socialReason?: string;
      };
    } = {};

    // Incluir catalogActEconomicalId si existe
    if (data.catalogActEconomicalId) {
      payload.catalogActEconomicalId = data.catalogActEconomicalId;
    }

    // Incluir catalogSubactEconomicalId: el valor si existe, null si la actividad no tiene subactividades
    if (data.catalogSubactEconomicalId) {
      payload.catalogSubactEconomicalId = data.catalogSubactEconomicalId;
    } else if (data.catalogActEconomicalId) {
      // Si hay actividad económica pero no subactividad, enviar null explícitamente
      payload.catalogSubactEconomicalId = null;
    }

    if (data.naturalPersonData) {
      const naturalData = data.naturalPersonData as { id?: number } & typeof data.naturalPersonData;
      payload.naturalPersonData = {
        id: naturalData.id,
        names: naturalData.names,
        lastNames: naturalData.lastNames,
        genderId: naturalData.genderId,
        civilStatusId: naturalData.civilStatusId,
        birthCountryId: naturalData.birthCountryId,
        birthDate: naturalData.birthDate,
        spouseIdentificationId: naturalData.spouseIdentificationId,
      };
    }

    if (data.legalPersonData) {
      const legalData = data.legalPersonData as { id?: number } & typeof data.legalPersonData;
      payload.legalPersonData = {
        id: legalData.id,
        socialReason: legalData.socialReason,
      };
    }

    updatePerson({ data: payload });
  }, [updatePerson]);

  const civilStatusId = methods.watch("naturalPersonData.civilStatusId");
  const typeActEconomicalId = methods.watch("catalogActEconomicalId") as number | undefined;
  const catalogSubactEconomicalId = methods.watch("catalogSubactEconomicalId");
  const spouseIdentificationId = methods.watch("naturalPersonData.spouseIdentificationId");

  const {
    data: listTypesSubactEconomical = [],
    isLoading: isLoadingTypesSubactEconomical,
  } = useGetTypesSubactEconomical(
    { economicActivityId: typeActEconomicalId },
    { enabled: !!typeActEconomicalId }
  );

  // Limpiar catalogSubactEconomicalId cuando cambie la actividad económica
  // o cuando no haya subactividades disponibles
  useEffect(() => {
    if (typeActEconomicalId && !isLoadingTypesSubactEconomical) {
      if (listTypesSubactEconomical.length === 0) {
        // Si la actividad no tiene subactividades, limpiar el campo
        if (catalogSubactEconomicalId) {
          setValue("catalogSubactEconomicalId", undefined, { shouldDirty: true });
        }
      } else {
        // Si hay subactividades pero el valor actual no está en la lista, limpiar
        const isValidSubactivity = listTypesSubactEconomical.some(
          (item) => item.value === catalogSubactEconomicalId
        );
        if (catalogSubactEconomicalId && !isValidSubactivity) {
          setValue("catalogSubactEconomicalId", undefined, { shouldDirty: true });
        }
      }
    }
  }, [typeActEconomicalId, listTypesSubactEconomical, isLoadingTypesSubactEconomical, catalogSubactEconomicalId, setValue]);

  const typesIdentificationSelect = useMemo(() => {
    const type = listTypesIdentifications?.find(
      (type) => type.value === personData?.identificationTypeId
    );
    return type?.code ?? "";
  }, [personData?.identificationTypeId, listTypesIdentifications]);

  const civilStatusSelect = useMemo(() => {
    const type = listTypesCivilStatus?.find(
      (type) => type.value === civilStatusId
    );
    return type?.code ?? "";
  }, [civilStatusId, listTypesCivilStatus]);

  // Obtener datos del cónyuge usando el ID (spouseIdentificationId es el ID de la persona cónyuge)
  // Solo hacer la consulta cuando hay un spouseIdentificationId válido y el estado civil es casado
  const shouldFetchSpouse = !!spouseIdentificationId && civilStatusSelect === "TD066";

  const { data: spousePersonData, isLoading: isLoadingSpouseData } = useApiGetQuery<
    undefined,
    IPeopleBasicData
  >(
    peopleKeys.personById(spouseIdentificationId || 0),
    `${APIS_VERSIONS.core}${API_ROUTES.people}${spouseIdentificationId}/`,
    undefined,
    { enabled: shouldFetchSpouse }
  );

  // Construir el nombre completo del cónyuge para mostrar
  const spouseFullName = useMemo(() => {
    if (!spousePersonData?.naturalPersonData) return "";
    const { names, lastNames } = spousePersonData.naturalPersonData;
    return `${names} ${lastNames}`.trim();
  }, [spousePersonData]);

  const handleFormSubmit = useCallback(() => {
    if (Object.keys(errors).length > 0) {
      errorFormMessage(errors);
      return;
    }
    handleSubmit(onSubmit, errorFormMessage)();
  }, [errorFormMessage, errors, handleSubmit, onSubmit]);

  const handleCantonChange = useCallback(
    (cantonId: number) => {
      setValue("naturalPersonData.birthCantonId", cantonId);
    },
    [setValue]
  );

  const formatAllErrors = (): string => {
    const formErrors = methods.formState.errors;
    return formatErrors(formErrors);
  };

  const onChangeSpouse = (value?: number) => {
    setValue("naturalPersonData.spouseIdentificationId", value ?? undefined, { shouldDirty: true });
  };

  const handleOpenModalAddSpouse = () => {
    openModal({
      title: "Agregar persona",
      content: <FormBasicPeopleUI />,
      height: "85dvh",
    });
  };

  const isLoadingPerson = isError === true ? false : isLoading;

  return {
    methods,
    typesIdentifications: listTypesIdentifications,
    isLoadingTypesIdentifications,
    typesGender: listTypesGender,
    isLoadingTypesGender,
    typesCivilStatus: listTypesCivilStatus,
    isLoadingTypesCivilStatus,
    typesIdentificationSelect,
    countries: countries || [],
    errorFormMessage,
    formatAllErrors,
    handleFormSubmit,
    handleCantonChange,
    isLoading: isLoadingPerson,
    personData,
    civilStatusSelect,
    onChangeSpouse,
    handleOpenModalAddSpouse,
    typesActEconomical: listTypesActEconomical,
    typesSubactEconomical: listTypesSubactEconomical,
    isLoadingTypesActEconomical,
    isLoadingTypesSubactEconomical,
    spousePersonData,
    spouseFullName,
    isLoadingSpouseData,
    isDirty,
    isUpdating,
    openNotificationWithIcon,
    openModal,
    closeModal,
  };
};
