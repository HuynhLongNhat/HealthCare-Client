import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ScrollToTop ";
const App = () => {
  return (
    <>
       <ScrollToTop />
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
       
    </>
  );
};

export default App;
