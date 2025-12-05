import { FormDirectionDataUIHookProps } from "./FormDirectionDataUI.hook";
import {
  Button,
  FormInput,
  FormSelect,
  Switch,
} from "@itsa-develop/itsa-fe-components";
import { EditOutlined } from "@ant-design/icons";
import { IDirection, IDirectionResponse } from "@/view/Core/Maintenance/People/interfaces";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

type FormDirectionDataUIViewProps = FormDirectionDataUIHookProps & {
  excludeAddressTypeCodes?: string[];
  excludeAddressTypeLabels?: string[];
};


export const FormDirectionDataUIView = ({
  isLoadingTypesAddress,
  fields,
  control,
  //methods,
  typesDirection,
  setShowManualEntry,
  openEditDirectionModal,
  personId,
  excludeAddressTypeCodes,
  excludeAddressTypeLabels,
}:
FormDirectionDataUIViewProps) => {
  const { getValues } = useFormContext();
  
  const filteredTypesDirection = useMemo(() => {
    let opts = typesDirection;
    if (excludeAddressTypeCodes && excludeAddressTypeCodes.length > 0) {
      opts = opts.filter((o) => !excludeAddressTypeCodes.includes(o.code));
    }
    if (excludeAddressTypeLabels && excludeAddressTypeLabels.length > 0) {
      opts = opts.filter(
        (o) => !excludeAddressTypeLabels.some((lbl) => o.label?.toLowerCase() === lbl.toLowerCase())
      );
    }
    return opts;
  }, [typesDirection, excludeAddressTypeCodes, excludeAddressTypeLabels]);

  return (
    <div className="flex flex-col bg-gray-250 rounded-md gap-0">
      <div className="w-full flex flex-row justify-end items-end mb-3">
        <div className="justify-end items-end w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
          <Button
            type="primary"
            onClick={setShowManualEntry}
            label="Agregar nueva dirección"
            size="middle"
            block
          />
        </div>
      </div>
      <div className="flex flex-col gap-0 ">
        <div className="flex flex-col gap-2 p-1 max-h-[300px] md:max-h-[400px] overflow-y-auto">
          {fields.map((field, index) => {
            const normalizedField = field as unknown as IDirection;
            return (
              <div
                key={field.id}
                className={`flex flex-col md:flex-row rounded-md gap-2 md:gap-0 p-3 md:p-2 md:pr-2 ${
                  (getValues(`directionData.${index}.isActive`) as boolean) ===
                  false
                    ? "bg-gray-200 opacity-60"
                    : "bg-white-100"
                }`}
              >
                <div className="flex md:hidden flex-col gap-3 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">
                      Estado:
                    </span>
                    <Switch
                      checkedLabel="Activa"
                      uncheckedLabel="Inactiva"
                      checked={getValues(`directionData.${index}.isActive`)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">
                        Dirección:
                      </label>
                      <FormInput
                        control={control}
                        name={`directionData.${index}.primaryStreet`}
                        label=""
                        disabled={true}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">
                        Referencia:
                      </label>
                      <FormInput
                        control={control}
                        name={`directionData.${index}.reference`}
                        label=""
                        disabled={false}
                      />
                    </div>
                  </div>
                  {normalizedField.secondaryStreet && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">
                        Dirección secundaria:
                      </label>
                      <FormInput
                        control={control}
                        name={`directionData.${index}.secondaryStreet`}
                        label=""
                        placeholder="Dirección secundaria"
                        disabled={false}
                      />
                    </div>
                  )}
                  { openEditDirectionModal && (
                    <div className="flex justify-end mt-2">
                      <Button
                        type="primary"
                        onClick={() => {
                          const directionData = getValues(
                            `directionData.${index}`
                          ) as IDirectionResponse;
                          openEditDirectionModal(directionData);
                        }}
                        label="Editar dirección"
                      />
                    </div>
                  )}
                </div>

                <div className="hidden md:flex flex-row items-center gap-2 w-full rounded-md pl-2 pr-2">
                  <div className="flex items-center gap-2 px-2 min-w-[80px]">
                    <Switch
                      checkedLabel="Activa"
                      uncheckedLabel="Inactiva"
                      checked={getValues(`directionData.${index}.isActive`)}
                    />
                  </div>
                  <div className="flex-1">
                    <FormInput
                      control={control}
                      name={`directionData.${index}.primaryStreet`}
                      label=""
                      autoComplete="on"
                      disabled={true}
                    />
                  </div>
                  {normalizedField.secondaryStreet && (
                    <div className="flex-1">
                      <FormInput
                        control={control}
                        name={`directionData.${index}.secondaryStreet`}
                        label=""
                        autoComplete="on"
                        placeholder="Dirección secundaria"
                        disabled={true}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <FormInput
                      control={control}
                      name={`directionData.${index}.reference`}
                      label=""
                      autoComplete="on"
                      disabled={true}
                    />
                  </div>
                  <div className="flex-1 min-w-[120px] max-w-[200px]">
                    <FormSelect
                      control={control}
                      name={`directionData.${index}.addressTypeId`}
                      label=""
                      options={filteredTypesDirection}
                      loading={isLoadingTypesAddress}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="hidden md:flex flex-row gap-2 justify-center items-center min-w-[60px]">
                  {personId && openEditDirectionModal && (
                    <Button
                      type="secondary"
                      onClick={() => {
                        const directionData = getValues(
                          `directionData.${index}`
                        ) as IDirectionResponse;
                        openEditDirectionModal(directionData);
                      }}
                      label={<EditOutlined />}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
