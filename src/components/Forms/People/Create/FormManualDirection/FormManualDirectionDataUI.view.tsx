import {
  CustomFooterModal,
  EMapZoom,
  FormInput,
  FormSelect,
  Map,
  TabsMaintenance,
} from "@itsa-develop/itsa-fe-components";
import { FormManualDirectionDataUIHookProps } from "./FormManualDirectionDataUI.hook";
import { LocationSelectorUI } from "@/components/Render/LocationSelector/LocationSelectorUI.controller";
import { useMemo } from "react";
import { IDataType } from "@/interface";

type FormManualDirectionDataUIViewProps = FormManualDirectionDataUIHookProps & {
  excludeAddressTypeCodes?: string[];
  excludeAddressTypeLabels?: string[];
};

export const FormManualDirectionDataUIView = ({
  typesAddress,
  control,
  locationSelectorHook,
  handleSubmitForm,
  tabActive,
  setTabActive,
  setNewAddress,
  closeModal,
  excludeAddressTypeCodes,
  excludeAddressTypeLabels,
}: FormManualDirectionDataUIViewProps) => {
  const filteredTypesAddress = useMemo(() => {
    let opts = typesAddress;
    if (excludeAddressTypeCodes && excludeAddressTypeCodes.length > 0) {
      opts = opts.filter((o: IDataType) => !excludeAddressTypeCodes.includes(o.code));
    }
    if (excludeAddressTypeLabels && excludeAddressTypeLabels.length > 0) {
      opts = opts.filter(
        (o: IDataType) => !excludeAddressTypeLabels.some((lbl) => o.label?.toLowerCase() === lbl.toLowerCase())
      );
    }
    return opts;
  }, [typesAddress, excludeAddressTypeCodes, excludeAddressTypeLabels]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col bg-gray-250 rounded-md">
        <TabsMaintenance
          defaultActiveKey={tabActive}
          onChange={setTabActive}
          items={[
            {
              label: "Mapa",
              key: "map",
              children: (
                <div className="flex flex-col gap-2 p-2 h-[50vh] overflow-hidden">
                  <Map
                    zoom={EMapZoom.zoom14}
                    onLocationChange={(address: unknown) =>
                      setNewAddress(address)
                    }
                  />
                </div>
              ),
            },
            {
              label: "Manual",
              key: "manual",
              children: (
                <div className="flex flex-col gap-2 p-2 h-[50vh] overflow-y-auto">
                  <LocationSelectorUI {...locationSelectorHook} />
                  <FormSelect
                    control={control}
                    name="addressTypeId"
                    label="Tipo de dirección"
                    options={filteredTypesAddress}
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
                    <div>
                      <FormInput
                        name="streetNumber"
                        control={control}
                        label="Número de la calle"
                        placeholder="Ingresa un número de la calle"
                      />
                    </div>
                    <div>
                      <FormInput
                        name="reference"
                        control={control}
                        label="Referencia"
                        placeholder="Ingresa una referencia"
                      />
                    </div>
                    <div>
                      <FormInput
                        name="latitude"
                        control={control}
                        label="Latitud"
                        placeholder="Ingresa una latitud"
                      />
                    </div>
                    <div>
                      <FormInput
                        name="longitude"
                        control={control}
                        label="Longitud"
                        placeholder="Ingresa una longitud"
                      />
                    </div>
                    <div>
                      <FormInput
                        name="postalCode"
                        control={control}
                        label="Código postal"
                        placeholder="Ingresa un código postal"
                      />
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
      <CustomFooterModal onCancel={closeModal} onConfirm={handleSubmitForm} />
    </div>
  );
};
