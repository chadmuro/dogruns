import { Park } from "@prisma/client";
import Link from "next/link";

interface ParkCardProps {
  park: Park;
}

const ParkCard = ({ park }: ParkCardProps) => {
  return (
    <Link href={`/park/${park.id}`}>
      <a className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 justify-self-center">
        <img className="rounded-t-lg" src={park.mainImage} alt={park.name} />
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {park.name}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {park.address}
          </p>
          <div className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg hover:bg-gradient-to-bl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
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
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ParkCard;
