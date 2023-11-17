import { Form, Input, Modal, Select, Card, Button } from "antd";
import { useSelector } from "react-redux";

const CreateBill = ({ isModalOpen, setIsModalOpen, addRecord }) => {
  const cart = useSelector((state) => state.cart);
  const [form] = Form.useForm();

  const addBill = (record) => {
    addRecord(record);
    form.resetFields();
    setIsModalOpen(false);
  };
  return (
    <Modal
      title="Yeni Fatura Oluştur"
      open={isModalOpen}
      footer={false}
      onCancel={() => {
        setIsModalOpen(false);
      }}
    >
      <Form form={form} layout="vertical" onFinish={addBill}>
        <Form.Item
          label="Müşteri Adı"
          name="customerName"
          rules={[
            {
              required: true,
              message: "Müşteri adı boş geçilemez.",
            },
          ]}
        >
          <Input placeholder="Müşteri Adı"></Input>
        </Form.Item>
        <Form.Item
          label="Tel No"
          name="customerPhoneNumber"
          rules={[
            {
              required: true,
              message: "Telefon numarası boş geçilemez.",
            },
          ]}
        >
          <Input placeholder="Telefon numarası" maxLength={11}></Input>
        </Form.Item>
        <Form.Item
          label="Ödeme Yöntemi"
          name="paymentMode"
          rules={[
            {
              required: true,
              message: "Ödeme yöntemi boş geçilemez.",
            },
          ]}
        >
          <Select placeholder="Seçiniz...">
            <Select.Option value="Nakit">Nakit</Select.Option>
            <Select.Option value="Kredi Kartı">Kredi Kartı</Select.Option>
          </Select>
        </Form.Item>
        <Card>
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
                ? (cart.total + (cart.total * cart.tax) / 100).toFixed(2) + "₺"
                : "-"}
            </b>
          </div>
          <div className="flex justify-end">
            <Button
              type="primary"
              className="mt-2"
              htmlType="submit"
              disabled={cart.cartItems.length === 0}
            >
              Sipariş Oluştur
            </Button>
          </div>
        </Card>
      </Form>
    </Modal>
  );
};

export default CreateBill;
