import { Table, Card, Button } from "antd";
import { useEffect, useState } from "react";
import Header from "../components/header/Header";
import PrintBill from "../components/bills/PrintBill";
import { appAxios } from "../helper/appAxios";
import { dateFormatter } from "../helper/utils";
import { PrinterOutlined } from "@ant-design/icons";

const BillPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billItems, setBillItems] = useState();
  const [customer, setCustomer] = useState();
  console.log("custorme", customer);
  useEffect(() => {
    appAxios
      .post("bill/bill-get", { id: "" })
      .then(async (response) => {
        if (response.status === 200) {
          const data = response.data.data;
          setBillItems(data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  console.log(billItems);

  const columns = [
    {
      title: "Müşteri Adı",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Telefon Numarası",
      dataIndex: "customerPhoneNumber",
      key: "customerPhoneNumber",
    },
    {
      title: "Oluşturma Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => dateFormatter(createdAt),
    },
    {
      title: "Ödeme Şekli",
      dataIndex: "paymentMode",
      key: "paymentMode",
    },
    {
      title: "Toplam Fiyat",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text, record) => <p>{text}₺</p>,
    },
    {
      title: "İşlem",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <Button
            type="link"
            className="pl-0"
            onClick={() => {
              setIsModalOpen(true);
              setCustomer(record);
            }}
            icon={<PrinterOutlined />}
          ></Button>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <div className="px-6">
        <h1 className="text-4xl font-bold text-center">Faturalar</h1>
        <Table
          dataSource={billItems}
          columns={columns}
          bordered
          pagination={true}
          rowKey={"_id"}
          scroll={{
            x:1000
          }}
        />
      </div>
      <PrintBill
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        customer={customer}
      />
    </>
  );
};

export default BillPage;
