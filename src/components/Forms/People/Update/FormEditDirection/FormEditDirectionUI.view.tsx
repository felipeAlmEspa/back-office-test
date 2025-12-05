import {
  CustomFooterModal,
  FormInput,
  FormSelect,
  FormCheckBox,
} from "@itsa-develop/itsa-fe-components";
import { FormEditDirectionUIHookProps } from "./FormEditDirectionUI.hook";
import { LocationSelectorUI } from "@/components/Render/LocationSelector/LocationSelectorUI.controller";
import { useMemo } from "react";

type FormEditDirectionUIViewProps = FormEditDirectionUIHookProps & {
  excludeAddressTypeCodes?: string[];
  excludeAddressTypeLabels?: string[];
};

export const FormEditDirectionUIView = ({
  typesAddress,
  isLoadingTypesAddress,
  control,
  locationSelectorHook,
  handleSubmitForm,
  isLoadingUpdate,
  closeModal,
  excludeAddressTypeCodes,
  excludeAddressTypeLabels,
  hasStreetNumber,
  hasLatitude,
  hasLongitude,
  hasPostalCode,
}: FormEditDirectionUIViewProps) => {
  const filteredTypesAddress = useMemo(() => {
    let opts = typesAddress;
    if (excludeAddressTypeCodes && excludeAddressTypeCodes.length > 0) {
      opts = opts.filter((o: { code?: string }) => !excludeAddressTypeCodes.includes(o.code ?? ""));
    }
    if (excludeAddressTypeLabels && excludeAddressTypeLabels.length > 0) {
      opts = opts.filter(
        (o: { label?: string }) =>
          !excludeAddressTypeLabels.some(
            (lbl) => o.label?.toLowerCase() === lbl.toLowerCase()
          )
      );
    }
    return opts;
  }, [typesAddress, excludeAddressTypeCodes, excludeAddressTypeLabels]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col bg-gray-250 rounded-md">
        <div className="flex flex-col gap-2 p-2 max-h-[60vh] overflow-y-auto">
          <LocationSelectorUI {...locationSelectorHook} />
          <FormSelect
            control={control}
            name="addressTypeId"
            label="Tipo de dirección"
            options={filteredTypesAddress}
            loading={isLoadingTypesAddress}
          />
          <FormCheckBox
            control={control}
            name="isActive"
            label="Dirección activa"
          />
          <FormInput
            name="primaryStreet"
            control={control}
            label="Calle principal"
            placeholder="Ingresa una calle principal"
          />
          <FormInput
            name="secondaryStreet"
            control={control}
            label="Calle secundaria"
            placeholder="Ingresa una calle secundaria"
          />
          <div className="grid grid-cols-2 gap-2">
            {hasStreetNumber && (
              <div>
                <FormInput
                  name="streetNumber"
                  control={control}
                  label="Número de la calle"
                  placeholder="Ingresa un número de la calle"
                  disabled
                />
              </div>
            )}
            <div>
              <FormInput
                name="reference"
                control={control}
                label="Referencia"
                placeholder="Ingresa una referencia"
              />
            </div>
            {hasLatitude && (
              <div>
                <FormInput
                  name="latitude"
                  control={control}
                  label="Latitud"
                  placeholder="Ingresa una latitud"
                  type="number"
                  step="any"
                  disabled
                />
              </div>
            )}
            {hasLongitude && (
              <div>
                <FormInput
                  name="longitude"
                  control={control}
                  label="Longitud"
                  placeholder="Ingresa una longitud"
                  type="number"
                  step="any"
                  disabled
                />
              </div>
            )}
            {hasPostalCode && (
              <div>
                <FormInput
                  name="postalCode"
                  control={control}
                  label="Código postal"
                  placeholder="Ingresa un código postal"
                  disabled
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <CustomFooterModal
        onCancel={closeModal}
        onConfirm={handleSubmitForm}
        confirmLoading={isLoadingUpdate}
      />
    </div>
  );
};
