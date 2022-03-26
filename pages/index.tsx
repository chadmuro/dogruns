import { GetStaticProps } from "next";
import { Park } from "@prisma/client";
import prisma from "../lib/prisma";
import Layout from "../components/Layout";
import Hero from "../components/home/Hero";
import ParkCard from "../components/home/ParkCard";
import StyledButton from "../components/shared/StyledButton";

export const getStaticProps: GetStaticProps = async () => {
  const parks = await prisma.park.findMany({
    where: { published: true },
  });
  return { props: { parks } };
};

type Props = {
  parks: Park[];
};

const Home = ({ parks }: Props) => {
  return (
    <Layout>
      <main>
        <Hero />
        <section className="my-20">
          <h2 className="text-xl">Top Rated</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center items-stretch mb-8">
            {parks.map((park) => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
          <div className="flex justify-center">
            <StyledButton
              variant="secondary"
              type="button"
              text="See more..."
            />
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
