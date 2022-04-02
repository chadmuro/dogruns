import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Park } from "@prisma/client";
import prisma from "../lib/prisma";
import Layout from "../components/Layout";
import Hero from "../components/home/Hero";
import ParkCard from "../components/home/ParkCard";
import Button from "../components/shared/Button";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const parks = await prisma.park.findMany({
    where: { published: true },
  });
  return {
    props: {
      parks,
      ...(await serverSideTranslations(locale as string, ["common", "home"])),
    },
  };
};

type Props = {
  parks: Park[];
};

const Home = ({ parks }: Props) => {
  const { t } = useTranslation("home");

  return (
    <Layout>
      <main>
        <Hero />
        <section className="my-20" id="most-popular">
          <h2 className="text-xl">{t("most-popular-parks")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center items-stretch mb-8">
            {parks.map((park) => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
          <div className="flex justify-center">
            <Button
              variant="secondary"
              type="button"
              text={t("more-parks-button")}
            />
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
