import axios from "axios";
import React, { useEffect, useState } from "react";
import GridLoader from "react-spinners/GridLoader";
import Barcode from "react-barcode";
import { useParams } from "react-router-dom";
import ProductPagination from "../../Components/Products/ProductPagination";
import fetchProducts from "../../api/fetchProducts";
import ProductSort from "../../Components/Products/ProductSort";
import ProductSearch from "../../Components/Products/ProductSearch";

const OrderScreen = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const baseUrl = "http://localhost:5000/public/products";
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ASC");
  const [limit, setLimit] = useState(6);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/product/list`);
      setProduct(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    fetchProducts(id, page, limit, sort, search, setProduct, setTotalPages);
  }, [id, page, limit, sort, search]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full h-[75vh]">
          <GridLoader
            loading={loading}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
            color="#4682B4"
          />
        </div>
      ) : (
        <div className="max-w-screen-xl h-[100%] z-0 mx-auto lg:px-8 font-poppins cursor-pointer">
          <div className="flex lg:flex-row md:flex-row flex-col justify-between items-center mx-4 mb-4 mt-2">
            <div className="flex gap-2 mt-2 mr-0 items-center">
              <h2 className="text-3xl text-gray-600 font-semibold mt-0">
                Products Here!{" "}
              </h2>
              <div className="mt-1 ">
                <ProductSort
                  sort={sort}
                  setSort={setSort}
                  fetchProducts={fetchProducts}
                />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <ProductSearch
                search={search}
                setSearch={setSearch}
                setPage={setPage}
              />
            </div>
          </div>
          <div className=" font-poppins">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
              {product.map((product, index) => (
                <div key={index} className="rounded p-6 bg-white">
                  <div className="">
                    <div>
                      <img
                        src={`${baseUrl}/${product.imageUrl}`}
                        alt="card image"
                        className="aspect-video w-full h-56 bg-cover object-fill"
                      />
                      <div>
                        <Barcode
                          value={`${product.productName}, Rs.${product.unitPrice}`}
                          width={1}
                          height={64}
                          displayValue={false}
                          className="w-full bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ProductPagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default OrderScreen;
