import { useEffect, useState } from "react";
import Header from "../components/header/Header";
import { appAxios } from "../helper/appAxios";
import UserTable from "../components/user/UserTable";
import UserModal from "../components/user/UserModal";
import { Button } from "antd";

const UserPage = () => {
  const [isAddorEditModalOpen, setIsAddorEditModalOpen] = useState(false);

  const [users, setUsers] = useState();
  const [user, setUser] = useState();
  const getUsers = () => {
    appAxios
      .post("user/user-get", { id: "" })
      .then(async (response) => {
        if (response.data.status) {
          setUsers(response.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addRecord = (record) => {
    console.log("addRecord", record);
    setIsAddorEditModalOpen(false);
    appAxios
      .post("user/user-add", record)
      .then(async (response) => {
        if (response.data.status) {
          setUsers(record);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const editRecord = (record) => {
    console.log("editRecord", record);
    setIsAddorEditModalOpen(false);
    appAxios
      .post("user/user-update", record)
      .then(async (response) => {
        if (response.data.status) {
          setUsers(
            users.map((item) => {
              if (item._id === record._id) {
                return {
                  ...item,
                  firstname: record.firstname,
                  lastname: record.lastname,
                  email: record.email,
                };
              }
              return item;
            })
          );
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteRecord = (id) => {
    console.log("deleteRecord", id);
    appAxios
      .post("user/user-delete", { id: id })
      .then(async (response) => {
        if (response.data.status) {
          setUsers(users.filter((item) => item._id !== id));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const openModal = (record) => {
    setIsAddorEditModalOpen(true);
    setUser(record);
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <>
      <Header />
      <h1 className="text-4xl font-bold text-center mb-4">Kullanıcılar</h1>
      <div className="flex justify-end mb-8 mt-8">
        <Button
          type="primary"
          className="min-w-[200px]"
          onClick={() => openModal()}
        >
          Ekle
        </Button>
      </div>
      <UserTable
        users={users}
        openModal={openModal}
        deleteRecord={deleteRecord}
      />
      <UserModal
        user={user}
        setUser={setUser}
        addRecord={addRecord}
        editRecord={editRecord}
        isAddorEditModalOpen={isAddorEditModalOpen}
        setIsAddorEditModalOpen={setIsAddorEditModalOpen}
      />
    </>
  );
};

export default UserPage;
