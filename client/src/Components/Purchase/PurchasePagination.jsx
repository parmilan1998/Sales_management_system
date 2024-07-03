import React from "react";
import PropTypes from "prop-types";

const PurchasePagination = ({ page, setPage, totalPages }) => {
  const getPurchasePageNumbers = (totalPages) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages !== 2) {
    return null;
  }

  return (
    <div>
      <>
        <ol className="flex justify-center py-4 gap-1 text-md font-medium">
          <li>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              href="#"
              className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>

          {getPurchasePageNumbers(totalPages).map((pageNo) => (
            <li key={pageNo}>
              <button
                onClick={() => setPage(pageNo)}
                disabled={page === pageNo}
                aria-label={`Goto Page ${pageNo}`}
                className={`inline-flex size-8 items-center justify-center stroke-slate-700 px-4 rounded text-sm font-medium text-slate-700 transition duration-300 ${
                  page === pageNo
                    ? "bg-blue-500 text-white"
                    : "hover:bg-emerald-50 hover:text-blue-500 focus:bg-cyan-50 focus:text-blue-600 focus-visible:outline-none"
                }`}
              >
                {pageNo}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              href="#"
              className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ol>
      </>
    </div>
  );
};

PurchasePagination.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default PurchasePagination;
