import { Button, Form, Input, Modal } from "antd";
import { appAxios } from "../../helper/appAxios";

export const CategoriesAddModal = ({
  categories,
  setCategories,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    try {
      appAxios
        .post("category/category-add", values)
        .then(async (response) => {
          if (response.data.status) {
            form.resetFields();
            setCategories([
              ...categories,
              {
                _id: response.data.data._id,
                title: values.title,
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
  return (
    <Modal
      title="Yeni Kategori Ekle"
      open={isAddModalOpen}
      footer={false}
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
  );
};

export default CategoriesAddModal;
