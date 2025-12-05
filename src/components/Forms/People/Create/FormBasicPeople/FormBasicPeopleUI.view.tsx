import {
  Button,
  FormInput,
  FormLabel,
  FormSelect,
} from "@itsa-develop/itsa-fe-components";
import { FormBasicPeopleUIHookProps } from "./FormBasicPeopleUI.hook";
import { Form, FormProvider } from "react-hook-form";
import { LocationSelectorUI } from "@/components/Render/LocationSelector/LocationSelectorUI.controller";

export const FormBasicPeopleUIView = ({
  methods,
  typesIdentifications,
  typesGender,
  typesIdentificationSelect,
  typesCivilStatus,
  countries,
  directionData,
  emailData,
  phoneData,
  typesEmail,
  typesPhone,
  typesAddress,
  isLoadingTypesIdentifications,
  isLoadingTypesCivilStatus,
  isLoadingTypesGender,
  isLoadingTypesAddress,
  isLoadingTypesEmail,
  isLoadingTypesPhone,
  handleFormSubmit,
  handleCantonChange,
}: FormBasicPeopleUIHookProps) => {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <FormProvider {...methods}>
          <Form className="flex flex-col w-full gap-2">
            <div className="flex flex-row bg-gray-250 rounded-md p-2 gap-2">
              <div className="flex-1">
                <FormSelect
                  control={methods.control}
                  name="identificationTypeId"
                  label="Tipo de identificación"
                  options={typesIdentifications}
                  placeholder="Tipo de identificación"
                  loading={isLoadingTypesIdentifications}
                />
              </div>
              <div className="flex-1">
                <FormInput
                  control={methods.control}
                  name="identification"
                  label="Identificación"
                  placeholder="Identificación"
                />
              </div>
            </div>
            {(typesIdentificationSelect === "TD063" ||
              typesIdentificationSelect === "TD064") && (
              <div className="flex flex-col w-full gap-2">
                <div className="flex flex-row bg-gray-250 rounded-md p-2 gap-2">
                  <div className="flex-1">
                    <FormInput
                      control={methods.control}
                      name="naturalPersonData.lastNames"
                      label="Apellidos"
                      placeholder="Apellidos"
                    />
                  </div>
                  <div className="flex-1">
                    <FormInput
                      control={methods.control}
                      name="naturalPersonData.names"
                      label="Nombres"
                      placeholder="Nombres"
                    />
                  </div>
                  <div className="flex-1">
                    <FormSelect
                      control={methods.control}
                      name="naturalPersonData.genderId"
                      label="Género"
                      options={typesGender}
                      placeholder="Género"
                      loading={isLoadingTypesGender}
                    />
                  </div>
                </div>

                <div className="flex flex-row bg-gray-250 rounded-md p-2 w-full gap-2">
                  <div className="flex-1">
                    <FormSelect
                      control={methods.control}
                      name="naturalPersonData.civilStatusId"
                      label="Estado civil"
                      options={typesCivilStatus}
                      placeholder="Estado civil"
                      loading={isLoadingTypesCivilStatus}
                    />
                  </div>
                  <div className="flex-1">
                    <FormSelect
                      control={methods.control}
                      name="naturalPersonData.birthCountryId"
                      label="País de nacimiento"
                      options={countries}
                      placeholder="País de nacimiento"
                    />
                  </div>
                </div>
              </div>
            )}
            {typesIdentificationSelect === "TD062" && (
              <div>
                <FormInput
                  control={methods.control}
                  name="legalPersonData.companyName"
                  label="Nombre comercial"
                  placeholder="Nombre comercial"
                />
                <FormInput
                  control={methods.control}
                  name="legalPersonData.socialReason"
                  label="Razón social"
                  placeholder="Razón social"
                />
              </div>
            )}

            <div className="flex flex-col w-full bg-gray-250 rounded-md p-2">
              {emailData?.map((email, index) => {
                return (
                  <div key={index}>
                    <FormSelect
                      control={methods.control}
                      name={`emailData.${index}.emailTypeId`}
                      label="Tipo de email"
                      options={typesEmail}
                      placeholder="Tipo de email"
                      loading={isLoadingTypesEmail}
                    />
                    <FormInput
                      control={methods.control}
                      name={`emailData.${index}.email`}
                      label="Email"
                      placeholder="Email"
                    />
                  </div>
                );
              })}
              {phoneData?.map((phone, index) => {
                return (
                  <div key={index}>
                    <FormSelect
                      control={methods.control}
                      name={`phoneData.${index}.phoneTypeId`}
                      label="Tipo de teléfono"
                      options={typesPhone}
                      placeholder="Tipo de teléfono"
                      loading={isLoadingTypesPhone}
                    />
                    <FormInput
                      control={methods.control}
                      name={`phoneData.${index}.phoneNumber`}
                      label="Teléfono"
                      placeholder="Teléfono"
                    />
                  </div>
                );
              })}
            </div>
            {directionData?.map((direction, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col w-full gap-2 bg-gray-250 rounded-md p-2"
                >
                  <FormLabel label="Dirección" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <FormSelect
                      control={methods.control}
                      name={`directionData.${index}.addressTypeId`}
                      label="Tipo de dirección"
                      options={typesAddress}
                      placeholder="Tipo de dirección"
                      loading={isLoadingTypesAddress}
                    />
                    <FormInput
                      control={methods.control}
                      name={`directionData.${index}.primaryStreet`}
                      label="Dirección"
                      placeholder="Dirección"
                    />
                  </div>
                  <div className="flex flex-1">
                    <LocationSelectorUI
                      onChangeCountry={() => {}}
                      onChangeProvince={() => {}}
                      onChangeCanton={handleCantonChange}
                      aloneEcuador={true}
                    />
                  </div>
                </div>
              );
            })}
          </Form>
        </FormProvider>
      </div>
      <div className="flex-none z-10 flex justify-end bg-white pt-2 border-t border-gray-200">
        <Button
          type="primary"
          label="Guardar"
          size="middle"
          onClick={() => {
            handleFormSubmit?.();
          }}
        />
      </div>
    </div>
  );
};
