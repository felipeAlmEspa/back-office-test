import { LocationSelectorUIView } from "./LocationSelectorUI.view";
import { useLocationSelectorUI } from "./LocationSelectorUI.hook";

export interface LocationSelectorControllerProps {
  onChangeCountry: (value: number) => void;
  onChangeProvince: (value: number) => void;
  onChangeCanton: (value: number) => void;
  onChangeParish?: (value: number) => void;
  valueProvinceId?: number;
  valueCantonId?: number;
  valueParishId?: number;
  valueCountryId?: number;
  showParish?: boolean;
  aloneEcuador?: boolean;
}

export interface IinitParamsHook {
  initParams: LocationSelectorControllerProps;
}

export const LocationSelectorUI = ({
  valueProvinceId = 0,
  valueCantonId = 0,
  valueParishId = 0,
  valueCountryId = 0,
  showParish = false,
  onChangeCountry,
  onChangeProvince,
  onChangeCanton,
  onChangeParish,
  aloneEcuador = false,
}: LocationSelectorControllerProps) => {
  const hook = useLocationSelectorUI({
    initParams: {
      valueProvinceId,
      valueCantonId,
      valueParishId,
      valueCountryId,
      showParish,
      onChangeCountry,
      onChangeProvince,
      onChangeCanton,
      onChangeParish,
      aloneEcuador,
    },
  });

  return <LocationSelectorUIView {...hook} />;
};
