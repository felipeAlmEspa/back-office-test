import { LocationSelector } from "@itsa-develop/itsa-fe-components";
import { LocationSelectorHookProps } from "./LocationSelectorUI.hook";

export const LocationSelectorUIView = ({
  optionsCountries,
  optionsProvinces,
  optionsCantons,
  optionsParishes,
  isLoadingCountries,
  isLoadingProvinces,
  isLoadingCantons,
  isLoadingParishes,
  onChangeCountry,
  onChangeProvince,
  onChangeCanton,
  onChangeParish,
  valueCountryId,
  valueProvinceId,
  valueCantonId,
  valueParishId,
  onChangeOtherCountryDescription,
  otherCountryDescription,
  showParish,
  aloneEcuador,
}: LocationSelectorHookProps) => {
  return (
    <LocationSelector
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
      onChangeOtherCountryDescription={onChangeOtherCountryDescription}
      otherCountryDescription={otherCountryDescription}
      showParish={showParish}
      valueCountryId={valueCountryId}
      valueProvinceId={valueProvinceId}
      valueCantonId={valueCantonId}
      valueParishId={valueParishId}
      aloneEcuador={aloneEcuador}
    />
  );
};
