import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Button from "../shared/Button";
import SecondaryButton from "../shared/SecondaryButton";

const Hero = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const { t } = useTranslation("home");

  return (
    <div className="my-20 md:my-40 lg:ml-16 text-left flex">
      <div className="md:w-3/5">
        <h1 className="text-6xl font-semibold text-black dark:text-white leading-none">
          Tokyo Dog Runs
        </h1>
        <h3 className="my-6 text-xl font-light text-gray-500 dark:text-gray-300">
          {t("subtitle")}
        </h3>
        <div className="flex items-baseline">
          <Link href="#most-popular">
            <a>
              <Button type="button" text={t("parks-button")} size="lg" />
            </a>
          </Link>
          {!!session && (
            <Link href="/park/new">
              <a className="ml-4">
                <Button
                  variant="secondary"
                  type="button"
                  size="lg"
                  text={t("add-park-button")}
                />
              </a>
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin">
              <a className="ml-4">
                <SecondaryButton type="button" text="Admin Page" size="lg" />
              </a>
            </Link>
          )}
        </div>
      </div>
      <div className="hidden md:flex w-2/5 justify-end lg:justify-center">
        <motion.div
          className="rounded-full relative md:h-80 md:w-80 lg:h-96 lg:w-96 overflow-hidden flex justify-center"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            className="absolute"
            src="/images/hero1.jpg"
            alt="hero picture 1"
            layout="fill"
            objectFit="cover"
          />
        </motion.div>
        <motion.div
          className="absolute top-96 lg:top-96 left-1/2"
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="rounded-full relative h-48 w-48 lg:h-60 lg:w-60 overflow-hidden flex justify-center">
            <Image
              className="absolute"
              src="https://images.unsplash.com/photo-1633587481886-be96064e89ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              alt="hero picture 2"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
