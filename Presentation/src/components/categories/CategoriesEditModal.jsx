import { useState } from "react";
import { Button, Form, Input, Modal, Table, message } from "antd";
import { appAxios } from "../../helper/appAxios";

const CategoriesEditModal = ({
  categories,
  setCategories,
  isEditModalOpen,
  setIsEditModalOpen,
}) => {
  const deleteCategory = (id) => {
    if (window.confirm("Emin misiniz?")) {
      try {
        appAxios
          .post("category/category-delete", { id: id })
          .then(async (response) => {
            if (response.data.status) {
              setCategories(categories.filter((item) => item._id !== id));
              setEditingRow({});
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onFinish = (values) => {
    try {
      if (editingRow._id) {
        appAxios
          .post("category/category-update", { ...values, id: editingRow._id })
          .then(async (response) => {
            if (response.data.status) {
              setCategories(
                categories.map((item) => {
                  if (item._id === editingRow._id) {
                    return { ...item, title: values.title };
                  }
                  return item;
                })
              );
              setEditingRow({});
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        message.error("Lütfen ilk olarak bir kayıt düzenleyiniz.");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const [editingRow, setEditingRow] = useState({});

  const columns = [
    {
      title: "Kategori Adı",
      dataIndex: "title",
      render: (_, record) => {
        if (record._id === editingRow._id) {
          return (
            <Form.Item
              className="mb-0"
              name="title"
              initialValue={record.title}
              rules={[
                {
                  required: true,
                  message: "Kategori adı boş geçilemez.",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{record.title}</p>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <div>
            <Button
              type="link"
              onClick={() => setEditingRow(record)}
              className="pl-0"
            >
              Düzenle
            </Button>
            <Button type="text" htmlType="submit" className="text-gray-500">
              Kaydet
            </Button>
            <Button
              type="link"
              danger
              onClick={() => deleteCategory(record._id)}
            >
              {" "}
              Sil
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <Modal
      open={isEditModalOpen}
      title="Kategori İşlemleri"
      footer={false}
      onCancel={() => {
        setIsEditModalOpen(false);
        setEditingRow({});
      }}
    >
      <Form onFinish={onFinish}>
        <Table
          bordered
          dataSource={categories}
          columns={columns}
          rowKey={"_id"}
        />
      </Form>
    </Modal>
  );
};
export default CategoriesEditModal;
