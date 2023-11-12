import { Button, Form, Input, Modal, Select, InputNumber } from "antd";
import { useEffect } from "react";

const ProductsEditModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  categories,
  selectedRecord,
  editRecord,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedRecord) {
      // Populate the form fields with the selected record data
      form.setFieldsValue({
        title: selectedRecord.title,
        img: selectedRecord.img,
        price: selectedRecord.price,
        category: selectedRecord.category._id,
      });
    }
    console.log(selectedRecord);
  }, [selectedRecord, form]);

  const handleUpdate = () => {
    const updatedData = form.getFieldsValue();
    updatedData._id = selectedRecord._id;
    updatedData.category = {
      _id: updatedData.category,
      title: categories.find((cat) => cat._id === updatedData.category)?.title, // Assuming categories is an array of all categories
    };
    console.log("updatedData", updatedData);
    editRecord(updatedData);
    setIsEditModalOpen(false);
  };

  return (
    <Modal
      title="Ürünü Düzenle"
      open={isEditModalOpen} // Use "visible" instead of "open"
      footer={false}
      onCancel={() => setIsEditModalOpen(false)}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Ürün Adı"
          name="title"
          rules={[
            {
              required: true,
              message: "Ürün adı boş geçilemez.",
            },
          ]}
        >
          <Input placeholder="Ürün Adı" />
        </Form.Item>
        <Form.Item
          label="Ürün Görsel Linki"
          name="img"
          rules={[
            {
              required: true,
              message: "Ürün görseli boş geçilemez.",
            },
          ]}
        >
          <Input placeholder="Ürün Görsel Linki" />
        </Form.Item>
        <Form.Item
          label="Ürün Fiyatı"
          name="price"
          rules={[
            {
              required: true,
              message: "Ürün fiyatı boş geçilemez.",
            },
          ]}
        >
          <InputNumber min={0} placeholder="Ürün Fiyatı" className="w-full" />
        </Form.Item>
        <Form.Item
          label="Ürün Kategorisi"
          name="category"
          rules={[
            {
              required: true,
              message: "Kategori boş geçilemez.",
            },
          ]}
        >
          <Select
            showSearch
            style={{
              width: "100%",
            }}
            placeholder="Kategori"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={categories?.map((category) => ({
              value: category._id,
              label: category.title,
            }))}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleUpdate}>
            Güncelle
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ProductsEditModal;
