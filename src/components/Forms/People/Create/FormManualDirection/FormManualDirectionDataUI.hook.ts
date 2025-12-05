import {
  LocationSelectorHookProps,
  useLocationSelectorUI,
} from "@/components/Render/LocationSelector/LocationSelectorUI.hook";
import { IDataType } from "@/interface";
import { schemaDirectionData } from "@/view/Core/Maintenance/People/create/schemaCreatePerson";
import { IDirection } from "@/view/Core/Maintenance/People/interfaces";
import { useMemo, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormManualDirectionDataUIControllerProps } from "./FormManualDirectionDataUI.controller";
import { useErrorFormulario } from "@/hooks/useErrorNotification";
import { useCatalogs } from "@/hooks/useCatalogs";
import { IGoogleAutoCompleteProps } from "node_modules/@itsa-develop/itsa-fe-components/dist/components/InputAddress";
import { useModalResponsive } from "@itsa-develop/itsa-fe-components";

export interface FormManualDirectionDataUIHookProps {
  typesAddress: IDataType[];
  locationSelectorHook: LocationSelectorHookProps;
  control: Control<IDirection>;
  handleSubmitForm: () => void;
  googleAutoCompleteProps: IGoogleAutoCompleteProps;
  tabActive: string;
  setTabActive: (tab: string) => void;
  setNewAddress: (address: unknown) => void;
  closeModal: () => void;
}

export const useFormManualDirectionDataUI = ({
  onSaveDirection,
  googleAutoCompleteProps,
}: FormManualDirectionDataUIControllerProps): FormManualDirectionDataUIHookProps => {
  const { closeModal } = useModalResponsive();
  const { listTypesAddress, isLoadingTypesAddress } = useCatalogs();
  const { errorFormMessage } = useErrorFormulario();
  const { control, handleSubmit, setValue } = useForm<IDirection>({
    resolver: zodResolver(schemaDirectionData),
    mode: "onChange",
  });
  const [tabActive, setTabActive] = useState("map");
  const [newAddress, setNewAddress] = useState<unknown>(null);
  const handleSubmitForm = handleSubmit(onSaveDirection, errorFormMessage);

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
    },
  });

  const handleSaveFromMap = () => {
    if (tabActive === "map") {
      if (newAddress) {
        googleAutoCompleteProps.onLocationChange(newAddress);
        closeModal();
        return;
      }
    }

    if (tabActive === "manual") {
      handleSubmitForm();
      return;
    }

    return;
  };

  return {
    typesAddress,
    locationSelectorHook,
    control,
    handleSubmitForm: handleSaveFromMap,
    googleAutoCompleteProps,
    tabActive,
    setTabActive,
    setNewAddress,
    closeModal,
  };
};
