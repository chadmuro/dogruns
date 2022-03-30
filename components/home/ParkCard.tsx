import { Park } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import Button from "../shared/Button";

interface ParkCardProps {
  park: Park;
}

const ParkCard = ({ park }: ParkCardProps) => {
  return (
    <Link href={`/park/${park.id}`}>
      <a className="max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 justify-self-center">
        <div className="relative w-full h-48">
          <Image
            className="rounded-t-lg"
            loader={({ src, width }) => `${src}?w=${width}`}
            src={
              park.mainImage ||
              "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2062&q=80"
            }
            alt={park.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {park.name}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {park.address}
          </p>
          <Button
            type="button"
            text={
              <>
                See details
                <svg
                  className="ml-2 -mr-1 w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </>
            }
          />
        </div>
      </a>
    </Link>
  );
};

export default ParkCard;
