import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authServices";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Default redirect
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/home";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      login(data.user,data.token);
      console.log(data.token,data.user)
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7EB] px-4">
      <div className="w-full max-w-md bg-white border border-[#CADCAE] rounded-2xl shadow-sm p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: "#EDA35A" }}>
          Login
        </h1>
        <p className="text-center mb-6" style={{ color: "#333" }}>
          Welcome back to <span style={{ color: "#EDA35A" }}>PetCare</span>
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg px-4 py-3" style={{ backgroundColor: "#FEE8D9", color: "#EDA35A" }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm" style={{ color: "#333" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-3 py-3 outline-none bg-white"
              style={{
                border: "1px solid #CADCAE",
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #EDA35A")}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm" style={{ color: "#333" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-3 py-3 outline-none bg-white"
              style={{
                border: "1px solid #CADCAE",
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #EDA35A")}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            />
          </div>

          <button
            type="submit"
            className="w-full font-semibold py-3 rounded-lg transition-all"
            style={{ backgroundColor: "#EDA35A", color: "#fff" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center" style={{ color: "#333" }}>
          Don’t have an account?{" "}
          <button
            type="button"
            className="font-semibold underline underline-offset-4"
            style={{ color: "#EDA35A" }}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>

        {/* Soft helper bar */}
        <div className="mt-6 h-2 w-full rounded-full" style={{ backgroundColor: "#FEE8D9" }} />
      </div>
    </div>
  );
};

export default Login;
