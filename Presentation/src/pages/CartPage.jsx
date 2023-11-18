import { Table, Card, Button, message, Input, Popconfirm, Space } from "antd";
import { useRef, useState } from "react";
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
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

const CartPages = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

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
    appAxios
      .post("bill/bill-add", payload)
      .then(async (response) => {
        if (response.data.status) {
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
      ...getColumnSearchProps("title"),
    },
    {
      title: "Kategori",
      dataIndex: "categoryTitle",
      key: "categoryTitle",
      // render: (text, record) => <p>{record.category.title}</p>,
      ...getColumnSearchProps("categoryTitle"),
    },
    {
      title: "Ürün Fiyatı",
      dataIndex: "price",
      key: "price",
      render: (text, record) => <p>{record.price.toFixed(2)}₺</p>,
      sorter: (a, b) => a.price - b.price,
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
          scroll={{
            x: 750,
          }}
        />
        ;
        <div className="card-total flex justify-end">
          <Card className="w-72 min-w-[250px]">
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
