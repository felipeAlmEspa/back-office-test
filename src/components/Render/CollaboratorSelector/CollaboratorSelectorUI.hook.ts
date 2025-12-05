import { SelectProps } from "antd";
import { useMemo, useState } from "react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useSearchCollaborators } from "@/services/common/collaborators.service";
import { CollaboratorSelectorUIProps } from "./CollaboratorSelectorUI.controller";
import { ICollaborator } from "@/view/Wholesale/interfaces";

export interface CollaboratorSelectorHookProps {
  loading: boolean;
  options: SelectProps["options"];
  onSearch: (value: string) => void;
  value?: number;
  onChange: (value?: number) => void;
  validLabelInfo: string;
  label: string;
  status?: "error" | "warning";
  infoCollaborator: (id?: number) => ICollaborator | undefined;
}

export const useCollaboratorSelectorUI = (
  params: CollaboratorSelectorUIProps
): CollaboratorSelectorHookProps => {
  const { onChange, value, label, status, lineBusinessId, onSelectObject } = params;
  const [identification, setIdentification] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useSearchCollaborators(
    {
      identification: identification ?? undefined,
      lineBusinessId: lineBusinessId,
      page: 1,
      perPage: 20,
    },
    !!lineBusinessId && !!identification && identification.length >= 3
  );

  const collaborators = useMemo(() => data?.data ?? [], [data]);
  const options = useMemo(() => {
    return collaborators.map((c) => ({
      label: c.collaborator,
      value: c.id,
      data: c,
      extra: { identification: c.identification, agency: c.agencyName },
    }));
  }, [collaborators]);

  const { debouncedCallback: debouncedIdentification, isLoading: isSearching } = useDebouncedCallback(
    (v: string) => {
      const trimmed = v?.trim();
      if (!trimmed || trimmed.length < 3) {
        setIdentification(null);
        return;
      }
      setIdentification(trimmed);
    },
    800,
    { enableLoading: true }
  );

  const validLabelInfo = useMemo(() => {
    if (isLoading || isFetching || isSearching) return "Buscando...";
    if (options.length === 0 && identification && identification.length >= 3)
      return "No se encontró el colaborador, contacte con RRHH";
    return "Ingresa la identificación del colaborador";
  }, [options, isLoading, isFetching, identification, isSearching]);

  const infoCollaborator = (id?: number) => collaborators.find((p) => p.id === id);

  return {
    loading: isLoading,
    options,
    onSearch: debouncedIdentification,
    value,
    onChange: (val?: number) => {
      onChange(val);
      if (onSelectObject) onSelectObject(infoCollaborator(val));
    },
    validLabelInfo,
    label,
    status,
    infoCollaborator,
  };
};
