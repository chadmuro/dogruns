import { ParkType } from "@prisma/client";
import * as yup from "yup";
import Button from "../shared/Button";
import Input from "../shared/Input";

export type ParkFormInputs = {
  name: string;
  nameJapanese: string;
  address: string;
  addressJapanese: string;
  google: string;
  // image: string;
  type: ParkType;
  price: string;
};

export const parkSchema = yup
  .object({
    name: yup.string().required("Park name is required"),
    nameJapanese: yup.string().required("Park name is required"),
    address: yup.string().required("Park address is required"),
    addressJapanese: yup.string().required("Park address is required"),
    google: yup.string().required("Google Map link is required"),
    // image: yup.string().required("Main mage is required"),
    price: yup.string(),
  })
  .required();

interface ParkFormProps {
  register: any;
  errors: any;
  onSubmit: () => void;
  posting: boolean;
}

const ParkForm = ({ register, errors, onSubmit, posting }: ParkFormProps) => {
  return (
    <form className="max-w-sm mx-auto mb-8" onSubmit={onSubmit}>
      <div className="flex justify-between">
        <Input
          label="Park name"
          type="text"
          name="name"
          placeholder="Park name"
          register={register}
          error={errors.name}
          autoFocus
        />
        <Input
          label="Park name (Japanese)"
          type="text"
          name="nameJapanese"
          placeholder="Name in Japanese"
          register={register}
          error={errors.nameJapanese}
        />
      </div>
      <div className="flex justify-between">
        <Input
          label="Park address"
          type="text"
          name="address"
          placeholder="Park address"
          register={register}
          error={errors.address}
        />
        <Input
          label="Park address (Japanese)"
          type="text"
          name="addressJapanese"
          placeholder="Address in Japanese"
          register={register}
          error={errors.addressJapanese}
        />
      </div>
      <Input
        label="Google Map link"
        type="text"
        name="google"
        placeholder="Add a link to the Google Map"
        register={register}
        error={errors.google}
      />
      {/* <Input
          label="Main image"
          type="file"
          accept="image/*"
          name="image"
          placeholder="Select a main image"
          
          register={register}
          error={errors.image}
        /> */}
      <label
        htmlFor="countries"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
      >
        Select the park type
      </label>
      <div className="mb-6">
        <select
          {...register("type")}
          id="type"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value={ParkType.INDOOR}>Indoor</option>
          <option value={ParkType.OUTDOOR}>Outdoor</option>
          <option value={ParkType.BOTH}>Indoor/Outdoor</option>
        </select>
      </div>
      <Input
        label="Price"
        type="text"
        name="price"
        placeholder="Price in yen"
        register={register}
        error={errors.price}
      />
      <Button type="submit" text="Submit" loading={posting} />
    </form>
  );
};

export default ParkForm;
