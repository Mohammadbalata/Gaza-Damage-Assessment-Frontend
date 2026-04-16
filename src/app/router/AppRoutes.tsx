import { useRoutes } from "react-router-dom";
import { routes } from "./Routes";

const AppRoutes = () => {
  const router = useRoutes(routes);
  return router;
};

export default AppRoutes;
