import { useEffect, useMemo, useState } from "react";
import {
  useGetCountries,
  useGetProvinces,
  useGetCantons,
  useGetParishes,
} from "@/services/catalogs/catalog.service";
import { SelectProps } from "antd";
import { ModalLocationSelectorUIView } from "./ModalLocationSelectorUI.view";
import { ModalLocationSelectorOnOk } from "@/interface";

export interface ModalLocationSelectorControllerProps {
  title: string;
  open: boolean;
  onOk: (data: ModalLocationSelectorOnOk) => void;
  onCancel: () => void;
  valueProvinceId?: number;
  valueCantonId?: number;
  valueParishId?: number;
  valueCountryId?: number;
}

export const ModalLocationSelectorUI = ({
  title,
  open,
  onOk,
  onCancel,
  valueProvinceId = 0,
  valueCantonId = 0,
  valueParishId = 0,
  valueCountryId = 121,
}: ModalLocationSelectorControllerProps) => {
  const [countryId, setCountryId] = useState<number>(valueCountryId);
  const [provinceId, setProvinceId] = useState<number>(valueProvinceId);
  const [cantonId, setCantonId] = useState<number>(valueCantonId);
  const [parishId, setParishId] = useState<number>(valueParishId);
  const [otherCountryDescription, setOtherCountryDescription] = useState<string>("");
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

  useEffect(() => {
    if (provinceId === 0 && provinces && provinces.length > 0) {
      setProvinceId(provinces[0]?.value || 0);
    }
    if (cantonId === 0 && cantons && cantons.length > 0) {
      setCantonId(cantons[0]?.value || 0);
    }
    if (parishId === 0 && parishes && parishes.length > 0) {
      setParishId(parishes[0]?.value || 0);
    }
  }, [cantonId, cantons, parishes, provinceId, provinces, parishId]);

  const optionsCountries = useMemo<SelectProps["options"]>(() => {
    if (countries) {
      return countries.map((country) => ({
        label: country.label,
        value: country.value,
      }));
    }
    return [];
  }, [countries]);

  const optionsProvinces = useMemo<SelectProps["options"]>(() => {
    if (provinces) {
      return provinces
        .map((province) => {
          return {
            label: province.label,
            value: province.value,
          };
        })
        .filter((province) => province !== null);
    }
    return [];
  }, [provinces]);

  const optionsCantons = useMemo<SelectProps["options"]>(() => {
    if (cantons) {
      return cantons
        .map((canton) => {
          return {
            label: canton.label,
            value: canton.value,
          };
        })
        .filter((canton) => canton !== null);
    }
    return [];
  }, [cantons]);

  const optionsParishes = useMemo<SelectProps["options"]>(() => {
    if (parishes) {
      return parishes
        .map((parish) => {
          return {
            label: parish.label,
            value: parish.value,
          };
        })
        .filter((parish) => parish !== null);
    }
    return [];
  }, [parishes]);

  const onChangeCountry = (value: number) => {
    setCountryId(value);
    setProvinceId(0);
    setCantonId(0);
    setParishId(0);
  };
  const onChangeProvince = (value: number) => {
    setProvinceId(value);
    setCantonId(0);
    setParishId(0);
  };
  const onChangeCanton = (value: number) => {
    setCantonId(value);
    setParishId(0);
  };
  const onChangeParish = (value: number) => {
    setParishId(value);
  };

  return (
    <ModalLocationSelectorUIView
      title={title}
      open={open}
      onOk={() => onOk({ countryId, provinceId, cantonId, parishId, otherCountryDescription })}
      onCancel={onCancel}
      valueCountryId={countryId}
      valueProvinceId={provinceId}
      valueCantonId={cantonId}
      valueParishId={parishId}
      optionsCountries={optionsCountries}
      optionsProvinces={optionsProvinces}
      optionsCantons={optionsCantons}
      optionsParishes={optionsParishes}
      isLoadingCountries={isLoadingCountries}
      isLoadingProvinces={isLoadingProvinces}
      isLoadingCantons={isLoadingCantons}
      isLoadingParishes={isLoadingParishes}
      onChangeCountry={onChangeCountry}
      onChangeProvince={onChangeProvince}
      onChangeCanton={onChangeCanton}
      onChangeParish={onChangeParish}
      onChangeOtherCountryDescription={setOtherCountryDescription}
    />
  );
};
