//Categories.jsx
import { useState } from "react";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import CategoriesAddModal from "./CategoriesAddModal";
import CategoriesEditModal from "./CategoriesEditModal";
import "./style.css";

const Categories = ({ categories, setCategories }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      <li
        className="category-item !bg-orange-800 hover:opacity-90"
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
