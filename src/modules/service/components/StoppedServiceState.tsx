import { useMutation } from "@tanstack/react-query";
import Spinner from "shared/components/Spinner";
import { ServiceStateProps } from "../types";
import deleteService from "../api/deleteService";
import startService from "../api/startService";
import PlayIcon from "shared/components/PlayIcon";
import DeleteIcon from "shared/components/DeleteIcon";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WarningModal from "./WarningModal";

const StoppedServiceState = ({ serviceId, interfaces, isDetailView, refetch }: ServiceStateProps) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const navigate = useNavigate();

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    (id: string) => deleteService(id)
  );

  const { mutate: startMutate, isLoading: startLoading } = useMutation(
    (id: string) => startService(id)
  );

  const onStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startMutate(serviceId, {
      onSuccess: refetch,
    });
  };

  const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(true);
  };

  const deleteServiceHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(false);
    deleteMutate(serviceId, {
      onSuccess: refetch,
    });
  };

  const onPlayButtonClick = () => {
    if (interfaces.includes("chat")) {
      navigate(`/prem-chat/${serviceId}`);
    } else {
      alert("Show Documentation")
    }
  };

  const onCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(false);
  };

  if (deleteLoading || startLoading) {
    return <Spinner className="w-5 h-5" />;
  }

  return (
    <>
      <button className="bg-brightgray rounded-3xl px-6 py-[10px] text-sm" onClick={onPlayButtonClick}>
        Open &nbsp; &#8594;
      </button>
      
      {isDetailView &&
      <button onClick={onDelete}>
        <DeleteIcon />
      </button>}
      
      {openDeleteModal && (
        <WarningModal
          icon={<DeleteIcon />}
          description="Are you sure you want to remove this service from your list?"
          okButtonText="Yes"
          title="Warning"
          onCancel={onCancelClick}
          onOk={deleteServiceHandler}
        />
      )}
    </>
  );
};

export default StoppedServiceState;
