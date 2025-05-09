import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ScrollToTop ";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
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
        <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
    </>
  );
};

export default App;
