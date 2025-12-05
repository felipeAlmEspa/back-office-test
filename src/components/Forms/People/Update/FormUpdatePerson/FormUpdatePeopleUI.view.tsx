import {
  Button,
  FormInput,
  FormSelect,
  WithoutInformation,
} from "@itsa-develop/itsa-fe-components";
import { FormBasicPeopleUIHookProps } from "./FormUpdatePeopleUI.hook";
import { Form, FormProvider } from "react-hook-form";
import { LoadingModule } from "@/components/Loadings/LoadingModule";
import { SpouseSelectorUI } from "@/components/Render/SpouseSelector";

export const FormBasicPeopleUIView = ({
  methods,
  typesIdentifications,
  typesGender,
  isLoadingTypesIdentifications,
  isLoadingTypesGender,
  typesIdentificationSelect,
  typesCivilStatus,
  isLoadingTypesCivilStatus,
  countries,
  handleFormSubmit,
  isLoading,
  personData,
  civilStatusSelect,
  onChangeSpouse,
  isDirty,
  isUpdating,
  typesActEconomical,
  typesSubactEconomical,
  isLoadingTypesActEconomical,
  isLoadingTypesSubactEconomical,
  spouseFullName,
  openNotificationWithIcon,
  openModal,
  closeModal,
}: FormBasicPeopleUIHookProps) => {
  if (isLoading === true && !personData) {
    return <LoadingModule message="Cargando información" />;
  }
  return personData ? (
    <div className="flex flex-col h-full min-h-0 p-4 w-full">
      <FormProvider {...methods}>
        <Form>
          <FormSelect
            control={methods.control}
            name="identificationTypeId"
            label="Tipo de identificación"
            options={typesIdentifications}
            placeholder="Tipo de identificación"
            loading={isLoadingTypesIdentifications}
            disabled={true}
          />
          <FormInput
            control={methods.control}
            name="identification"
            label="Identificación"
            placeholder="Identificación"
            disabled={true}
          />

          {(typesIdentificationSelect === "TD063" ||
            typesIdentificationSelect === "TD064") && (
            <div>
              <FormInput
                name="naturalPersonData.birthDate"
                control={methods.control}
                label="Fecha de nacimiento"
                disabled={true}
              />
              <FormSelect
                name="catalogActEconomicalId"
                control={methods.control}
                label="Actividad económica"
                options={typesActEconomical}
                placeholder="Selecciona una actividad económica"
                loading={isLoadingTypesActEconomical}
              />
              {typesSubactEconomical && typesSubactEconomical.length > 0 && (
                <FormSelect
                  name="catalogSubactEconomicalId"
                  control={methods.control}
                  label="Subactividad económica"
                  options={typesSubactEconomical}
                  placeholder="Selecciona una subactividad económica"
                  loading={isLoadingTypesSubactEconomical}
                />
              )}
              <FormInput
                control={methods.control}
                name="naturalPersonData.lastNames"
                label="Apellidos"
                placeholder="Apellidos"
              />
              <FormInput
                control={methods.control}
                name="naturalPersonData.names"
                label="Nombres"
                placeholder="Nombres"
              />
              <FormSelect
                control={methods.control}
                name="naturalPersonData.genderId"
                label="Género"
                options={typesGender}
                placeholder="Género"
                loading={isLoadingTypesGender}
              />
              <FormSelect
                control={methods.control}
                name="naturalPersonData.civilStatusId"
                label="Estado civil"
                options={typesCivilStatus}
                placeholder="Estado civil"
                loading={isLoadingTypesCivilStatus}
              />
              {civilStatusSelect === "TD066" && (
                <div className="mb-4">
                  <SpouseSelectorUI
                    label="Cónyuge"
                    onChange={onChangeSpouse}
                    value={methods.watch(
                      "naturalPersonData.spouseIdentificationId"
                    )}
                    openModal={openModal}
                    closeModal={closeModal}
                    openNotificationWithIcon={openNotificationWithIcon}
                    initialIdentificationTypeId={methods.watch(
                      "identificationTypeId"
                    )}
                    initialSpouseName={spouseFullName}
                  />
                </div>
              )}
              <FormSelect
                control={methods.control}
                name="naturalPersonData.birthCountryId"
                label="País de nacimiento"
                options={countries}
                placeholder="País de nacimiento"
              />
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
        </Form>
      </FormProvider>
      <div className="flex justify-end mt-2">
        <Button
          type="primary"
          label="Guardar Cambios"
          size="middle"
          onClick={handleFormSubmit}
          disabled={!isDirty || isUpdating}
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col h-[200px] p-4 items-center justify-center">
      <WithoutInformation title="No se encontró información del registro" />
    </div>
  );
};
