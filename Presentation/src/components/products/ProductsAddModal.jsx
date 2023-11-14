import { Button, Form, Input, Modal, Select, message, InputNumber } from "antd";
import { appAxios } from "../../helper/appAxios";

const ProductsAddModal = ({
  isAddModalOpen,
  setIsAddModalOpen,
  products,
  setProducts,
  categories,
}) => {
  const onFinish = (values) => {
    console.log("onFinish", values);
    try {
      appAxios
        .post("product/product-add", values)
        .then(async (response) => {
          if (response.data.status) {
            message.success(response.data.message);
            form.resetFields();
            setProducts([
              ...products,
              {
                _id: Math.random(),
                title: values.title,
                img: values.img,
                price: values.price,
              },
            ]);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.log("Ekleme sırasında hata oluştur. Hata: ", err);
    }
  };
  const [form] = Form.useForm();
  return (
    <Modal
      title="Yeni Ürün Ekle"
      open={isAddModalOpen}
      footer={false}
      onCancel={() => setIsAddModalOpen(false)}
    >
      <Form layout="vertical" onFinish={onFinish} form={form}>
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
              (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
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
          <Button type="primary" htmlType="submit">
            Ekle
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductsAddModal;
