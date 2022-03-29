import { FieldError, UseFormRegister } from "react-hook-form";
import * as yup from "yup";
import Button from "../../shared/Button";
import Input from "../../shared/Input";

export type NewDogInputs = {
  name: string;
  image: any;
  breed: string;
  birthdate: string;
};

export const dogSchema = yup
  .object({
    name: yup.string().required("Dog name is required"),
    breed: yup.string().required("Dog breed is required"),
    birthdate: yup.string().required("Dog birthdate is required"),
  })
  .required();

interface DogFormProps {
  register: UseFormRegister<NewDogInputs>;
  errors: {
    name?: FieldError | undefined;
    image?: any;
    breed?: FieldError | undefined;
    birthdate?: FieldError | undefined;
  };
  posting: boolean;
  onSubmit: () => void;
  hideForm?: () => void;
}

const DogForm = ({
  register,
  errors,
  posting,
  onSubmit,
  hideForm,
}: DogFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <Input
        autoFocus
        label="Dog name"
        type="text"
        placeholder="Dog name"
        name="name"
        register={register}
        error={errors.name}
      />
      <Input
        label="Dog image"
        type="file"
        accept="image/*"
        name="image"
        placeholder="Select a dog image"
        register={register}
        error={errors.image as FieldError}
      />
      <Input
        label="Dog breed"
        type="text"
        placeholder="Dog breed"
        name="breed"
        register={register}
        error={errors.breed}
      />
      <Input
        label="Dog birthdate"
        type="date"
        placeholder="Dog birthdate"
        name="birthdate"
        register={register}
        error={errors.birthdate}
      />
      <div className="flex">
        {!!hideForm && (
          <div className="mr-4">
            <Button
              type="button"
              text="Cancel"
              variant="secondary"
              onClick={hideForm}
            />
          </div>
        )}
        <Button type="submit" text="Add dog" loading={posting} />
      </div>
    </form>
  );
};

export default DogForm;
