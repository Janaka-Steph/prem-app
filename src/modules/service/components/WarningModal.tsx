import OutlineCircleButton from "shared/components/OutlineCircleButton";
import PrimaryButton from "shared/components/PrimaryButton";
import WarningShapeIcon from "shared/components/WarningShapeIcon";
import { WarningModalProps } from "shared/types";

const WarningModal = ({
  onCancel,
  onOk,
  cancelButtonText = "Cancel",
  okButtonText = "Ok",
  icon,
  title = "Warning",
  description,
}: WarningModalProps) => {
  return (
    <div
      className="warning-modal"
      aria-modal
      aria-hidden
      tabIndex={-1}
      role="dialog"
    >
      <div className="warning-modal__content gradient-border">
        <div className="flex gap-[24px]">
          <div className="polygon-shape">{icon || <WarningShapeIcon />}</div>
          <div>
            <h2>{title}</h2>
            <p className="!text-base">{description}</p>
          </div>
        </div>
        <div className="hr" />
        <div className="warning-modal__footer">
          <OutlineCircleButton
            onClick={onCancel}
            className="!rounded-md items-center flex !border h-[43px] !mt-0 justify-center opacity-70 w-full"
          >
            {cancelButtonText}
          </OutlineCircleButton>
          <PrimaryButton onClick={onOk} className="w-full">
            {okButtonText}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
