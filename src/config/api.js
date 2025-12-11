const getAPI = () => {
  const isLocalhost = window.location.hostname === "localhost";
  const isStaging = window.location.href.includes("staging");
  const isProduction = window.location.href.includes("production");

  if (isLocalhost) return "http://localhost:4000"; // local server
  if (isStaging) return "";                        // staging URL here
  if (isProduction) return "https://siot-server.onrender.com";                     // production URL here

  return "";                                       // production URL here
};

export const API = getAPI();
