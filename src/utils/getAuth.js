export const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Error parsing auth:", error);
    return null;
  }
};
