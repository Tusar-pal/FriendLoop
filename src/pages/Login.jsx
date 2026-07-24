import { Star } from "lucide-react";
import { assets } from "../assets/assets";
import { SignIn } from "@clerk/react";

const Login = () => {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background */}
      <img
        src={assets.bgImage}
        alt=""
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />

      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col px-6 md:px-16 lg:px-32">
        {/* Logo */}
        <div className="pt-6 md:pt-10">
          <img src={assets.logo} alt="logo" className="h-8 md:h-10" />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center">
          <div className="max-w-3xl">
            {/* Users + Rating */}
            <div className="flex items-center gap-3 mb-3">
              <img src={assets.group_users} alt="" className="h-8 md:h-10" />

              <div>
                <div className="flex gap-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-amber-500 fill-amber-500"
                      />
                    ))}
                </div>
                <p className="text-sm text-gray-600">Used by 12+ developers</p>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-indigo-900 to-indigo-600 bg-clip-text text-transparent">
              More than just friends truly connect
            </h1>

            {/* Subtext */}
            <p className="mt-3 text-lg md:text-2xl text-indigo-900 max-w-xl">
              connect with global community on pingup.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (LOGIN FORM) */}
      <div className="hidden md:flex flex-1 items-center justify-center p-10">
        
          <SignIn />
        
      </div>
    </div>
  );
};

export default Login;
