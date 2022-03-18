import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

export async function getServerSideProps(context: any) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

type Props = {
  providers: any;
};

const Signin = ({ providers }: Props) => {
  const { basePath } = useRouter();
  console.log(basePath);
  return (
    <Layout>
      <form className="max-w-sm mx-auto">
        {Object.values(providers).map((provider: any) => (
          <div key={provider.id}>
            <button
              type="button"
              onClick={() =>
                signIn(provider.id, {
                  callbackUrl: `${basePath}}/`,
                })
              }
            >{`Sign in with ${provider.name}`}</button>
          </div>
        ))}
      </form>
    </Layout>
  );
};

export default Signin;
