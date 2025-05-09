import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        appearance={{
          layout: {
            socialButtonsPlacement: "bottom", 
          },
        }}
      />
    </div>
  );
};

export default Login;