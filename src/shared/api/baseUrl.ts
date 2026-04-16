import axios from "axios";

export const axiosClient: any = axios.create({
  baseURL: "https://admin.sawabuildgaza.com/api",
});
