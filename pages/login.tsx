import Layout from "../components/Layout";
import Button from "../components/shared/Button";
import Input from "../components/shared/Input";

const Login = () => {
  return (
    <Layout>
      <form className="max-w-sm">
        <Input
          label="Your email"
          name="email"
          type="email"
          placeholder="name@dogruns.com"
          required
        />
        <Input label="Your password" name="password" type="password" required />
        <Button type="submit" text="Submit" />
      </form>
    </Layout>
  );
};

export default Login;
