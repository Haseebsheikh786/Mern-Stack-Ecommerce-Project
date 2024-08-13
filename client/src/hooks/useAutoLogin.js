import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../pages/auth/authSlice";
function useAutoLogin() {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    (async function autoLoginApiCall() {
      try { 
        const response = await axios.get(`/refresh`, {
          withCredentials: true,
        });
        console.log(response.data.user.Isverified);
        if (response.status === 200) {
          const data = {
            _id: response.data.user._id,
            email: response.data.user.email,
            userName: response.data.user.userName,
            Isverified: response.data.user.Isverified,
            role: response.data.user.role,
          };

          dispatch(setUser({ data: data }));
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return loading;
}

export default useAutoLogin;
