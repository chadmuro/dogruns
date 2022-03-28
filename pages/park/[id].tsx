import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { Park, ParkHours, Review } from "@prisma/client";
import prisma from "../../lib/prisma";
import Layout from "../../components/Layout";
import Reviews from "../../components/park/Reviews";
import Rating from "../../components/park/Rating";
import Button from "../../components/shared/Button";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const park = await prisma.park.findUnique({
    where: { id: params?.id as string },
    include: {
      parkHours: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
  return { props: { park } };
};

type Props = {
  park: Park & {
    parkHours: ParkHours;
    reviews: (Review & {
      user: {
        name: string;
        image: string;
      };
    })[];
  };
};

const ParkDetails = ({ park }: Props) => {
  const allReviews = park.reviews.map((review) => review.rating);
  const ratingSum = allReviews.reduce((a, b) => a + b, 0);
  const ratingAverage = ratingSum / allReviews.length || 0;

  if (!park.published) {
    return (
      <Layout>
        <main>
          <h1 className="text-4xl mb-4">{park.name}</h1>
          <p>Thank you for your submission!</p>
          <p>Park details are currently under review...</p>
          <Link href="/">
            <a>
              <Button type="button" text="Back to Home" />
            </a>
          </Link>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main>
        <section className="flex flex-col sm:flex-row mb-8">
          <div className="w-full relative h-80 sm:h-96 md:h-128">
            <Image
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
        </section>
        <section className="flex flex-col mb-8">
          <div className="flex justify-between align-top">
            <h1 className="text-4xl mb-4">{park.name}</h1>
            <Button
              type="button"
              text={
                <>
                  <svg
                    className="sm:mr-2 sm:-ml-1"
                    fill="#fff"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                  >
                    <path d="M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                  </svg>
                  <p className="hidden sm:block">Add to favorites</p>
                </>
              }
            />
          </div>
          <div className="flex flex-col sm:flex-row">
            <div className="mb-8 sm:mb-0 w-full sm:w-1/2">
              <h2 className="text-xl">Information:</h2>
              <p className="mb-4">{park.address}</p>
              <div className="mb-4">
                <a
                  href={park.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    type="button"
                    text={
                      <>
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
                      </>
                    }
                  />
                </a>
              </div>
              <div>
                <div className="flex">
                  {park.reviews.length ? (
                    <>
                      <Rating rating={ratingAverage} />
                      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {`${ratingAverage.toFixed(2)} ouf of 5`}
                      </p>
                    </>
                  ) : (
                    <p>No reviews yet</p>
                  )}
                </div>
                <p>{`Type: ${park.type}`}</p>
                <p>{`Price: ${park.price || "Free"}`}</p>
                <p>{`Additional Information: ${
                  park.additionalInformation || "None"
                }`}</p>
              </div>
            </div>
            <div className="flex w-full sm:w-1/2">
              <div className="hidden sm:block h-64 border-l-2 border-gray-500 px-2" />
              <div className="flex flex-col sm:pl-8 md:pl-16">
                <h2 className="text-xl">Park Hours:</h2>
                <div className="flex leading-8 mb-2">
                  <ul>
                    <li>Monday</li>
                    <li>Tuesday</li>
                    <li>Wednesday</li>
                    <li>Thursday</li>
                    <li>Friday</li>
                    <li>Saturday</li>
                    <li>Sunday</li>
                  </ul>
                  <ul className="pl-4 flex-1">
                    <li>{park.parkHours?.monday || "Not available..."}</li>
                    <li>{park.parkHours?.tuesday || "Not available..."}</li>
                    <li>{park.parkHours?.wednesday || "Not available..."}</li>
                    <li>{park.parkHours?.thursday || "Not available..."}</li>
                    <li>{park.parkHours?.friday || "Not available..."}</li>
                    <li>{park.parkHours?.saturday || "Not available..."}</li>
                    <li>{park.parkHours?.sunday || "Not available..."}</li>
                  </ul>
                </div>
                <p>
                  {!!park.parkHours?.extra &&
                    `Additional Information: ${park.parkHours?.extra}`}
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="h-1 border-b-2 border-gray-500 mx-4 mb-8" />
        <Reviews park={park} />
      </main>
    </Layout>
  );
};

export default ParkDetails;
