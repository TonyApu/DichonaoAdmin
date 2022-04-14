import React, { useEffect, useState } from "react";
import userApi from "../../apis/userApi";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import FeaturedInfoUser from "../../components/featuredInfoUser/FeaturedInfoUser";
import "./home.css";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await userApi.getDataDashboard();
      console.log(response);
      setData(response);
    };
    fetchData();
  }, []);

  return (
    <div className="home">
      <FeaturedInfoUser {...data}/>
      <br />
      <br />
      <FeaturedInfo {...data} />
    </div>
  );
}
