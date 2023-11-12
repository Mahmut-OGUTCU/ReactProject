import { useEffect, useState } from "react";
import Header from "../components/header/Header";
import ProductsTable from "../components/products/ProductsTable";
import { appAxios } from "../helper/appAxios";
import { message } from "antd";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const editRecord = (record) => {
    console.log("axios öncesi products:", products);
    appAxios
      .post("product/product-update", record)
      .then(async (response) => {
        if (response.data.status) {
          message.success(response.data.message);
          setProducts(
            products.map((item) => {
              if (item._id === record._id) {
                return {
                  ...item,
                  title: record.title,
                  price: record.price,
                  img: record.img,
                  category: record.category,
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
    console.log("axios sonrası products:", products);
  };

  const deleteRecord = (id) => {
    appAxios
      .post("product/product-delete", { id: id })
      .then(async (response) => {
        if (response.data.status) {
          message.success(response.data.message);
          setProducts(products.filter((item) => item._id !== id));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    appAxios
      .post("category/category-get", { id: "" })
      .then(async (response) => {
        if (response.status === 200) {
          const data = response.data.data;
          setCategories(data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    appAxios
      .post("product/product-get", { id: "" })
      .then(async (response) => {
        if (response.status === 200) {
          const data = response.data.data;
          setProducts(data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return (
    <>
      <Header />
      <h1 className="text-4xl font-bold text-center mb-4">Ürünler</h1>
      <ProductsTable
        categories={categories}
        products={products}
        setProducts={setProducts}
        editRecord={editRecord}
        deleteRecord={deleteRecord}
      />
    </>
  );
};

export default Products;
