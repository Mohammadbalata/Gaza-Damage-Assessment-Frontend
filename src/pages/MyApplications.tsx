import { useEffect, useState } from "react";
import { axiosClient } from "../api/baseUrl";
import MyApplication from "../components/MyApplication";

const MyApplications = () => {
  const [applicationData, setApplicationData] = useState<any>();

  useEffect(() => {
    const getMyApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosClient.get("/applications/my-application", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplicationData(res.data.data);
        console.log(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };

    getMyApplications();
  }, []);

  return (
    <MyApplication
      id={applicationData?.id}
      status={applicationData?.status}
      locations={applicationData?.locations}
      createdAt={applicationData?.createdAt}
    />
  );
};

export default MyApplications;
