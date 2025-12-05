import { SelectProps } from "antd";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useCarrierCompanies } from "@/services/carriers/carrierCompanies.service";
import { useMemo, useState } from "react";
import { useGetCarrierCompany } from "@/services/carriers/carrierCompanies.service";
import { ICompanyInfo } from "./Interface";

export interface CompanySelectorHookProps {
  loading: boolean;
  options: SelectProps["options"];
  onSearch: (value: string) => void;
  value?: string | number;
  onChange: (value?: string | number) => void;
  validLabelInfo: string;
  viewAddItem: boolean;
  openModalAddItem: () => void;
  label: string;
  status?: "error" | "warning";
  infoCompany: (id: number | string) => ICompanyInfo | undefined;
}

interface CompanySelectorUIPropsBase {
  openModalAddItem: () => void;
  label: string;
  status?: "error" | "warning";
  onSearchChange?: (identification: string) => void;
}

export type CompanySelectorUIProps =
  | (CompanySelectorUIPropsBase & {
      valueKey?: "id"; // default
      value?: number;
      onChange: (value?: number) => void;
      initialId?: number; // when provided, fetch detail to show label
    })
  | (CompanySelectorUIPropsBase & {
      valueKey: "identification";
      value?: string;
      onChange: (value?: string) => void;
    });

export const useCompanySelectorUI = (
  params: CompanySelectorUIProps
): CompanySelectorHookProps => {
  const { onChange, value, openModalAddItem, label, status } = params;
  const valueKey = ("valueKey" in params ? params.valueKey : "id") as "id" | "identification";
  const initialId = ("initialId" in params ? params.initialId : undefined) as number | undefined;

  const [identification, setIdentification] = useState<string | null>(null);
  const onSearchChange = ("onSearchChange" in params ? params.onSearchChange : undefined) as ((id: string) => void) | undefined;

  const { debouncedCallback: debouncedIdentification, isLoading: isSearching } = useDebouncedCallback(
    (v: string) => {
      const trimmed = v?.trim();
      if (!trimmed || trimmed.length < 3) {
        setIdentification(null);
        return;
      }
      setIdentification(trimmed);
      if (onSearchChange) {
        onSearchChange(trimmed);
      }
    },
    1000
  );

  const { data, isLoading, isFetching } = useCarrierCompanies(
    {
      identification: identification,
      page: 1,
    },
    {
      enabled: !!identification && identification.length >= 3,
    }
  );

  // If an id is selected (or initialId provided) fetch its detail to ensure label shows correctly
  const selectedId = valueKey === "id" && typeof value === "number" ? value : initialId;
  const { data: selectedCompany } = useGetCarrierCompany(
    selectedId as number,
    {
      enabled: typeof selectedId === "number" && selectedId > 0,
      // staleTime: 5 * 60 * 1000,
    }
  );

  type CompanyItem = { id: number; identification: string; businessName?: string };
  const companies = (data?.data ?? []) as CompanyItem[];
  const optionsBase = companies.map((item) => ({
    label: item.identification,
    value: valueKey === "identification" ? item.identification : item.id,
    businessName: item.businessName ?? "",
    data: item,
  }));

  // Include the selected company if not present in options
  const options = useMemo(() => {
    const list = [...optionsBase];
    if (
      valueKey === "id" &&
      selectedCompany &&
      typeof selectedCompany.id === "number" &&
      !list.some((o) => o.value === selectedCompany.id)
    ) {
      list.unshift({
        label: selectedCompany.identification,
        value: selectedCompany.id,
        businessName: selectedCompany.businessName ?? "",
        data: selectedCompany as unknown as CompanyItem,
      });
    }
    return list;
  }, [optionsBase, selectedCompany, valueKey]);

  const validLabelInfo = useMemo(() => {
    if (isLoading || isFetching || isSearching) return "Buscando...";
    if (options.length === 0 && identification && identification.length >= 3)
      return "No se encontró ningún resultado";
    return "Ingrese un RUC de empresa";
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

  const infoCompany = (id: number | string): ICompanyInfo | undefined => {
    if (valueKey === "identification") {
      return companies.find((c) => c.identification === id);
    }
    return companies.find((c) => c.id === id) ?? (selectedCompany as ICompanyInfo | undefined);
  };

  return {
    loading: isLoading,
    options,
    onSearch: debouncedIdentification,
    value,
    onChange: (val?: string | number) => {
      if (valueKey === "identification") {
        (onChange as (v?: string) => void)(val as string | undefined);
      } else {
        (onChange as (v?: number) => void)(val as number | undefined);
      }
    },
    validLabelInfo,
    viewAddItem,
    openModalAddItem,
    label,
    status,
    infoCompany,
  };
};
