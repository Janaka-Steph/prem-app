import AppContainer from "shared/components/AppContainer";
import ServiceDocumentation from "./ServiceDocumentation";
import useService from "shared/hooks/useService";
import { useNavigate, useParams } from "react-router-dom";
import ServiceHeader from "./ServiceHeader";
import ServiceResourceBars from "./ServiceResourceBars";
import ServiceGeneralInfo from "./ServiceGeneralInfo";
import ServiceDescription from "./ServiceDescription";
import ServiceLoading from "./ServiceLoading";
import { Service } from "modules/service/types";
import { getServiceStatus } from "shared/helpers/utils";
import ServiceActions from "modules/service/components/ServiceActions";
import { useQueryClient } from "@tanstack/react-query";
import { SERVICES_KEY } from "shared/hooks/useServices";
import { useCallback } from "react";

const ServiceDetail = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { data: response, isLoading, refetch } = useService(serviceId!);
  const service = response?.data || ({} as Service);

  const refetchServices = useCallback(() => {
    refetch();
    queryClient.refetchQueries([SERVICES_KEY]);
  }, [refetch]);

  const status = getServiceStatus(service);

  const onPlayButtonClick = () => {
    if (service.interfaces.includes("chat")) {
      navigate(`/prem-chat/${serviceId}`);
    }
  };

  if (isLoading) return <ServiceLoading />;
  return (
    <AppContainer>
      <div className="flex flex-wrap items-start mb-[62px] mt-5">
        <ServiceHeader
          title={service.name}
          tags={service.interfaces}
          icon={service.icon}
          subtitle={service.id}
        />
        <ServiceActions
          serviceId={serviceId!}
          status={status}
          refetch={refetchServices}
        >
          {status === "running" && (
            <button
              className="bg-brightgray rounded-3xl px-6 py-[10px] text-sm"
              onClick={onPlayButtonClick}
            >
              Play &nbsp; &#8594;
            </button>
          )}
        </ServiceActions>
      </div>
      <div className="service-detail">
        <ServiceDocumentation description={service.documentation} />
        <div className="w-full">
          <ServiceResourceBars serviceId={service.id} />
          <ServiceGeneralInfo service={service} />
          <ServiceDescription description={service.description} />
        </div>
      </div>
    </AppContainer>
  );
};

export default ServiceDetail;
