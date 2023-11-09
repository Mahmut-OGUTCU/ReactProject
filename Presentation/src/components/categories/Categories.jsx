import { useState } from "react";
import "./style.css";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, message } from "antd";

const Categories = ({ categories, setCategories }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
    try {
      fetch("http://localhost:5000/api/category/category-add", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGQzNmY1NmZhMWRhZTFiYjEzYzVmYyIsIm1haWwiOiJhc2RAZ21haWwuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNjk5NTYxOTg4LCJleHAiOjE2OTk1NjU1ODh9.LJ5rjj4VA0KJi12RRtE4w92GHU7H836iEm7q7ib4m3w",
        },
      });
      message.success("Kategori başarıyla kaydedildi.");
      form.resetFields();
      setCategories([...categories, values]);
    } catch (err) {
      console.log("Ekleme sırasında hata oluştur. Hata: ", err);
    }
  };
  return (
    <ul className="flex gap-4 md:flex-col text-lg">
      {categories.map((item) => (
        <li className="category-item" key={item._id}>
          <span>{item.title}</span>
        </li>
      ))}
      <li
        className="category-item !bg-purple-800 hover:opacity-90"
        onClick={() => setIsAddModalOpen(true)}
      >
        <PlusOutlined className="md:text-2xl" />
      </li>
      <Modal
        title="Yeni Kategori Ekle"
        open={isAddModalOpen}
        footer={false}
        onOk={() => setIsAddModalOpen(false)}
        onCancel={() => setIsAddModalOpen(false)}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            label="Kategori Adı"
            name="title"
            rules={[
              {
                required: true,
                message: "Kategori adı boş geçilemez.",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item className="flex justify-end mb-0">
            <Button type="primary" htmlType="submit">
              Ekle
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </ul>
  );
};

export default Categories;
