import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";
import { Park } from "@prisma/client";
import ParkCard from "../components/shared/ParkCard";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.park.findMany({
    where: { published: true },
  });
  return { props: { feed } };
};

type Props = {
  feed: Park[];
};

const Home: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Top Rated</h1>
        <main className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center items-stretch">
          {props.feed.map((park) => (
            <ParkCard key={park.id} park={park} />
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Home;
