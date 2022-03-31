import { Dog } from "@prisma/client";
import Image from "next/image";
import calculateAge from "../../utils/calculateAge";
import dateFormatter from "../../utils/dateFormatter";

interface DogCardProps {
  dog: Dog;
  selectedDog: Dog | null;
  setSelectedDog: React.Dispatch<React.SetStateAction<Dog | null>>;
}

const DogCard = ({ dog, selectedDog, setSelectedDog }: DogCardProps) => {
  return (
    <div className="relative">
      {selectedDog?.id === dog.id && (
        <div className="absolute top-0 left-0 h-full w-full bg-slate-50/80 dark:bg-gray-800/80 rounded-lg flex justify-center items-center">
          <p>Editing...</p>
        </div>
      )}
      <div className="flex items-center space-x-4 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 p-4 mb-4 ">
        <div className="flex w-full justify-between">
          <div className="flex">
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image
                className="absolute"
                src={
                  dog.image ||
                  "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8ZG9nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
                }
                alt="dog avatar"
                layout="fill"
                objectFit="cover"
              />
            </div>

            <div className="space-y-1 font-medium dark:text-white pl-4">
              <div>
                {dog.name} <span>({dog.breed})</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {calculateAge(dog.birthdate)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {`Birthdate: ${dateFormatter.format(
                  new Date(dog.birthdate as string)
                )}`}
              </div>
            </div>
          </div>
          <button onClick={() => setSelectedDog(dog)}>Edit</button>
        </div>
      </div>
    </div>
  );
};

export default DogCard;
