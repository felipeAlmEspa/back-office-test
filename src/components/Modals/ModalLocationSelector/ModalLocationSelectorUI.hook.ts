import { SelectProps } from "antd";
export interface ModalLocationSelectorHookProps {
  title: string;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
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
}
