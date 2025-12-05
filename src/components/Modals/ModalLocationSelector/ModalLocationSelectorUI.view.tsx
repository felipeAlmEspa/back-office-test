import {
  FormLabel,
  Modal,
  Select,
  Textarea,
} from "@itsa-develop/itsa-fe-components";
import { ModalLocationSelectorHookProps } from "./ModalLocationSelectorUI.hook";
import { filterOptions } from "@/helper";

export const ModalLocationSelectorUIView = ({
  title,
  open,
  onOk,
  onCancel,
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
}: ModalLocationSelectorHookProps) => {
  if (!open) return null;
  
  return (
    <Modal
      title={title}
      centered
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
    >
      <div className="flex flex-col w-full gap-2">
        <FormLabel label={`País`} />
        <Select
          options={optionsCountries}
          status={undefined}
          showSearch
          filterOption={(input, option) => filterOptions(input, option)}
          onChange={onChangeCountry}
          loading={isLoadingCountries}
          value={valueCountryId}
          placeholder="País"
        />
        {valueCountryId === 121 ? (
          <div className="flex flex-col w-full gap-2">
            <FormLabel label="Provincia" />
            <Select
              options={optionsProvinces}
              status={undefined}
              showSearch
              filterOption={(input, option) => filterOptions(input, option)}
              onChange={onChangeProvince}
              loading={isLoadingProvinces}
              value={valueProvinceId !== 0 ? valueProvinceId : undefined}
              placeholder="Provincia"
            />
            <FormLabel label="Cantón" />
            <Select
              options={optionsCantons}
              status={undefined}
              showSearch
              filterOption={(input, option) => filterOptions(input, option)}
              onChange={onChangeCanton}
              loading={isLoadingCantons}
              value={valueCantonId !== 0 ? valueCantonId : undefined}
              placeholder="Cantón"
            />
            <FormLabel label="Parroquia" />
            <Select
              options={optionsParishes}
              status={undefined}
              showSearch
              filterOption={(input, option) => filterOptions(input, option)}
              onChange={onChangeParish}
              loading={isLoadingParishes}
              value={valueParishId !== 0 ? valueParishId : undefined}
              placeholder="Parroquia"
            />
          </div>
        ) : (
          <Textarea name="otherCountryDescription" onChange={(e) => onChangeOtherCountryDescription(e.target.value)} />
        )}
      </div>
    </Modal>
  );
};
