import { useCatalogs } from "@/hooks/useCatalogs";
import { schemaDirectionDataArray } from "@/view/Core/Maintenance/People/create/schemaCreatePerson";
import { useGetDirections } from "@/services/people/people.service";
import { IDirectionResponse } from "@/view/Core/Maintenance/People/interfaces";
import { useCallback, useEffect, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useErrorFormulario } from "@/hooks/useErrorNotification";
import {
  IUpdateDirectionPeople,
  IUpdateDirectionPeopleRequest,
} from "../interfaces";
import { useUpdateDirectionPeople } from "@/services/people/peopleUpdate.services";
import { useNotification } from "@itsa-develop/itsa-fe-components";

export interface FormUpdateDirectionUIHookProps {
  methods: UseFormReturn<{ directionData: IDirectionResponse[] }>;
  handleFormSubmit: () => void;
  isLoading: boolean;
  isLoadingTypesAddress: boolean;
  isLoadingUpdateDirection: boolean;
  canSubmit: boolean;
  personId: number;
  onRefresh: () => void;
}

export interface UseFormUpdateDirectionUIOptions {
  onSuccessUpdate?: () => void;
}

export const useFormUpdateDirectionUI = (
  personId: number,
  options?: UseFormUpdateDirectionUIOptions
): FormUpdateDirectionUIHookProps => {
  const { openNotificationWithIcon } = useNotification();
  const { errorFormMessage } = useErrorFormulario();
  const { data: directionsData, isLoading, refetch } = useGetDirections({ personId });
  
  const directionsDataArray = useMemo(
    () => directionsData?.data ?? [],
    [directionsData]
  );
  const { isLoadingTypesAddress } = useCatalogs();
  const { mutate: updateDirection, isPending: isLoadingUpdateDirection } =
    useUpdateDirectionPeople();

  const methods = useForm<{ directionData: IDirectionResponse[] }>({
    resolver: zodResolver(schemaDirectionDataArray),
    mode: "all",
  });

  const { reset, getValues, formState } = methods;
  useEffect(() => {
    reset({ directionData: directionsDataArray ?? [] });
  }, [directionsDataArray, reset]);

  const onSubmit = (data: IDirectionResponse[]) => {
    const dataToUpdate: IUpdateDirectionPeople[] = data.map((direction) => {
      const newValidDirection: IUpdateDirectionPeople = {
        addressTypeId: direction.addressTypeId,
        primaryStreet: direction.primaryStreet,
        secondaryStreet: direction.secondaryStreet ?? undefined,
        reference: direction.reference ?? undefined,
        streetNumber: direction.streetNumber ?? undefined,
        postalCode: direction.postalCode ?? undefined,
        cantonId: direction.cantonId,
        parishId: direction.parishId ?? undefined,
        latitude: direction.latitude,
        longitude: direction.longitude,
        directionId: direction.id,
        isActive: direction.isActive ?? true,
      };
      return newValidDirection;
    });
    const dataToUpdateRequest: IUpdateDirectionPeopleRequest = {
      personId: personId,
      directions: dataToUpdate,
    };
    updateDirection(
      { data: dataToUpdateRequest },
      {
        onSuccess: () => {
          openNotificationWithIcon({
            type: "success",
            message: "Direcciones actualizadas correctamente",
          });
          const current = getValues();
          reset(current);
          options?.onSuccessUpdate?.();
        },
      }
    );
  };

  const handleFormSubmit = methods.handleSubmit((data) => {
    onSubmit(data.directionData);
  }, errorFormMessage);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    methods,
    handleFormSubmit,
    isLoading,
    isLoadingTypesAddress,
    isLoadingUpdateDirection,
    canSubmit: formState.isDirty,
    personId,
    onRefresh,
  };
};
