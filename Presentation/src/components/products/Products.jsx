import { Link } from "react-router-dom";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import ProductItem from "./ProductsItem";
import ProductsAddModal from "./ProductsAddModal";
import { useState } from "react";

const Products = ({ products, setProducts, categories, filtered, search }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  return (
    <div className="products-wrapper grid grid-cols-card gap-4">
      {filtered
        .filter((val) => val.title.toLowerCase().includes(search))
        .map((item) => (
          <ProductItem item={item} setProducts={setProducts} key={item._id} />
        ))}
      <div
        className="product-item border hover:shadow-lg cursor-pointer transition-all select-none bg-purple-800 flex justify-center items-center hover:opacity-90 min-h-[150px]"
        onClick={() => setIsAddModalOpen(true)}
      >
        <PlusOutlined className="md:text-2xl text-white" />
      </div>
      <Link
        to="/products"
        className="product-item border hover:shadow-lg cursor-pointer transition-all select-none bg-orange-800 flex justify-center items-center hover:opacity-90 min-h-[150px]"
      >
        <EditOutlined className="md:text-2xl text-white" />
      </Link>
      <ProductsAddModal
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        products={products}
        setProducts={setProducts}
        categories={categories}
      />
    </div>
  );
};

export default Products;
