import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const image = params.get("image");
    if (token && email) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ name, email, image }));
      navigate("/", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return <div>Signing you in...</div>;
}
