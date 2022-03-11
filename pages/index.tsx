import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";
import { Park } from "@prisma/client";
import Hero from "../components/home/Hero";
import ParkCard from "../components/home/ParkCard";
import Button from "../components/shared/Button";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.park.findMany({
    where: { published: true },
  });
  return { props: { feed } };
};

type Props = {
  feed: Park[];
};

const Home = ({ feed }: Props) => {
  return (
    <Layout>
      <Hero />
      <main>
        <section className="my-20">
          <h2 className="text-xl">Top Rated</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center items-stretch">
            {feed.map((park) => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
          <Button variant="secondary" type="button" text="See more..." />
        </section>
        <section className="my-20">
          <h2 className="text-xl">Recently Added</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center items-stretch">
            {feed.map((park) => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
          <Button variant="secondary" type="button" text="See more..." />
        </section>
      </main>
    </Layout>
  );
};

export default Home;
