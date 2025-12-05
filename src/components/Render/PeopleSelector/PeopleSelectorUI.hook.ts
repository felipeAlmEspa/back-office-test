import { SelectProps } from "antd";
import { usePeople } from "@/services/people/people.service";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useMemo, useState } from "react";
import { IInitParamsHook } from "./PeopleSelectorUI.controller";
import { IPerson } from "@/view/Core/Maintenance/People/interfaces";
export interface PeopleSelectorHookProps {
  loading: boolean;
  options: SelectProps["options"];
  onSearch: (value: string) => void;
  value?: number;
  onChange: (value?: number) => void;
  validLabelInfo: string;
  viewAddItem: boolean;
  openModalAddItem: () => void;
  label: string;
  status?: "error" | "warning";
  infoPerson: (personId: number) => IPerson | undefined;
}

export const usePeopleSelectorUI = (
  init: IInitParamsHook
): PeopleSelectorHookProps => {
  const { onChange, value, openModalAddItem } = init.params;
  const [identification, setIdentification] = useState<string | null>(null);
  const { data, isLoading, isFetching } = usePeople(
    {
      identification: identification,
      page: 1,
      perPage: 30,
    },
    {
      enabled: !!identification && identification.length >= 3,
    }
  );

  const people = useMemo(() => data?.data ?? [], [data]);
  const options = useMemo(() => {
    return people.map((item) => ({
      label: item.person,
      value: item.id,
    }));
  }, [people]);

  const onSearchChange = init.params.onSearchChange;

  const { debouncedCallback: debouncedIdentification, isLoading: isSearching } =
    useDebouncedCallback((value: string) => {
      const trimmed = value?.trim();
      if (!trimmed || trimmed.length < 3) {
        setIdentification(null);
        return;
      }
      setIdentification(trimmed);
      if (onSearchChange) {
        onSearchChange(trimmed);
      }
    }, 1000);

  const validLabelInfo = useMemo(() => {
    if (isLoading || isFetching || isSearching) return "Buscando...";
    if (options.length === 0 && identification && identification.length >= 3)
      return "No se encontró ningún resultado";
    return "Ingrese número de identificación";
  }, [options, isLoading, isFetching, identification, isSearching]);

  const viewAddItem = useMemo(() => {
    if (
      options &&
      identification &&
      identification.length >= 3 &&
      isLoading === false &&
      isSearching === false &&
      isFetching === false
    )
      return true;
    return false;
  }, [options, identification, isLoading, isFetching, isSearching]);

  const infoPerson = (personId: number) => {
    return people.find((person) => person.id === personId);
  };
  
  return {
    loading: isLoading,
    options,
    value,
    onSearch: debouncedIdentification,
    onChange,
    validLabelInfo,
    viewAddItem,
    openModalAddItem,
    label: init.params.label,
    infoPerson,
  };
};
