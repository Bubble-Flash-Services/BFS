import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { getProfile } from "../api/auth";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";

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
          // Store token in localStorage (for web and web view)
          localStorage.setItem("token", token);
          
          // Also store in Capacitor Preferences for native app persistence
          // This ensures the token is available when the app is opened via deep link
          if (Capacitor.isNativePlatform()) {
            console.log('📱 Storing token in Capacitor Preferences for native app...');
            await Preferences.set({ key: 'auth_token', value: token });
            console.log('✅ Token stored in Capacitor Preferences');
          }
          
          // Fetch complete profile data from server
          console.log('🔍 Fetching complete profile data after Google login...');
          const fullProfile = await getProfile(token);
          
          if (fullProfile && !fullProfile.error) {
            console.log('✅ Complete profile data fetched:', fullProfile);
            
            // Store user profile in both storages for consistency
            localStorage.setItem('user', JSON.stringify(fullProfile));
            if (Capacitor.isNativePlatform()) {
              await Preferences.set({ key: 'user_profile', value: JSON.stringify(fullProfile) });
            }
            
            // Allow Google users to proceed without phone/address
            // They can provide these details later when needed (e.g., placing an order)
            await updateAuth(token, fullProfile);
          } else {
            console.log('⚠️ Profile fetch did not return data; proceeding to home');
          }
          
          navigate("/", { replace: true });
        } catch (error) {
          console.error('❌ Error fetching profile after Google login:', error);
          // On error, proceed to home and let app load profile
          localStorage.setItem('token', token);
          if (Capacitor.isNativePlatform()) {
            try {
              await Preferences.set({ key: 'auth_token', value: token });
            } catch (prefError) {
              console.error('Error storing token in Capacitor Preferences:', prefError);
            }
          }
          navigate('/', { replace: true });
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
