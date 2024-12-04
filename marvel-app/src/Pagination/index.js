import React from "react";
import "./pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; // Number of page numbers to show at a time
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="pagination-container">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
            >
                Previous
            </button>

            {generatePageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`pagination-number ${
                        currentPage === page ? "active" : ""
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
