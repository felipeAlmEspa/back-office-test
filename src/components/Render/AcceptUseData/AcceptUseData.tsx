import { CustomFooterModal, Title } from "@itsa-develop/itsa-fe-components";


export interface AcceptUseDataProps {
    onCancel: () => void;
    onAcceptUseData: () => void;
}

export const AcceptUseData = ({ onCancel, onAcceptUseData }: AcceptUseDataProps) => {
  return (
    <div className="space-y-3 text-gray-700 text-sm md:text-base leading-relaxed">
      <Title level={5} title=" Política de Uso de Datos Personales" />
      <p className="text-justify">
        Política de protección de datos personales entre Importadora Tomebamba y
        sus clientes: El uso de su información cumple con lo establecido en la
        Ley Orgánica de Protección de Datos Personales y otras normativas
        aplicables.
      </p>
      <p className="text-justify">
        Su información personal se procesa y utiliza, de manera general, con el
        fin de verificar y ejecutar un contrato o como parte de la tramitación
        de sus solicitudes o requerimientos.
      </p>
      <p className="text-justify">
        La información obtenida a través de nuestros canales de comunicación
        comercial se tratará con confidencialidad y se utilizará con el
        propósito de proporcionarle información relevante sobre nuestros
        productos y servicios, así como para mejorar su experiencia como
        cliente.
      </p>
      <p className="text-justify">
        Nuestra política busca mantener la transparencia y proporcionar a
        nuestros clientes el control sobre sus datos personales, brindando la
        posibilidad de optar por no recibir nuestras comunicaciones comerciales
        en cualquier momento.
      </p>
      <CustomFooterModal
        onCancel={onCancel}
        onConfirm={onAcceptUseData}
        confirmLabel="Aceptar uso de datos personales"
      />
    </div>
  );
};
