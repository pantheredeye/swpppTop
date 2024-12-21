// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from "@redwoodjs/web";

const SwitchPage = () => {
  return (
    <>
      <Metadata title="Switch" description="Switch page" />

      <h1>SwitchPage</h1>
      <p>
        Find me in <code>./web/src/pages/SwitchPage/SwitchPage.tsx</code>
      </p>
      {/*
          My default route is named `switch`, link to me with:
          `<Link to={routes.switch()}>Switch</Link>`
      */}
    </>
  );
};

export default SwitchPage;
