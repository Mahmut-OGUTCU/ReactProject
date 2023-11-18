import { Form, Table, Button } from "antd";
import ProductsEditModal from "./ProductsEditModal";
import { useState } from "react";

const ProductsTable = ({
  categories,
  products,
  setProducts,
  editRecord,
  deleteRecord,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };

  const handleDelete = (record) => {
    if (window.confirm("Emin misiniz?")) {
      if (deleteRecord) {
        deleteRecord(record._id);
      }
    }
  };

  const columns = [
    {
      title: "Ürün Adı",
      dataIndex: "title",
      width: "8%",
    },
    {
      title: "Ürün Görseli",
      dataIndex: "img",
      width: "4%",
      render: (text, record) => (
        <img
          src={text}
          alt={record.title}
          className="w-full h-20 object-cover"
        />
      ),
    },
    {
      title: "Ürün Fiyatı",
      dataIndex: "price",
      width: "8%",
    },
    {
      title: "Ürün Kategorisi",
      dataIndex: "category",
      width: "8%",
      render: (text, record) => text?.title, // Kategori adını göster
    },
    {
      title: "İşlemler",
      dataIndex: "action",
      width: "8%",
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Düzenle
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record)}>
            Sil
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Form>
        <Table
          bordered
          columns={columns}
          dataSource={products}
          rowKey="_id"
          scroll={{ x: 1000, y: 600 }}
        />
      </Form>
      <ProductsEditModal
        categories={categories}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        selectedRecord={selectedRecord}
        editRecord={editRecord}
      />
    </div>
  );
};
export default ProductsTable;
