import { useRoutes } from "react-router-dom";
import { routes } from "./Routes";
import Layout from "../components/Layout";

const AppRoutes = () => {
  const router = useRoutes(routes);
  return <Layout>{router}</Layout>;
};

export default AppRoutes;
