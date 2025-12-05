import { useState, useCallback, useEffect } from "react";
import { useSearchPeopleByIdentificacion } from "@/services/people/people.service";
import { IPeopleExistsResponse } from "@/view/Core/Maintenance/People/interfaces";
import { SpouseCreateModal } from "./SpouseCreateModal";

export interface SpouseSelectorHookProps {
  identification: string;
  setIdentification: (value: string) => void;
  handleSearch: () => void;
  handleClear: () => void;
  isSearching: boolean;
  spouseData?: IPeopleExistsResponse;
  value?: number;
  onChange: (value?: number) => void;
  label: string;
  placeholder: string;
  disabled: boolean;
  handleOpenCreateModal: () => void;
}

interface SpouseSelectorParams {
  value?: number;
  onChange: (value?: number) => void;
  label?: string;
  onPersonCreated?: (personId: number) => void;
  openModal: (config: {
    title: string;
    content: React.ReactNode;
    height?: string;
    closable?: boolean;
    footer?: React.ReactNode;
  }) => void;
  closeModal: () => void;
  openNotificationWithIcon: (config: {
    type: "success" | "info" | "warning" | "error";
    message: string;
    description?: string;
  }) => void;
  initialIdentification?: string;
  initialValue?: number;
  initialIdentificationTypeId?: number;
  initialSpouseName?: string;
  title?: string;
  identificationFormPerson?: string;
}

export const useSpouseSelectorUI = (
  params: SpouseSelectorParams
): SpouseSelectorHookProps => {
  const {
    value,
    onChange,
    label = "persona",
    openModal,
    closeModal,
    openNotificationWithIcon,
    initialIdentification,
    initialIdentificationTypeId,
    initialSpouseName,
    identificationFormPerson,
    title = "Crear persona",
  } = params;
  const [identification, setIdentification] = useState(
    initialIdentification ?? ""
  );
  const [spouseData, setSpouseData] = useState<IPeopleExistsResponse | undefined>(
    value && initialSpouseName
      ? {
          id: value,
          identification: "",
          identificationTypeId: initialIdentificationTypeId ?? 0,
          person: initialSpouseName,
        }
      : undefined
  );
  const [isSearching, setIsSearching] = useState(false);

  const { mutate: searchPerson } = useSearchPeopleByIdentificacion();

  useEffect(() => {
    if (value && initialSpouseName && (!spouseData || spouseData.person !== initialSpouseName)) {
      setSpouseData({
        id: value,
        identification: "",
        identificationTypeId: initialIdentificationTypeId ?? 0,
        person: initialSpouseName,
      });
    } else if (!value) {
      setSpouseData(undefined);
    }
  }, [value, initialSpouseName, initialIdentificationTypeId, spouseData]);

  const handleOpenCreateModal = useCallback(() => {
    if (openModal) {
      openModal({
        title: title,
        content: (
          <SpouseCreateModal
            initialParentIdentificationTypeId={initialIdentificationTypeId}
            onSuccess={(person) => {
              setSpouseData(person);
              setIdentification(person.identification);
              onChange(person.id);
              closeModal();
              openNotificationWithIcon({
                type: "success",
                message: "Persona creada exitosamente",
              });
            }}
            onCancel={closeModal}
            omitIdentification={identificationFormPerson}
          />
        ),
        height: "auto",
        closable: true,
        footer: null,
      });
    }
  }, [
    openModal,
    closeModal,
    onChange,
    openNotificationWithIcon,
    initialIdentificationTypeId,
    title,
    identificationFormPerson,
  ]);

  const handleSearch = useCallback(() => {
    if (!identification || identification.length < 6) {
      openNotificationWithIcon({
        type: "warning",
        message: "Identificación inválida",
        description: "La identificación debe tener al menos 6 caracteres",
      });
      return;
    }

    setIsSearching(true);
    searchPerson(
      { identification },
      {
        onSuccess: (data: IPeopleExistsResponse) => {
          setSpouseData(data);
          setIdentification(data.identification);
          onChange(data.id);
          openNotificationWithIcon({
            type: "success",
            message: "Persona seleccionada exitosamente",
            // description: `${data.person} ha sido seleccionado como cónyuge`,
          });
        },
        onError: () => {
          openNotificationWithIcon({
            type: "info",
            message: "Persona no encontrada",
            description: "La persona no existe. Por favor, créela primero.",
          });
          handleOpenCreateModal();
        },
        onSettled: () => {
          setIsSearching(false);
        },
      }
    );
  }, [
    identification,
    searchPerson,
    onChange,
    openNotificationWithIcon,
    handleOpenCreateModal,
  ]);

  const handleClear = useCallback(() => {
    setIdentification("");
    setSpouseData(undefined);
    onChange(undefined);
  }, [onChange]);

  return {
    identification,
    setIdentification,
    handleSearch,
    handleClear,
    isSearching,
    spouseData,
    value,
    onChange: value ? handleClear : handleSearch,
    label,
    placeholder: "Ingrese identificación de la persona",
    disabled: isSearching,
    handleOpenCreateModal,
  };
};
