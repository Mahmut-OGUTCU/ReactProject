import Header from "../components/header/Header";
import Categories from "../components/categories/Categories";
import Products from "../components/products/Products";
import CartTotals from "../components/cart/CartTotals";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/category/category-get",
          {
            method: "POST",
            body: JSON.stringify({ id: "" }),
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGQzNmY1NmZhMWRhZTFiYjEzYzVmYyIsIm1haWwiOiJhc2RAZ21haWwuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNjk5NTYxOTg4LCJleHAiOjE2OTk1NjU1ODh9.LJ5rjj4VA0KJi12RRtE4w92GHU7H836iEm7q7ib4m3w",
            },
          }
        );
        const data = await res.json();
        setCategories(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getCategories();
  }, []);

  return (
    <>
      <Header />
      <div className="home px-6 flex md:flex-row flex-col justify-between gap-10 md:pb-0 pb-24">
        <div className="categories overflow-auto max-h-[calc(100vh_-_112px)] md:pb-10">
          <Categories categories={categories} setCategories={setCategories} />
        </div>
        <div className="products flex-[8] max-h-[calc(100vh_-_112px)] overflow-y-auto pb-10">
          <Products />
        </div>
        <div className="cart-wrapper min-w-[300px] md:-mr-[24px] md:-mt-[24px] border">
          <CartTotals />
        </div>
      </div>
    </>
  );
};

export default HomePage;
