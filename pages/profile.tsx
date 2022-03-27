import Layout from "../components/Layout";
import Button from "../components/shared/Button";

const Profile = () => {
  return (
    <Layout>
      <h1>Profile</h1>
      <h2>Name</h2>
      <h2>Email</h2>
      <Button type="button" text="Add dog" />
    </Layout>
  );
};

export default Profile;
