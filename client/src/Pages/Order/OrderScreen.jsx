import React, { useState } from "react";
import GridLoader from "react-spinners/GridLoader";

const OrderScreen = () => {
  const [loading, setLoading] = useState(true);
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
        <div>OrderScreen</div>
      )}
    </>
  );
};

export default OrderScreen;
