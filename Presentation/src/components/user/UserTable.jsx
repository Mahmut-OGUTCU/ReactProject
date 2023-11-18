import { Form, Table, Button } from "antd";

const UserTable = ({ users, openModal, deleteRecord }) => {
  const handleEdit = (record) => {
    openModal(record);
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
      title: "Adı",
      dataIndex: "firstname",
    },
    {
      title: "Soyadı",
      dataIndex: "lastname",
    },
    {
      title: "e-Posta",
      dataIndex: "email",
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      render: (text) => (text ? "Evet" : "Hayır"),
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
        <Table
          bordered
          columns={columns}
          dataSource={users}
          rowKey="_id"
          scroll={{ x: 1000, y: 600 }}
        />
      </Form>
    </div>
  );
};
export default UserTable;
