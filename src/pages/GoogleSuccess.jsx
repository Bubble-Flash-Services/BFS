import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { getProfile } from "../api/auth";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const { updateAuth } = useAuth();

  useEffect(() => {
    const handleGoogleSuccess = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const name = params.get("name");
      const email = params.get("email");
      const image = params.get("image");
      
      if (token && email) {
        try {
          // Store token immediately
          localStorage.setItem("token", token);
          
          // Fetch complete profile data from server
          console.log('🔍 Fetching complete profile data after Google login...');
          const fullProfile = await getProfile(token);
          
          if (fullProfile && !fullProfile.error) {
            console.log('✅ Complete profile data fetched:', fullProfile);
            // Use complete profile data from server
            updateAuth(token, fullProfile);
          } else {
            console.log('⚠️ Using basic Google profile data as fallback');
            // Fallback to basic Google data if server fetch fails
            const basicUserData = { name, email, image };
            updateAuth(token, basicUserData);
          }
          
          navigate("/", { replace: true });
        } catch (error) {
          console.error('❌ Error fetching profile after Google login:', error);
          // Fallback to basic Google data
          const basicUserData = { name, email, image };
          updateAuth(token, basicUserData);
          navigate("/", { replace: true });
        }
      } else {
        console.error('❌ Missing token or email from Google login');
        navigate("/", { replace: true });
      }
    };

    handleGoogleSuccess();
  }, [navigate, updateAuth]);

  return <div>Signing you in...</div>;
}
