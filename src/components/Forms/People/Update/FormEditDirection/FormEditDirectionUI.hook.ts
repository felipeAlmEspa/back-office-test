import { IDataType } from "@/interface";
import { schemaDirectionData } from "@/view/Core/Maintenance/People/create/schemaCreatePerson";
import { IDirectionResponse } from "@/view/Core/Maintenance/People/interfaces";
import { useEffect, useMemo, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useErrorFormulario } from "@/hooks/useErrorNotification";
import { useCatalogs } from "@/hooks/useCatalogs";
import {
  cleanObject,
  useModalResponsive,
  useNotification,
} from "@itsa-develop/itsa-fe-components";
import { useUpdateDirectionPeople } from "@/services/people/peopleUpdate.services";
import {
  IUpdateDirectionPeople,
  IUpdateDirectionPeopleRequest,
} from "../interfaces";
import {
  LocationSelectorHookProps,
  useLocationSelectorUI,
} from "@/components/Render/LocationSelector/LocationSelectorUI.hook";

export interface FormEditDirectionUIHookProps {
  typesAddress: IDataType[];
  isLoadingTypesAddress: boolean;
  locationSelectorHook: LocationSelectorHookProps;
  control: Control<IDirectionResponse>;
  handleSubmitForm: () => void;
  isLoadingUpdate: boolean;
  closeModal: () => void;
  tabActive: string;
  setTabActive: (tab: string) => void;
  hasStreetNumber: boolean;
  hasLatitude: boolean;
  hasLongitude: boolean;
  hasPostalCode: boolean;
}

interface UseFormEditDirectionUIProps {
  directionData: IDirectionResponse;
  personId: number;
  onSuccess?: () => void;
}

export const useFormEditDirectionUI = ({
  directionData,
  personId,
  onSuccess,
}: UseFormEditDirectionUIProps): FormEditDirectionUIHookProps => {
  const { closeModal } = useModalResponsive();
  const { openNotificationWithIcon } = useNotification();
  const { listTypesAddress, isLoadingTypesAddress } = useCatalogs();
  const { errorFormMessage } = useErrorFormulario();
  const [tabActive, setTabActive] = useState("manual");

  const { mutate: updateDirection, isPending: isLoadingUpdate } =
    useUpdateDirectionPeople();

  // Normalizar los datos para asegurar que los campos numéricos sean números
  const normalizedDirectionData = useMemo((): IDirectionResponse => {
    const parseNumber = (value: unknown): number | undefined => {
      if (value === null || value === undefined || value === "") return undefined;
      const num = typeof value === "string" ? parseFloat(value) : Number(value);
      return isNaN(num) ? undefined : num;
    };

    return {
      ...directionData,
      id: typeof directionData.id === "string" ? parseInt(directionData.id, 10) : directionData.id,
      addressTypeId: typeof directionData.addressTypeId === "string" 
        ? parseInt(directionData.addressTypeId, 10) 
        : directionData.addressTypeId,
      cantonId: typeof directionData.cantonId === "string" 
        ? parseInt(directionData.cantonId, 10) 
        : directionData.cantonId,
      parishId: directionData.parishId 
        ? (typeof directionData.parishId === "string" ? parseInt(directionData.parishId, 10) : directionData.parishId)
        : undefined,
      latitude: parseNumber(directionData.latitude),
      longitude: parseNumber(directionData.longitude),
      streetNumber: directionData.streetNumber || undefined,
      postalCode: directionData.postalCode || undefined,
      secondaryStreet: directionData.secondaryStreet || undefined,
      reference: directionData.reference || undefined,
    };
  }, [directionData]);

  const { control, handleSubmit, setValue, reset } = useForm<IDirectionResponse>({
    resolver: zodResolver(schemaDirectionData),
    mode: "onChange",
    defaultValues: normalizedDirectionData,
  });

  // Reset form when directionData changes
  useEffect(() => {
    reset(normalizedDirectionData);
  }, [normalizedDirectionData, reset]);

  const typesAddress = useMemo(() => {
    if (listTypesAddress && !isLoadingTypesAddress) {
      return listTypesAddress;
    }
    return [];
  }, [listTypesAddress, isLoadingTypesAddress]);

  const onChangeCanton = (value: number) => {
    setValue("cantonId", value);
  };

  const onChangeParish = (value: number) => {
    setValue("parishId", value);
  };

  const locationSelectorHook = useLocationSelectorUI({
    initParams: {
      onChangeCountry: () => {},
      onChangeProvince: () => {},
      onChangeCanton,
      onChangeParish,
      aloneEcuador: true,
      valueCantonId: directionData.cantonId,
      valueParishId: directionData.parishId,
    },
  });

  const onSubmit = (data: IDirectionResponse) => {
    // Convertir valores string a number para latitude y longitude
    const parseNumberValue = (value: unknown): number | undefined => {
      if (value === null || value === undefined || value === "") return undefined;
      const num = typeof value === "string" ? parseFloat(value) : Number(value);
      return isNaN(num) ? undefined : num;
    };
    
    const directionToUpdate: IUpdateDirectionPeople = cleanObject({
      directionId: data.id,
      addressTypeId: data.addressTypeId,
      primaryStreet: data.primaryStreet,
      secondaryStreet: data.secondaryStreet,
      reference: data.reference,
      streetNumber: data.streetNumber,
      postalCode: data.postalCode,
      cantonId: data.cantonId,
      parishId: data.parishId,
      latitude: parseNumberValue(data.latitude),
      longitude: parseNumberValue(data.longitude),
      isActive: data.isActive,
    });
    
    const dataToUpdateRequest: IUpdateDirectionPeopleRequest = {
      personId: personId,
      directions: [directionToUpdate],
    };

    updateDirection(
      { data: dataToUpdateRequest },
      {
        onSuccess: () => {
          openNotificationWithIcon({
            type: "success",
            message: "Dirección actualizada correctamente",
          });
          closeModal();
          onSuccess?.();
        },
        onError: () => {
          openNotificationWithIcon({
            type: "error",
            message: "Error al actualizar la dirección",
          });
        },
      }
    );
  };

  const handleSubmitForm = handleSubmit(onSubmit, (errors) => {
    errorFormMessage(errors);
  });

  // Determinar si los campos tienen valores para mostrarlos u ocultarlos
  const hasStreetNumber = !!(directionData.streetNumber && directionData.streetNumber.trim() !== "");
  const hasLatitude = directionData.latitude !== null && directionData.latitude !== undefined;
  const hasLongitude = directionData.longitude !== null && directionData.longitude !== undefined;
  const hasPostalCode = !!(directionData.postalCode && directionData.postalCode.trim() !== "");

  return {
    typesAddress,
    isLoadingTypesAddress,
    locationSelectorHook,
    control,
    handleSubmitForm,
    isLoadingUpdate,
    closeModal,
    tabActive,
    setTabActive,
    hasStreetNumber,
    hasLatitude,
    hasLongitude,
    hasPostalCode,
  };
};
