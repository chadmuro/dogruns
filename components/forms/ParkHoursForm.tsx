import { FieldError, UseFormRegister } from "react-hook-form";
import Button from "../shared/Button";
import Input from "../shared/Input";

export type ParkHoursFormInputs = {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  extra: string;
};

interface ParkHoursFormProps {
  register: UseFormRegister<ParkHoursFormInputs>;
  errors: {
    monday?: FieldError | undefined;
    tuesday?: FieldError | undefined;
    wednesday?: FieldError | undefined;
    thursday?: FieldError | undefined;
    friday?: FieldError | undefined;
    saturday?: FieldError | undefined;
    sunday?: FieldError | undefined;
    extra?: FieldError | undefined;
  };
  onSubmit: () => void;
  posting: boolean;
}

const ParkHoursForm = ({
  register,
  errors,
  onSubmit,
  posting,
}: ParkHoursFormProps) => {
  return (
    <form className="max-w-sm mx-auto mb-8" onSubmit={onSubmit}>
      <Input
        label="Monday"
        type="text"
        name="monday"
        placeholder="Monday park hours"
        defaultValue=""
        register={register}
        error={errors.monday}
        autoFocus
      />
      <Input
        label="Tuesday"
        type="text"
        name="tuesday"
        placeholder="Tuesday park hours"
        defaultValue=""
        register={register}
        error={errors.tuesday}
      />
      <Input
        label="Wednesday"
        type="text"
        name="wednesday"
        placeholder="Wednesday park hours"
        defaultValue=""
        register={register}
        error={errors.wednesday}
      />
      <Input
        label="Thursday"
        type="text"
        name="thursday"
        placeholder="Thursday park hours"
        defaultValue=""
        register={register}
        error={errors.thursday}
      />
      <Input
        label="Friday"
        type="text"
        name="friday"
        placeholder="Friday park hours"
        defaultValue=""
        register={register}
        error={errors.friday}
      />
      <Input
        label="Saturday"
        type="text"
        name="saturday"
        placeholder="Saturday park hours"
        defaultValue=""
        register={register}
        error={errors.saturday}
      />
      <Input
        label="Sunday"
        type="text"
        name="sunday"
        placeholder="Sunday park hours"
        defaultValue=""
        register={register}
        error={errors.sunday}
      />
      <Input
        label="Additional Information"
        type="text"
        name="extra"
        placeholder="Add any additional information"
        defaultValue=""
        register={register}
        error={errors.extra}
      />
      <Button type="submit" text="Submit" loading={posting} />
    </form>
  );
};

export default ParkHoursForm;
