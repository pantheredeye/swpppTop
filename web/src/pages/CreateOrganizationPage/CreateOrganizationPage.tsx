// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from "@redwoodjs/web";

const CreateOrganizationPage = () => {
  return (
    <>
      <Metadata
        title="CreateOrganization"
        description="CreateOrganization page"
      />

      <h1>CreateOrganizationPage</h1>
      <p>
        Find me in{" "}
        <code>
          ./web/src/pages/CreateOrganizationPage/CreateOrganizationPage.tsx
        </code>
      </p>
      {/*
          My default route is named `createOrganization`, link to me with:
          `<Link to={routes.createOrganization()}>CreateOrganization</Link>`
      */}
    </>
  );
};

export default CreateOrganizationPage;
