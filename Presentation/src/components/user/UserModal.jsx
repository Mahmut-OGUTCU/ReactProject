import { Button, Form, Input, Modal } from "antd";
import { useEffect } from "react";

export const UserModal = ({
  user,
  addRecord,
  editRecord,
  isAddorEditModalOpen,
  setIsAddorEditModalOpen,
}) => {
  const [form] = Form.useForm();
  const onFinish = (record) => {
    if (user?._id) {
      record._id = user._id;
      record.password = user.password;
      editRecord(record);
    } else {
      addRecord(record);
    }
  };
  console.log(user);
  useEffect(() => {
    if (user?._id) {
      form.setFieldsValue({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        // ilerleyen zamanda admin bilgisi güncelleme
      });
    } else {
      form.resetFields();
    }
  }, [user, form]);
  return (
    <Modal
      title={!user ? "Yeni Kullanıcı Ekle" : "Kullanıcı Güncelle"}
      open={isAddorEditModalOpen}
      footer={false}
      onCancel={() => setIsAddorEditModalOpen(false)}
    >
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          label="Kullanıcı Adı"
          name="firstname"
          rules={[
            {
              required: true,
              message: "Kullanıcı adı boş geçilemez.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Kullanıcı Soyadı"
          name="lastname"
          rules={[
            {
              required: true,
              message: "Kullanıcı Soyadı boş geçilemez.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="e-Posta"
          name="email"
          rules={[
            {
              required: true,
              message: "e-Posta boş geçilemez.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        {user?._id ? (
          ""
        ) : (
          <Form.Item
            label="Şifre"
            name="password"
            rules={[
              {
                required: true,
                message: "e-Posta boş geçilemez.",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item className="flex justify-end mb-0">
          <Button type="primary" htmlType="submit">
            {!user ? "Ekle" : "Güncelle"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
