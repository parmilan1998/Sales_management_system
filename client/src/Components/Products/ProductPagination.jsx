import React, { useEffect } from "react";
import PropTypes from "prop-types";

const ProductPagination = ({ page, setPage, totalPages }) => {
  useEffect(() => {
    if (totalPages <= 1 && page !== 1) {
      setPage(1);
    }
  }, [totalPages, page, setPage]);

  const getPageNumbers = (totalPages) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div>
      <ol className="flex justify-center gap-1 text-xs font-medium">
        <li>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 transition duration-300 hover:bg-emerald-50 hover:stroke-emerald-500 hover:text-emerald-500 focus:bg-emerald-50 focus:stroke-emerald-600 focus:text-emerald-600  focus-visible:outline-none"
          >
            <span className="sr-only">Prev Page</span>
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
        {getPageNumbers(totalPages).map((pageNumber) => (
          <li key={pageNumber}>
            <button
              onClick={() => setPage(pageNumber)}
              disabled={page === pageNumber}
              aria-label={`Goto Page ${pageNumber}`}
              className={` items-center block size-8 rounded border border-gray-100 text-center leading-8 transition duration-300 ${
                page === pageNumber
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "hover:bg-emerald-50 hover:text-cyan-500 focus:bg-cyan-50 focus:text-cyan-600 focus-visible:outline-none"
              }`}
            >
              {pageNumber}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 transition duration-300 hover:bg-emerald-50 hover:stroke-emerald-500 hover:text-emerald-500 focus:bg-emerald-50 focus:stroke-emerald-600 focus:text-emerald-600  focus-visible:outline-none"
          >
            <span className="sr-only">Next Page</span>
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
    </div>
  );
};

ProductPagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default ProductPagination;
