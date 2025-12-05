import { IDataType } from "@/interface";
import {
  IAddressGoogleObject,
  IDirection,
  IDirectionResponse,
} from "@/view/Core/Maintenance/People/interfaces";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Control,
  FieldValues,
  //FieldValues,
  useFieldArray,
  UseFieldArrayRemove,
  useFormContext,
  //UseFormReturn,
} from "react-hook-form";
import { IGoogleAutoCompleteProps } from "node_modules/@itsa-develop/itsa-fe-components/dist/components/InputAddress";
import {
  GOOGLE_API_KEY,
  ImageMaintenance,
  useModalResponsive,
  useNotification,
} from "@itsa-develop/itsa-fe-components";
import { transformGoogleAddressToIDirection } from "@/helper";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useGetCantonsByName } from "@/services/catalogs/catalog.service";
import { FormManualDirectionDataUI } from "../FormManualDirection/FormManualDirectionDataUI.controller";
import { FormEditDirectionUI } from "../../Update/FormEditDirection/FormEditDirectionUI.controller";
import { useCreateDirection } from "@/services/people/peopleUpdate.services";

export interface FormDirectionDataUIHookProps {
  typesDirection: IDataType[];
  isLoadingTypesAddress: boolean;
  //methods: UseFormReturn<FieldValues>;
  fields: Record<"id", string>[];
  remove: UseFieldArrayRemove;
  googleAutoCompleteProps: IGoogleAutoCompleteProps;
  control: Control<FieldValues>;
  setShowManualEntry: () => void;
  openModalUploadImagen: () => void;
  openEditDirectionModal: (direction: IDirectionResponse) => void;
  personId?: number;
}

type UseFormDirectionDataUIOptions = {
  excludeAddressTypeCodes?: string[];
  excludeAddressTypeLabels?: string[];
  personId?: number;
  onRefresh?: () => void;
};

export const useFormDirectionDataUI = (options?: UseFormDirectionDataUIOptions): FormDirectionDataUIHookProps => {
  //const methods = useFormContext();
  const { control } = useFormContext();
  const { openModal, closeModal } = useModalResponsive();
  const { openNotificationWithIcon } = useNotification();
  const { listTypesAddress, isLoadingTypesAddress } = useCatalogs();
  const { fields, remove, append } = useFieldArray({
    control,
    name: "directionData",
  });

  const { mutate: createDirection } = useCreateDirection();

  const [cantonName, setCantonName] = useState<string>("");
  const [pendingAddress, setPendingAddress] =
    useState<IAddressGoogleObject | null>(null);
  const [pendingMapAddress, setPendingMapAddress] = useState<{
    primaryStreet: string;
    latitude: number;
    longitude: number;
    postalCode?: string;
  } | null>(null);

  const cleanCantonName = useCallback((rawName: string): string => {
    if (!rawName) return "";
    const cleaned = rawName
      .replace(/^Cantón\s+/i, "")
      .replace(/^Distrito\s+Metropolitano\s+de\s+/i, "")
      .replace(/^Distrito\s+/i, "")
      .trim();
    return cleaned;
  }, []);

  const { data: cantons, isError: isCantonError, isFetched: isCantonFetched } = useGetCantonsByName(
    { cantonName: cleanCantonName(cantonName) },
    { enabled: cantonName !== "" }
  );

  // Referencia para evitar mostrar la notificación múltiples veces
  const hasShownErrorRef = useRef(false);

  const typesDirection = useMemo(() => {
    if (listTypesAddress && !isLoadingTypesAddress) {
      return listTypesAddress;
    }
    return [];
  }, [listTypesAddress, isLoadingTypesAddress]);

  useEffect(() => {
    if (isCantonFetched && cantonName !== "" && (pendingAddress || pendingMapAddress)) {
      const hasValidCanton = cantons && cantons.length > 0 && cantons[0]?.cantonId;
      
      if (isCantonError || !hasValidCanton) {
        if (!hasShownErrorRef.current) {
          hasShownErrorRef.current = true;
          openNotificationWithIcon({
            type: "warning",
            message: "Ubicación no encontrada",
            description: "La ubicación no está en Ecuador. Por favor, ingrese la dirección de forma manual usando el botón 'Agregar nueva dirección'.",
          });
        }
        setPendingAddress(null);
        setPendingMapAddress(null);
        setCantonName("");
      }
    }
  }, [isCantonFetched, isCantonError, cantons, cantonName, pendingAddress, pendingMapAddress, openNotificationWithIcon]);

  useEffect(() => {
    if (cantonName === "") {
      hasShownErrorRef.current = false;
    }
  }, [cantonName]);

  useEffect(() => {
    if (cantons && pendingAddress) {
      const cantonId = cantons?.[0]?.cantonId;
      if (cantonId) {
        const addressData = transformGoogleAddressToIDirection(
          pendingAddress,
          typesDirection,
          cantonId
        );
        if (addressData) {
          append(addressData);
          closeModal();
        }
      } else {
        openNotificationWithIcon({
          type: "error",
          message: "Error",
          description:
            "No se pudo agregar la dirección. Por favor, intente de nuevo.",
        });
      }
      setPendingAddress(null);
      setCantonName("");
    }
  }, [cantons, pendingAddress, typesDirection, append, closeModal, openNotificationWithIcon]);

  useEffect(() => {
    if (cantons && pendingMapAddress) {
      const cantonId = cantons?.[0]?.cantonId;
      if (cantonId && typesDirection.length > 0) {
        const addressTypeId = typesDirection[0]?.value;
        if (addressTypeId) {
          const addressData: IDirection = {
            addressTypeId: addressTypeId,
            primaryStreet: pendingMapAddress.primaryStreet || "",
            secondaryStreet: "",
            cantonId: cantonId,
            latitude: pendingMapAddress.latitude || 0,
            longitude: pendingMapAddress.longitude || 0,
            postalCode: pendingMapAddress.postalCode || "",
            streetNumber: "",
            isActive: true,
          };
          append(addressData);
          closeModal();
        }
      }
      setPendingMapAddress(null);
      setCantonName("");
    }
  }, [cantons, pendingMapAddress, typesDirection, append, closeModal]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onLocationChange = useCallback((addressObj: any) => {
    if (addressObj?.addressData) {
      const mapData = addressObj.addressData;
      const placeObject = addressObj.placeObject;
      
      const canton = placeObject?.administrative_area_level_2?.long_name || "";
      setCantonName(canton);
      
      setPendingMapAddress({
        primaryStreet: mapData.principalStreet || "",
        latitude: mapData.latitude || 0,
        longitude: mapData.longitude || 0,
        postalCode: mapData.postalCode || "",
      });
    } else {
      const canton = addressObj?.administrative_area_level_2?.long_name || "";
      setCantonName(canton);
      setPendingAddress(addressObj);
    }
  }, []);

  const errorForm = useCallback(() => {
    if (fields.length === 0) {
      return { address: "Este campo es requerido" };
    } else {
      return {};
    }
  }, [fields.length]);

  const googleAutoCompleteProps: IGoogleAutoCompleteProps = useMemo(() => ({
    googleMapsApiKey: GOOGLE_API_KEY,
    defaultValue: "",
    onLocationChange: onLocationChange,
    setShowManualEntry: () => {},
    watch: () => ({ address: "" }),
    setValue: () => {},
    name: "address",
    label: "Dirección",
    errors: errorForm(),
  }), [onLocationChange, errorForm]);

  const handleManualDirectionSave = useCallback(
    (addressData: IDirection) => {
      // Si hay personId, hacer POST al backend
      if (options?.personId) {
        createDirection(
          {
            personId: options.personId,
            addressTypeId: addressData.addressTypeId,
            primaryStreet: addressData.primaryStreet,
            cantonId: addressData.cantonId,
            secondaryStreet: addressData.secondaryStreet,
            streetNumber: addressData.streetNumber,
            latitude: addressData.latitude,
            longitude: addressData.longitude,
            postalCode: addressData.postalCode,
            reference: addressData.reference,
            parishId: addressData.parishId,
          },
          {
            onSuccess: (response) => {
              openNotificationWithIcon({
                type: "success",
                message: "Dirección creada correctamente",
              });
              append({ 
                ...addressData, 
                id: response.id
              });
              closeModal();
              options?.onRefresh?.();
            },
            onError: () => {
              openNotificationWithIcon({
                type: "error",
                message: "Error al crear la dirección",
              });
            },
          }
        );
      } else {
        append({ ...addressData });
        closeModal();
      }
    },
    [append, closeModal, options, createDirection, openNotificationWithIcon]
  );

  const setShowManualEntry = useCallback(() => {
    openModal({
      title: "Ingreso de dirección",
      content: (
        <FormManualDirectionDataUI
          onSaveDirection={handleManualDirectionSave}
          googleAutoCompleteProps={googleAutoCompleteProps}
          excludeAddressTypeCodes={options?.excludeAddressTypeCodes}
          excludeAddressTypeLabels={options?.excludeAddressTypeLabels}
        />
      ),
      height: "auto",
    });
  }, [openModal, handleManualDirectionSave, googleAutoCompleteProps, options?.excludeAddressTypeCodes, options?.excludeAddressTypeLabels]);

  const openModalUploadImagen = () => {
    openModal({
      title: "Cargar imagen",
      content: <ImageMaintenance onCancelSaveImage={() => closeModal()} />,
      height: "auto",
    });
  };

  const openEditDirectionModal = useCallback(
    (direction: IDirectionResponse) => {
      if (!options?.personId) {
        openNotificationWithIcon({
          type: "warning",
          message: "No se puede editar",
          description: "No se ha proporcionado el ID de la persona",
        });
        return;
      }

      const handleEditSuccess = () => {
        options?.onRefresh?.();
      };

      openModal({
        title: "Editar dirección",
        content: (
          <FormEditDirectionUI
            directionData={direction}
            personId={options.personId}
            onSuccess={handleEditSuccess}
            excludeAddressTypeCodes={options?.excludeAddressTypeCodes}
            excludeAddressTypeLabels={options?.excludeAddressTypeLabels}
          />
        ),
        height: "auto",
      });
    },
    [openModal, options, openNotificationWithIcon]
  );

  return {
    typesDirection,
    isLoadingTypesAddress,
    //methods,
    control,
    fields,
    remove,
    googleAutoCompleteProps,
    setShowManualEntry,
    openModalUploadImagen,
    openEditDirectionModal,
    personId: options?.personId,
  };
};
