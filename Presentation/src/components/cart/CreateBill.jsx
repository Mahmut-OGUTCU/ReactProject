import { Form, Input, Modal, Select, Card, Button } from "antd";

const CreateBill = ({ isModalOpen, setIsModalOpen }) => {
  return (
    <Modal
      title="Yeni Fatura Oluştur"
      open={isModalOpen}
      footer={false}
      onCancel={() => {
        setIsModalOpen(false);
      }}
    >
      <Form layout="vertical">
        <Form.Item
          label="Müşteri Adı"
          name={""}
          rules={[
            {
              required: true,
              message: "Not null",
            },
          ]}
        >
          <Input placeholder="Müşteri Adı"></Input>
        </Form.Item>
        <Form.Item
          label="Tel No"
          name={""}
          rules={[
            {
              required: true,
              message: "Not null",
            },
          ]}
        >
          <Input placeholder="Telefon numarası" maxLength={11}></Input>
        </Form.Item>
        <Form.Item
          label="Ödeme Yöntemi"
          name={""}
          rules={[
            {
              required: true,
              message: "Not null",
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
            <span>549.00t</span>
          </div>
          <div className="flex justify-between my-2">
            <span>KDV Toplam %8</span>
            <span className="text-red-600">+43.92t</span>
          </div>
          <div className="flex justify-between">
            <b>Toplam</b>
            <b>592.92t</b>
          </div>
          <div className="flex justify-end">
            <Button
              type="primary"
              className="mt-2"
              onClick={() => {
                setIsModalOpen(true);
              }}
              htmlType="submit"
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
