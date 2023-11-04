import { Table, Card, Button } from "antd";
import { useState } from "react";
import Header from "../components/header/Header";
import CreateBill from "../components/cart/CreateBill";

const CartPages = () => {
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Header />
      <div className="px-6">
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          pagination={false}
        />
        ;
        <div className="card-total flex justify-end">
          <Card className="w-72">
            <div className="flex justify-between">
              <span>Ara Toplam</span>
              <span>549.00t</span>
            </div>
            <div className="flex justify-between my-2">
              <span>KDV Toplam %8</span>
              <span className="text-red-600">+43.92t</span>
            </div>
            <div className="flex justify-between">
              <b>Toplam</b>
              <b>592.92t</b>
            </div>
            <Button
              type="primary"
              size="large"
              className="mt-2 w-full"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Sipariş Oluştur
            </Button>
          </Card>
        </div>
      </div>
      <CreateBill isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
};

export default CartPages;
