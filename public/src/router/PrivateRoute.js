import { useSelector } from "react-redux";
import Login from "../pages/login/Login";

const PrivateRoute = ({ children}) => {
  const user = useSelector((state) => state.user);
  return user !== null ? children : <Login/>;
};

export default PrivateRoute;
