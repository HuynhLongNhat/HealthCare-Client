import ResetPassword from "@/components/ResetPassword";

const ResetPasswordPage = () => {
  return (
    <div className="flex flex-col min-h-screen ">
     
      <div className="pt-24 md:pt-12" />
      <div className="flex items-center justify-center">
        <div className="rounded-2xl shadow-[0_0px_15px_0_rgba(59,130,246,0.5)]">
          <ResetPassword />
        </div>
      </div>
      <div className="pb-24 md:pb-12" />
    </div>
  );
};

export default ResetPasswordPage;