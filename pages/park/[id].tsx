import { GetServerSideProps } from "next";
import Image from "next/image";
import { Park, ParkHours } from "@prisma/client";
import prisma from "../../lib/prisma";
import Layout from "../../components/Layout";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const park = await prisma.park.findUnique({
    where: { id: params?.id as string },
    include: { parkHours: true, reviews: true },
  });
  return { props: { park } };
};

type Props = {
  park: Park & { parkHours: ParkHours };
};

const ParkDetails = ({ park }: Props) => {
  console.log(park);
  return (
    <Layout>
      <main>
        <section className="flex flex-col sm:flex-row mb-8">
          <div className="w-full sm:w-4/5 relative h-80 sm:h-96 md:h-128">
            <Image
              loader={({ src, width }) => `${src}?w=${width}`}
              src={park.mainImage}
              alt={park.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex flex-col items-start ml-0 sm:ml-8">
            <h2>Park Hours:</h2>
            <ul>
              <li>Sunday: {park.parkHours.sunday}</li>
              <li>Monday: {park.parkHours.monday}</li>
              <li>Tuesday: {park.parkHours.tuesday}</li>
              <li>Wednesday: {park.parkHours.wednesday}</li>
              <li>Thursday: {park.parkHours.thursday}</li>
              <li>Friday: {park.parkHours.friday}</li>
              <li>Saturday: {park.parkHours.saturday}</li>
            </ul>
          </div>
        </section>
        <section className="flex flex-col mb-8">
          <h1>{park.name}</h1>
          <p>{park.address}</p>
          <div>
            <div>rating</div>
            <div>Price: {park.price} yen</div>
          </div>
          <a
            href={park.googleMapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-500 hover:bg-blue-600 rounded-lg hover:bg-gradient-to-bl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 w-max"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 48 48"
            >
              <path
                fill="#48b564"
                d="M35.76,26.36h0.01c0,0-3.77,5.53-6.94,9.64c-2.74,3.55-3.54,6.59-3.77,8.06	C24.97,44.6,24.53,45,24,45s-0.97-0.4-1.06-0.94c-0.23-1.47-1.03-4.51-3.77-8.06c-0.42-0.55-0.85-1.12-1.28-1.7L28.24,22l8.33-9.88	C37.49,14.05,38,16.21,38,18.5C38,21.4,37.17,24.09,35.76,26.36z"
              ></path>
              <path
                fill="#fcc60e"
                d="M28.24,22L17.89,34.3c-2.82-3.78-5.66-7.94-5.66-7.94h0.01c-0.3-0.48-0.57-0.97-0.8-1.48L19.76,15	c-0.79,0.95-1.26,2.17-1.26,3.5c0,3.04,2.46,5.5,5.5,5.5C25.71,24,27.24,23.22,28.24,22z"
              ></path>
              <path
                fill="#2c85eb"
                d="M28.4,4.74l-8.57,10.18L13.27,9.2C15.83,6.02,19.69,4,24,4C25.54,4,27.02,4.26,28.4,4.74z"
              ></path>
              <path
                fill="#ed5748"
                d="M19.83,14.92L19.76,15l-8.32,9.88C10.52,22.95,10,20.79,10,18.5c0-3.54,1.23-6.79,3.27-9.3	L19.83,14.92z"
              ></path>
              <path
                fill="#5695f6"
                d="M28.24,22c0.79-0.95,1.26-2.17,1.26-3.5c0-3.04-2.46-5.5-5.5-5.5c-1.71,0-3.24,0.78-4.24,2L28.4,4.74	c3.59,1.22,6.53,3.91,8.17,7.38L28.24,22z"
              ></path>
            </svg>
            <p className="px-1">View on Google Maps</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#fff"
            >
              <path d="M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 12 L 19 12 L 19 19 L 5 19 L 5 5 L 12 5 L 12 3 L 5 3 z M 14 3 L 14 5 L 17.585938 5 L 8.2929688 14.292969 L 9.7070312 15.707031 L 19 6.4140625 L 19 10 L 21 10 L 21 3 L 14 3 z"></path>
            </svg>
          </a>
        </section>
        <section>review part</section>
      </main>
    </Layout>
  );
};

export default ParkDetails;
