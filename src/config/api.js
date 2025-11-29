const getAPI = () => {
  const isLocalhost = window.location.hostname === "localhost";
  const isStaging = window.location.href.includes("staging");

  if (isLocalhost) return "http://localhost:4000"; // local server
  if (isStaging) return "";                        // staging URL here

  return "";                                       // production URL here
};

export const API = getAPI();
