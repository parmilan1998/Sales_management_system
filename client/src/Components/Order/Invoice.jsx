import React from 'react'
import {
    IoIosAddCircleOutline,
    IoIosRemoveCircleOutline,
  } from "react-icons/io";
  import { CiCircleRemove } from "react-icons/ci";
  import PropTypes from "prop-types";

const Invoice = ({
    cart,
    decrementQuantity,
    incrementQuantity,
    setCart,
    calculateSubtotal,
    clearAll,
    handleFinished
}) => {

  return (
        <div className="col-span-3 col-start-6">
          <div className="bg-white lg:mt-6 rounded shadow-md px-4 mb-8">
            <h2 className="text-2xl font-semibold pt-6 font-acme text-gray-600">
              Items
            </h2>
            {cart.length === 0 ? (
              <p className="text-center pt-10 pb-16">Your cart is empty</p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 py-4">
                  {cart.map((item, index) => (
                    <div key={index} className=" border-b-[1px]">
                      <div className="flex gap-2">
                        <table>
                          <tr className="flex gap-3 justify-center items-center">
                            <th className="flex justify-start items-start">
                              {" "}
                              <img
                                src={`http://localhost:5000/public/products/${item.imageUrl}`}
                                alt={item.productName}
                                className="w-12 h-12 object-cover mb-4 rounded"
                              />
                            </th>
                            <th className="w-24">
                              {" "}
                              <h2 className="text-xs text-start font-medium">
                                {item.productName}
                              </h2>
                            </th>
                            <th className="w-24">
                              {" "}
                              <p className="text-black text-start font-medium flex justify-center items-center gap-2">
                                <IoIosRemoveCircleOutline
                                  onClick={() =>
                                    decrementQuantity(item.productID)
                                  }
                                />
                                <span>{item.quantity}</span>
                                <button
                                  onClick={() =>
                                    incrementQuantity(item.productID)
                                  }
                                  disabled={item.quantity >= item.totalQuantity}
                                >
                                  <IoIosAddCircleOutline />
                                </button>
                              </p>
                            </th>
                            <th className="w-24">
                              <input
                                type="number"
                                value={item.discount || 0}
                                onChange={(e) => {
                                  const updatedCart = cart.map((cartItem) =>
                                    cartItem.productID === item.productID
                                      ? {
                                          ...cartItem,
                                          discount: Number(e.target.value),
                                        }
                                      : cartItem
                                  );
                                  setCart(updatedCart);
                                }}
                                className="w-16 px-2 py-1 text-sm border rounded"
                                min="0"
                                max="100"
                              />
                              <span className="text-gray-600 px-1 text-xs">
                                %
                              </span>
                            </th>
                            <th className="w-20">
                              {" "}
                              <p className=" text-gray-800 text-start text-xs font-medium">
                                Rs.
                                {(
                                  item.unitPrice *
                                  item.quantity *
                                  (1 - (item.discount || 0) / 100)
                                ).toFixed(2)}
                              </p>
                            </th>
                            <th>
                              <button
                                className="mt-1"
                                onClick={() =>
                                  setCart(
                                    cart.filter(
                                      (p) => p.productID !== item.productID
                                    )
                                  )
                                }
                              >
                                <CiCircleRemove color="red" />
                              </button>
                            </th>
                          </tr>
                        </table>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 text-gray-600 py-1 border-t-0">
                    <h3 className="text-md font-bold">Total</h3>
                    <p className="text-sm font-bold">
                      Rs.{calculateSubtotal().toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center py-4 gap-3 border-t">
                    <button
                      onClick={clearAll}
                      className="bg-red-500 text-sm text-white w-full px-4 py-2 rounded"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={handleFinished}
                      className="bg-green-500 text-sm text-white w-full px-4 py-2 rounded"
                    >
                      Finished
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
  )
}

Invoice.propTypes = {
    cart: PropTypes.array.isRequired,
    decrementQuantity: PropTypes.func.isRequired,
    incrementQuantity: PropTypes.func.isRequired,
    setCart: PropTypes.func.isRequired,
    calculateSubtotal: PropTypes.func.isRequired,
    clearAll: PropTypes.func.isRequired,
    handleFinished: PropTypes.func.isRequired,
  };

export default Invoice