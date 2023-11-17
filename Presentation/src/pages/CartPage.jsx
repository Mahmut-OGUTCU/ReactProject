import { Table, Card, Button, message, Popconfirm } from "antd";
import { useState } from "react";
import Header from "../components/header/Header";
import CreateBill from "../components/cart/CreateBill";
import { useSelector, useDispatch } from "react-redux";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { increase, decrease, deleteCart, reset } from "../redux/cart/CartSlice";
import { appAxios } from "../helper/appAxios";
import { useNavigate } from "react-router-dom";

const CartPages = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addRecord = (record) => {
    const payload = {
      ...record,
      subTotal: cart.total.toFixed(2),
      tax: ((cart.total * cart.tax) / 100).toFixed(2),
      totalAmount: (cart.total + (cart.total * cart.tax) / 100).toFixed(2),
      cartItems: cart.cartItems.map((item) => ({
        _id: item._id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        img: item.img,
      })),
    };
    console.log("CartPage record:", payload);
    appAxios
      .post("bill/bill-add", payload)
      .then(async (response) => {
        if (response.data.status) {
          message.success(response.data.message);
          dispatch(reset());
          navigate("/bills");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const columns = [
    {
      title: "Ürün Görseli",
      dataIndex: "img",
      key: "img",
      width: "8%",
      render: (text, record) => (
        <img
          src={text}
          alt={record.title}
          className="w-full h-20 object-cover"
        />
      ),
    },
    {
      title: "Ürün Adı",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      render: (text, record) => <p>{record.category.title}</p>,
    },
    {
      title: "Ürün Fiyatı",
      dataIndex: "price",
      key: "price",
      render: (text, record) => <p>{record.price.toFixed(2)}₺</p>,
    },
    {
      title: "Ürün Adedi",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <div className="flex items-center">
          <Button
            type="primary"
            size="small"
            className="w-full flex items-center justify-center !rounded-full"
            icon={<MinusCircleOutlined />}
            onClick={() => {
              if (record.quantity === 1) {
                if (window.confirm("Ürün Silinsin Mi?")) {
                  dispatch(decrease(record));
                  message.success("Ürün Sepetten Silindi.");
                }
              }
              if (record.quantity > 1) {
                dispatch(decrease(record));
              }
            }}
          />
          <span className="font-bold w-10 inline-block text-center">
            {record.quantity}
          </span>
          <Button
            type="primary"
            size="small"
            className="w-full flex items-center justify-center !rounded-full"
            icon={<PlusCircleOutlined />}
            onClick={() => dispatch(increase(record))}
          />
        </div>
      ),
    },
    {
      title: "Toplam Fiyat",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <p>{(record.quantity * record.price).toFixed(2)}₺</p>
      ),
    },
    {
      title: "İşlemler",
      width: "4%",
      render: (_, record) => {
        return (
          <Popconfirm
            title="Silmek için emin misiniz?"
            onConfirm={() => {
              dispatch(deleteCart(record));
              message.success("Ürün Sepetten Silindi.");
            }}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="link" danger icon={<ClearOutlined />}></Button>
          </Popconfirm>
        );
      },
    },
  ];
  return (
    <>
      <Header />
      <div className="px-6">
        <Table
          dataSource={cart.cartItems}
          columns={columns}
          bordered
          pagination={false}
          rowKey={"_id"}
        />
        ;
        <div className="card-total flex justify-end">
          <Card className="w-72">
            <div className="flex justify-between">
              <span>Ara Toplam</span>
              <span>{cart.total > 0 ? cart.total.toFixed(2) + "₺" : "-"}</span>
            </div>
            <div className="flex justify-between my-2">
              <span>KDV Toplam %{cart.tax}</span>
              <span className="text-red-600">
                {cart.total + (cart.total * cart.tax) / 100 > 0
                  ? "+" + ((cart.total * cart.tax) / 100).toFixed(2) + "₺"
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <b>Toplam</b>
              <b>
                {" "}
                {cart.total + (cart.total * cart.tax) / 100 > 0
                  ? (cart.total + (cart.total * cart.tax) / 100).toFixed(2) +
                    "₺"
                  : "-"}
              </b>
            </div>
            <Button
              type="primary"
              size="large"
              className="mt-2 w-full"
              onClick={() => {
                setIsModalOpen(true);
              }}
              disabled={cart.cartItems.length === 0}
            >
              Sipariş Oluştur
            </Button>
          </Card>
        </div>
      </div>
      <CreateBill
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        addRecord={addRecord}
      />
    </>
  );
};

export default CartPages;
