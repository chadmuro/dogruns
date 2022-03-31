import { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const providers = await getProviders();
  return {
    props: {
      providers,
      ...(await serverSideTranslations(locale as string, ["common"])),
    },
  };
};

type Props = {
  providers: any;
};

const Signin = ({ providers }: Props) => {
  const { basePath } = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Layout>
      <div className="max-w-sm mx-auto flex flex-col items-center">
        <h2 className="text-xl text-center mb-8">
          Sign up now to add new parks, leave park reviews, and connect with
          other dog owners!
        </h2>
        {Object.values(providers).map((provider: any) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => {
              setLoading(true);
              signIn(provider.id, {
                callbackUrl: `${basePath}`,
              });
            }}
            disabled={loading}
            className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
          >
            {loading ? (
              <>
                <svg
                  role="status"
                  className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#1C64F2"
                  />
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        ))}
      </div>
    </Layout>
  );
};

export default Signin;
