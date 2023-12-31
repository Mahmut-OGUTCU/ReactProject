import Header from "../components/header/Header";
import Categories from "../components/categories/Categories";
import Products from "../components/products/Products";
import CartTotals from "../components/cart/CartTotals";
import { appAxios } from "../helper/appAxios";
import { useEffect, useState } from "react";
import { Spin } from "antd";

const HomePage = () => {
  const [categories, setCategories] = useState();
  const [products, setProducts] = useState();
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    /**
     * Get Categories
     */
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

    /**
     * Get Products
     */
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
      <Header setSearch={setSearch} />
      {products && categories ? (
        <div className="home px-6 flex md:flex-row flex-col justify-between gap-10 md:pb-0 pb-24 h-screen">
          <div className="categories overflow-auto max-h-[calc(100vh_-_112px)] md:pb-10">
            <Categories
              categories={categories}
              setCategories={setCategories}
              setFiltered={setFiltered}
              products={products}
            />
          </div>
          <div className="products flex-[8] max-h-[calc(100vh_-_112px)] overflow-y-auto pb-10">
            <Products
              products={products}
              setProducts={setProducts}
              categories={categories}
              filtered={filtered}
              search={search}
            />
          </div>
          <div className="cart-wrapper min-w-[300px] md:-mr-[24px] md:-mt-[24px] border">
            <CartTotals />
          </div>
        </div>
      ) : (
        <Spin
          size="large"
          className="absolute top-1/2 w-screen h-screen flex justify-center"
        />
      )}
    </>
  );
};

export default HomePage;
