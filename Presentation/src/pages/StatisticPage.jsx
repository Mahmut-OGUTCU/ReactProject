import { useEffect, useState } from "react";
import Header from "../components/header/Header";
import StatisticCard from "../components/statistics/StatisticCard";
import { Area, Pie } from "@ant-design/plots";
import { appAxios } from "../helper/appAxios";
import { Spin } from "antd";

const StatisticPage = () => {
  const [data, setData] = useState();
  const [datap, setDatap] = useState();
  const user = localStorage.getItem("kullanici");

  useEffect(() => {
    asyncFetchBill();
    asyncFetchProduct();
  }, []);

  const asyncFetchBill = () => {
    appAxios
      .post("bill/bill-get", { id: "" })
      .then(async (response) => {
        if (response.status === 200) {
          const data = response.data.data;
          setData(data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const asyncFetchProduct = () => {
    appAxios
      .post("product/product-get", { id: "" })
      .then(async (response) => {
        if (response.status === 200) {
          const data = response.data.data;
          setDatap(data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const totalAmount = () => {
    return (
      data.reduce((total, item) => item.totalAmount + total, 0).toFixed(2) + "₺"
    );
  };

  const config = {
    data,
    xField: "customerName",
    yField: "totalAmount",
    xAxis: {
      range: [0, 1],
    },
  };

  const config2 = {
    appendPadding: 10,
    data: data,
    angleField: "totalAmount",
    colorField: "customerName",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: "Toplam\nDeğer",
      },
    },
  };

  return (
    <>
      <Header />
      <h1 className="text-4xl font-bold text-center">İstatikler</h1>
      {data && datap ? (
        <div className="px-6 md:pb:0 pb-20">
          <div className="statistic-section">
            <h2 className="text-xl">
              Hoş geldin{" "}
              <span className="text-green-700 font-bold text-xl">{user}</span>.
            </h2>
            <div className="statistic-cards grid xl:grid-cols-4 md:grid-cols-2 my-10 md:gap-10 gap-4">
              <StatisticCard
                img={"/images/user.png"}
                title={"Toplam Müşteri"}
                amount={data?.length}
              />
              <StatisticCard
                img={"/images/money.png"}
                title={"Toplam Kazanç"}
                amount={totalAmount()}
              />
              <StatisticCard
                img={"/images/sale.png"}
                title={"Toplam Satış"}
                amount={data?.length}
              />
              <StatisticCard
                img={"/images/product.png"}
                title={"Toplam Ürün"}
                amount={datap?.length}
              />
            </div>
            <div className="flex justify-between gap-10 lg:flex-row flex-col">
              <div className="lg:w-1/2 lg:h-full h-72 ">
                <Area {...config} />
              </div>
              <div className="lg:w-1/2 lg:h-full h-72 ">
                <Pie {...config2} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spin
          size="large"
          className="absolute top-1/2 w-screen h-screen flex justify-center"
        />
      )}
    </>
  );
};

export default StatisticPage;
