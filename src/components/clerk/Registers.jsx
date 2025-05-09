import { SignUp } from "@clerk/clerk-react";

const Registers = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        appearance={{
          layout: {
            socialButtonsPlacement: "bottom", // Hiển thị nút Google/Facebook ở dưới
          },
        }}
      />
    </div>
  );
};

export default Registers;