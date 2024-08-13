import { ITEMS_PER_PAGE } from "./../app/constants";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export default function PaginationComponent({ page, handlePage, totalItems }) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  return (
    <>
      <Pagination className="flex justify-end pt-3">
        <PaginationContent>
          <PaginationItem
            onClick={(e) => handlePage(page > 1 ? page - 1 : page)}
          >
            <PaginationPrevious   size="sm" href="#" />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((el, index) => (
            <PaginationItem
              onClick={(e) => handlePage(index + 1)}
              aria-current="page"
            >
              {index + 1 === page ? (
                <PaginationLink size="sm"  isActive> {index + 1}</PaginationLink>
              ) : (
                <PaginationLink size="sm" >  {index + 1}</PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem
            onClick={(e) => handlePage(page < totalPages ? page + 1 : page)}
          >
            <PaginationNext href="#" size="sm"  />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
