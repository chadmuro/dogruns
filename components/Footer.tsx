const Footer = () => {
  return (
    <footer className="p-4 bg-white rounded-lg shadow md:p-6 dark:bg-gray-800">
      <div className="max-w-screen-xl mx-auto md:flex md:items-center justify-center">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2022{" "}
          <a href="https://flowbite.com" className="hover:underline">
            Chad Murobayashi
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
