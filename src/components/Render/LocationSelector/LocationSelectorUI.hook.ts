import { SelectProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  IinitParamsHook,
} from "./LocationSelectorUI.controller";
import {
  useGetCantons,
  useGetCountries,
  useGetParishes,
  useGetProvinces,
} from "@/services/catalogs/catalog.service";
import { DEFAULT_VALUES } from "@/constants";
export interface LocationSelectorHookProps {
  valueCountryId?: number;
  valueProvinceId?: number;
  valueCantonId?: number;
  valueParishId?: number;
  optionsCountries: SelectProps["options"];
  optionsProvinces: SelectProps["options"];
  optionsCantons: SelectProps["options"];
  optionsParishes: SelectProps["options"];
  isLoadingCountries: boolean;
  isLoadingProvinces: boolean;
  isLoadingCantons: boolean;
  isLoadingParishes: boolean;
  onChangeCountry: (value: number) => void;
  onChangeProvince: (value: number) => void;
  onChangeCanton: (value: number) => void;
  onChangeParish: (value: number) => void;
  onChangeOtherCountryDescription: (value: string) => void;
  otherCountryDescription: string;
  showParish?: boolean;
  aloneEcuador?: boolean;
}

export const useLocationSelectorUI = (
  initParams: IinitParamsHook
): LocationSelectorHookProps => {
  const {
    aloneEcuador,
    valueCountryId,
    valueProvinceId,
    valueCantonId,
    valueParishId,
    showParish,
    onChangeCountry,
    onChangeProvince,
    onChangeCanton,
    onChangeParish,
  } = initParams.initParams;
  const [countryId, setCountryId] = useState<number>(valueCountryId || 0);
  const [provinceId, setProvinceId] = useState<number>(valueProvinceId || 0);
  const [cantonId, setCantonId] = useState<number>(valueCantonId || 0);
  const [parishId, setParishId] = useState<number>(valueParishId || 0);
  const [otherCountryDescription, setOtherCountryDescription] =
    useState<string>("");
  const { data: countries, isLoading: isLoadingCountries } = useGetCountries();
  const { data: provinces, isLoading: isLoadingProvinces } = useGetProvinces();
  const { data: cantons, isLoading: isLoadingCantons } = useGetCantons(
    { province_id: provinceId },
    {
      enabled: provinceId !== 0,
    }
  );
  const { data: parishes, isLoading: isLoadingParishes } = useGetParishes(
    { canton_id: cantonId },
    {
      enabled: cantonId !== 0,
    }
  );

  const defaultCountryCode = useMemo(() => {
    return DEFAULT_VALUES.defaultCountryCode;
  }, []);

  const countryDefaultId = useMemo(() => {  
    if (!countries) return 0;
    const country = countries.find(
      (country) => country.label === defaultCountryCode
    );  
    return country?.value ?? 0;
  }, [countries, defaultCountryCode]);


  useEffect(() => {
    if (countryId === 0 && countryDefaultId !== 0 && countries && countries.length > 0) {
      setCountryId(countryDefaultId);
      onChangeCountry?.(countryDefaultId);
    }
  }, [countryDefaultId, countries, countryId, onChangeCountry]);

  useEffect(() => {
    if (provinceId === 0 && provinces && provinces.length > 0) {
      setProvinceId(provinces[0]?.value || 0);
    }
    if (cantonId === 0 && cantons && cantons.length > 0) {
      setCantonId(cantons[0]?.value || 0);
      onChangeCanton?.(cantons[0]?.value || 0);
    }
    if (parishId === 0 && parishes && parishes.length > 0) {
      setParishId(parishes[0]?.value || 0);
    }
  }, [
    cantonId,
    cantons,
    onChangeCanton,
    parishId,
    parishes,
    provinceId,
    provinces,
  ]);

  const optionsCountries = useMemo<SelectProps["options"]>(() => {
    if (countries) {
      if (aloneEcuador) {
        return countries.filter((country) => country.label === defaultCountryCode);
      }
      return countries;
    }
    return [];
  }, [countries, aloneEcuador, defaultCountryCode]);

  const optionsProvinces = useMemo<SelectProps["options"]>(() => {
    if (provinces) {
      return provinces.filter((province) => province !== null);
    }
    return [];
  }, [provinces]);

  const optionsCantons = useMemo<SelectProps["options"]>(() => {
    if (cantons) {
      return cantons.filter((canton) => canton !== null);
    }
    return [];
  }, [cantons]);

  const optionsParishes = useMemo<SelectProps["options"]>(() => {
    if (parishes) {
      return parishes.filter((parish) => parish !== null);
    }
    return [];
  }, [parishes]);

  const handleChangeCountry = (value: number) => {
    setCountryId(value);
    setProvinceId(0);
    setCantonId(0);
    setParishId(0);
    onChangeCountry?.(value);
  };
  const handleChangeProvince = (value: number) => {
    setProvinceId(value);
    setCantonId(0);
    setParishId(0);
    onChangeProvince?.(value);
  };
  const handleChangeCanton = (value: number) => {
    setCantonId(value);
    setParishId(0);
    onChangeCanton?.(value);
  };
  const handleChangeParish = (value: number) => {
    setParishId(value);
    onChangeParish?.(value);
  };

  return {
    valueCountryId: countryId,
    valueProvinceId: provinceId,
    valueCantonId: cantonId,
    valueParishId: parishId,
    optionsCountries,
    optionsProvinces,
    optionsCantons,
    optionsParishes,
    isLoadingCountries,
    isLoadingProvinces,
    isLoadingCantons,
    isLoadingParishes,
    onChangeCountry: handleChangeCountry,
    onChangeProvince: handleChangeProvince,
    onChangeCanton: handleChangeCanton,
    onChangeParish: handleChangeParish,
    onChangeOtherCountryDescription: setOtherCountryDescription,
    otherCountryDescription,
    showParish,
    aloneEcuador,
  };
};
