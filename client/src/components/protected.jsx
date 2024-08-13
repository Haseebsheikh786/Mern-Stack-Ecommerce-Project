import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectloginUser } from "../pages/auth/authSlice";

function Protected({ children }) {
  const user  = useSelector(selectloginUser);

  if (!user) {
    return <Navigate to="/login" replace={true}></Navigate>;
  }
  return children;
}

export default Protected;
