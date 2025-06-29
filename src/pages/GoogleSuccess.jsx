import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const image = params.get("image");
    if (token && email) {
      const userData = { name, email, image };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      navigate("/", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate, setUser, setToken]);

  return <div>Signing you in...</div>;
}
