import { FaChevronRight } from "react-icons/fa"; // Icon mũi tên
import { Link } from "react-router-dom";

/**
 * Hiển thị thanh Breadcrumbs
 * @param {Array} crumbs - Một mảng các object: [{ name: 'Trang chủ', path: '/' }, { name: 'Giày', path: null }]
 */
const Breadcrumbs = ({ crumbs }) => {
  if (!crumbs || crumbs.length === 0) {
    return null;
  }

  return (
    <nav className="container mx-auto px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
      <ol className="flex items-center space-x-2">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={index} className="flex items-center">
              {/* Nếu không phải link cuối cùng, nó là một Link */}
              {!isLast && crumb.path ? (
                <Link
                  to={crumb.path}
                  className="hover:text-secondary dark:hover:text-secondary-light"
                >
                  {crumb.name}
                </Link>
              ) : (
                // Link cuối cùng (trang hiện tại) là text thường
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {crumb.name}
                </span>
              )}

              {/* Thêm icon mũi tên nếu không phải là cái cuối */}
              {!isLast && <FaChevronRight className="w-3 h-3 mx-2" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
