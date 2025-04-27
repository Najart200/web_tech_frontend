import React, { useEffect, useState } from "react";
import { fetchResources } from "../api"; // Import the fetchResources function from the API file
import ResourceList from "../components/ResourceList"; // Import ResourceList

const ResourcesPage = ({ token }) => {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);

  console.log("ResourcesPage Token:", token); // Log token to check if it's passed correctly

  useEffect(() => {
    const loadResources = async () => {
      try {
        if (!token) {
          throw new Error("Token is required"); // Check if token exists before calling fetchResources
        }

        const resourcesData = await fetchResources(token); // Use the token when fetching resources
        setResources(resourcesData); // Update state with resources
      } catch (error) {
        setError(error.message); // Set error state if something goes wrong
      }
    };

    loadResources();
  }, [token]);

  return (
    <div className="resources-page">
      <h2 className="resources-title">Available Resources</h2>

      {/* Error handling */}
      {error && <div className="error-message">{error}</div>}

      {/* Resource List */}
      {!error && <ResourceList resources={resources} token={token} />}
    </div>
  );
};

export default ResourcesPage;
