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
    console.log("Düzenle:", record);
    setSelectedRecord(record); // Set the selected record
    setIsEditModalOpen(true); // Open the modal
  };

  const handleDelete = (record) => {
    if (window.confirm("Emin misiniz?")) {
      console.log("Sil", record);
      if (deleteRecord) {
        deleteRecord(record._id);
      }
    }
  };

  const columns = [
    {
      title: "Ürün Adı",
      dataIndex: "title",
    },
    {
      title: "Ürün Fiyatı",
      dataIndex: "price",
    },
    {
      title: "Ürün Kategorisi",
      dataIndex: "category",
      render: (text, record) => text?.title, // Kategori adını göster
    },
    {
      title: "İşlemler",
      dataIndex: "action",
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
        <Table bordered columns={columns} dataSource={products} rowKey="_id" />
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