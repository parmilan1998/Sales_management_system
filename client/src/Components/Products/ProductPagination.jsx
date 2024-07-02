import React from "react";
import PropTypes from "prop-types";

const ProductPagination = ({ page, setPage, totalPages }) => {
  const getPageNumbers = (totalPages) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-4">
      <div>
        <nav role="navigation" aria-label="Pagination Navigation">
          <ul className="flex list-none items-center justify-center divide-x divide-slate-300 overflow-hidden rounded border border-slate-300 text-sm text-slate-700">
            <li>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                href="javascript:void(0)"
                aria-label="Previous page"
                className="inline-flex h-10 items-center justify-center gap-4 stroke-slate-700 px-4 text-sm font-medium text-slate-700 transition duration-300 hover:bg-emerald-50 hover:stroke-emerald-500 hover:text-emerald-500 focus:bg-emerald-50 focus:stroke-emerald-600 focus:text-emerald-600 focus-visible:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="-mx-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  role="graphics-symbol"
                  aria-labelledby="title-35 desc-35"
                >
                  <title id="title-35">Previous page</title>
                  <desc id="desc-35">link to previous page</desc>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </li>
            {getPageNumbers(totalPages).map((pageNumber) => (
              <li key={pageNumber}>
                <button
                  onClick={() => setPage(pageNumber)}
                  disabled={page === pageNumber}
                  href="javascript:void(0)"
                  aria-label={`Goto Page ${pageNumber}`}
                  className={`inline-flex h-10 items-center justify-center stroke-slate-700 px-4 text-sm font-medium text-slate-700 transition duration-300 ${
                    page === pageNumber
                      ? "bg-cyan-500 text-white"
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
                href="javascript:void(0)"
                aria-label="Next page"
                className="inline-flex h-10 items-center justify-center gap-4 stroke-slate-700 px-4 text-sm font-medium text-slate-700 transition duration-300 hover:bg-emerald-50 hover:stroke-emerald-500 hover:text-emerald-500 focus:bg-emerald-50 focus:stroke-emerald-600 focus:text-emerald-600 focus-visible:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="-mx-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  role="graphics-symbol"
                  aria-labelledby="title-36 desc-36"
                >
                  <title id="title-36">Next page</title>
                  <desc id="desc-36">link to next page</desc>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

ProductPagination.propTypes = {
  page: PropTypes.array.isRequired,
  setPage: PropTypes.func.isRequired,
  totalPages: PropTypes.func.isRequired,
};

export default ProductPagination;
