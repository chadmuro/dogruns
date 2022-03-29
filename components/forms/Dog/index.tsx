import { FieldError, UseFormRegister } from "react-hook-form";
import Button from "../../shared/Button";
import Input from "../../shared/Input";

export type NewDogInputs = {
  name: string;
  image: string;
  breed: string;
  birthdate: string;
};

interface DogFormProps {
  register: UseFormRegister<NewDogInputs>;
  errors: {
    name?: FieldError | undefined;
    image?: FieldError | undefined;
    breed?: FieldError | undefined;
    birthdate?: FieldError | undefined;
  };
  hideForm?: () => void;
}

const DogForm = ({ register, errors, hideForm }: DogFormProps) => {
  return (
    <form>
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
        error={errors.image}
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
        <Button type="submit" text="Add dog" />
      </div>
    </form>
  );
};

export default DogForm;
