import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showingFrom,
  showingTo,
  totalItems,
  itemName = "items",
}) => {
  const windowSize = 3;

  const getPaginationRange = (currentPage, totalPages) => {
    if (totalPages <= windowSize) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = currentPage;
    if (currentPage + windowSize - 1 > totalPages) {
      start = totalPages - windowSize + 1;
    }
    return Array.from({ length: windowSize }, (_, i) => start + i);
  };

  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t gap-4 dark:border-gray-600">
      <p className="text-sm text-gray-500 dark:text-white">
        Hiển thị{" "}
        <span className="font-medium">
          {showingFrom}-{showingTo}
        </span>{" "}
        trong số <span className="font-medium">{totalItems}</span> {itemName}
      </p>
      <div className="flex items-center">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          aria-label="Trang trước"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex items-center mx-3 space-x-1">
          {paginationRange.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 px-2 rounded-md shadow-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white border border-blue-600 dark:bg-blue-700"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 hover:dark:bg-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          aria-label="Trang sau"
        >
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
