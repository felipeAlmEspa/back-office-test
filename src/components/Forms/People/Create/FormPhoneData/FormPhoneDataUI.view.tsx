import {
  Button,
  ButtonAddItem,
  FormCheckBox,
  FormInput,
  FormSelect,
} from "@itsa-develop/itsa-fe-components";
import { DeleteOutlined } from "@ant-design/icons";
import { FormPhoneDataUIHookProps } from "./FormPhoneDataUI.hook";

export const FormPhoneDataUIView = ({
  typesPhone,
  fields,
  remove,
  appendPhone,
  control,
  handleUpdatePhonePrincipal,
}: FormPhoneDataUIHookProps) => {
  return (
    <div className="flex flex-col bg-gray-250 rounded-md gap-0 ">
      <div className="flex flex-col gap-0 ">
        <div className="flex flex-row justify-between w-[80%] rounded-md p-2 gap-2 pl-4 pr-4">
          <div className="flex flex-row gap-6 ">
            <span className="text-gray-300">Principal</span>
            <span className="text-gray-300">Teléfono</span>
          </div>
          <div className="flex flex-row">
            <span className="text-gray-300">Tipo</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-1 max-h-[300px] overflow-y-auto">
          {fields.map((field, index) => {
            return (
              <div
                key={field.id}
                className="flex flex-row bg-white-100 rounded-md gap-0 pr-2"
              >
                <div className="flex flex-row items-center gap-2 w-full rounded-md p-2 pl-4 pr-4">
                  <div className="flex justify-center items-center w-16">
                    <FormCheckBox
                      control={control}
                      name={`phoneData.${index}.primary`}
                      label=""
                      onChange={() => handleUpdatePhonePrincipal(index)}
                    />
                  </div>
                  <div className="flex-1">
                    <FormInput
                      control={control}
                      name={`phoneData.${index}.phoneNumber`}
                      label=""
                      autoComplete="on"
                    />
                  </div>
                  <div className="flex-1 max-w-1/4">
                    <FormSelect
                      control={control}
                      name={`phoneData.${index}.phoneTypeId`}
                      label=""
                      placeholder="Tipo Te."
                      options={typesPhone}
                    />
                  </div>
                </div>
                <div
                  className="flex flex-row justi
                fy-center items-center"
                >
                  <Button
                    type="secondary"
                    onClick={() => remove(index)}
                    label={<DeleteOutlined />}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-start p-1">
        <ButtonAddItem onClick={() => appendPhone({ primary: false })} label={"Agregar teléfono"} />
      </div>
    </div>
  );
};
