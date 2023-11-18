//Categories.jsx
import { useEffect, useState } from "react";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import CategoriesAddModal from "./CategoriesAddModal";
import CategoriesEditModal from "./CategoriesEditModal";
import "./style.css";

const Categories = ({ categories, setCategories, setFiltered, products }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryid, setCategoryid] = useState("6558975071945dd396eca6f6");
  useEffect(() => {
    if (categoryid === "6558975071945dd396eca6f6") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((item) => item.category._id === categoryid));
    }
  }, [products, setFiltered, categoryid]);

  return (
    <ul className="flex gap-4 md:flex-col text-lg ">
      {categories.map((item) => (
        <li
          className={`category-item min-w-[100px] ${
            item._id === categoryid && "!bg-pink-700"
          }`}
          key={item._id}
          onClick={() => {
            setCategoryid(item._id);
          }}
        >
          <span>{item.title}</span>
        </li>
      ))}
      <li
        className="category-item !bg-purple-800 hover:opacity-90 min-w-[100px]"
        onClick={() => setIsAddModalOpen(true)}
      >
        <PlusOutlined className="md:text-2xl" />
      </li>
      <li
        className="category-item !bg-orange-800 hover:opacity-90 min-w-[100px]"
        onClick={() => setIsEditModalOpen(true)}
      >
        <EditOutlined className="md:text-2xl" />
      </li>
      <CategoriesAddModal
        categories={categories}
        setCategories={setCategories}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
      />
      <CategoriesEditModal
        categories={categories}
        setCategories={setCategories}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
      />
    </ul>
  );
};

export default Categories;
