import { Separator } from "../../components/ui/separator";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "../../components/ui/sheet";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProductsByFiltersAsync,
  fetchBrandsAsync,
  selectAllProducts,
  selectTotalItems,
  selectBrands,
} from "./productSlice";
import { ITEMS_PER_PAGE } from "../../app/constants";
import PaginationComponent from "../../components/pagination";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { selectDeferredPrompt, setDeferredPrompt } from "../../app/pwaSlice";
import { useToast } from "../../components/ui/use-toast";

const priceRanges = [
  { label: "Below Rs. 15,000", minPrice: 0, maxPrice: 15000 },
  { label: "Rs. 15,000 - Rs. 25,000", minPrice: 15000, maxPrice: 25000 },
  { label: "Rs. 25,000 - Rs. 40,000", minPrice: 25000, maxPrice: 40000 },
  { label: "Rs. 40,000 - Rs. 60,000", minPrice: 40000, maxPrice: 60000 },
  { label: "Rs. 60,000 - Rs. 80,000", minPrice: 60000, maxPrice: 80000 },
  { label: "Rs. 80,000 - Rs. 100,000", minPrice: 80000, maxPrice: 100000 },
  { label: "Above 150,000", minPrice: 150000, maxPrice: Infinity },
];

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const deferredPrompt = useSelector(selectDeferredPrompt);
  const { toast } = useToast();

  const brands = useSelector(selectBrands);
  const totalItems = useSelector(selectTotalItems);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedPriceRange, setSelectedPriceRange] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);

  const [sortOptions, setSortOptions] = useState([
    { name: "Price: Low to High", sort: "price", order: "asc", current: false },
    {
      name: "Price: High to Low",
      sort: "price",
      order: "desc",
      current: false,
    },
  ]);

  const handleFilter = (brand) => {
    const newFilter = { ...filter };

    // Check if the brand is currently selected
    const isSelected = newFilter.brand?.includes(brand.value);

    if (isSelected) {
      // If it's selected, deselect it
      newFilter.brand = newFilter.brand.filter(
        (value) => value !== brand.value
      );
      if (newFilter.brand.length === 0) {
        delete newFilter.brand;
      }
    } else {
      // Otherwise, select it
      newFilter.brand = [...(newFilter.brand || []), brand.value];
    }

    setFilter(newFilter);
  };

  const handleSort = (selectedOption) => {
    // Check if the clicked option is already selected
    const isCurrentlySelected = selectedOption.current;

    // Update the sort state and options
    if (isCurrentlySelected) {
      // If it's currently selected, deselect it
      setSort({});
      setSortOptions(
        sortOptions.map((option) => ({
          ...option,
          current: false,
        }))
      );
    } else {
      // Otherwise, select the new option
      const newSort = {
        _sort: selectedOption.sort,
        _order: selectedOption.order,
      };
      setSort(newSort);
      setSortOptions(
        sortOptions.map((option) => ({
          ...option,
          current: option.name === selectedOption.name,
        }))
      );
    }
  };
  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange((prev) =>
      prev.minPrice === range.minPrice && prev.maxPrice === range.maxPrice
        ? {}
        : { minPrice: range.minPrice, maxPrice: range.maxPrice }
    );
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const install = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        dispatch(setDeferredPrompt(null)); // Clear the prompt after use
      });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
      await dispatch(
        fetchProductsByFiltersAsync({
          filter,
          sort,
          pagination,
          search,
          selectedPriceRange,
        })
      );
      setIsLoading(false);
    };
    scrollToTop();

    fetchProducts();
  }, [dispatch, filter, sort, page, search, selectedPriceRange]);

  useEffect(() => {
    setPage(1);
  }, [totalItems, sort]);

  useEffect(() => {
    if (deferredPrompt) {
      toast({
        title: "Download E-Shop Application",
        description:
          "Download the E-Shop application to streamline your experience.",
        action: <button onClick={install}>Install</button>,
      });
    }
  }, [deferredPrompt]);
  useEffect(() => {
    dispatch(fetchBrandsAsync());
  }, []);

  return (
    <>
      <div className=" my-5 mx-4">
        <div className="">
          <div className="grid lg:grid-cols-5">
            <div className="border shadow py-6 hidden lg:block">
              <FilterComponent
                handleFilter={handleFilter}
                brands={brands}
                filter={filter}
                sort={sort}
                handleSort={handleSort}
                sortOptions={sortOptions}
                search={search}
                setSearch={setSearch}
                selectedPriceRange={selectedPriceRange}
                handlePriceRangeChange={handlePriceRangeChange}
                isLoading={isLoading}
              />
            </div>
            <div className="border shadow lg:ml-4 lg:col-span-4 border-l">
              <div className=" px-4 pt-4 pb-4 lg:px-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Mobile Phones
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Top picks for you. Updated daily.
                    </p>
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        class="block lg:hidden"
                        variant="outline"
                        size="sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.5em"
                          height="1.5em"
                          viewBox="0 0 32 32"
                        >
                          <path
                            fill="currentColor"
                            d="M18 28h-4a2 2 0 0 1-2-2v-7.59L4.59 11A2 2 0 0 1 4 9.59V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v3.59a2 2 0 0 1-.59 1.41L20 18.41V26a2 2 0 0 1-2 2M6 6v3.59l8 8V26h4v-8.41l8-8V6Z"
                          />
                        </svg>
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <FilterComponent
                        handleFilter={handleFilter}
                        brands={brands}
                        filter={filter}
                        sort={sort}
                        handleSort={handleSort}
                        sortOptions={sortOptions}
                        search={search}
                        setSearch={setSearch}
                        selectedPriceRange={selectedPriceRange}
                        handlePriceRangeChange={handlePriceRangeChange}
                        isLoading={isLoading}
                      />

                      <SheetFooter>
                        <SheetClose asChild>
                          {/* <Button type="submit">Close</Button> */}
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>
                <Separator className="mb-4 mt-3" />
                {!isLoading ? (
                  products.length > 0 ? (
                    <div ref={scrollAreaRef} className="relative">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                        {products.map((album) => (
                          <Link
                            key={album.id}
                            to={`product-detail/${album.id}`}
                            className="space-y-3 sm:border sm:p-4"
                          >
                            <div className="rounded-md overflow-hidden aspect-square">
                              <img
                                src={album.thumbnail}
                                alt={album.name}
                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                            <div className="space-y-1 text-xs sm:text-md pt-2">
                              <h3 className="font-medium leading-none truncate">
                                {album.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {album.price}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <PaginationComponent
                        totalItems={totalItems}
                        page={page}
                        handlePage={handlePage}
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      No results to display
                    </div>
                  )
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="space-y-3 animate-pulse ">
                        <div className="rounded-md bg-gray-200 h-44"></div>
                        <div className="space-y-1 text-sm">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;

const FilterComponent = ({
  handleFilter,
  brands,
  filter,
  handleSort,
  sortOptions,
  search,
  setSearch,
  selectedPriceRange,
  handlePriceRangeChange,
  isLoading,
}) => {
  const [showSorting, setShowSorting] = useState(true);
  const [showPriceRange, setShowPriceRange] = useState(true);
  const [showBrands, setShowBrands] = useState(true);
  return (
    <div className="sm:h-full h-screen overflow-auto">
      <div className="px-7 relative">
        <div className="flex justify-between items-center cursor-pointer">
          <h2 className="text-lg font-semibold tracking-tight">Search</h2>
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="mt-2  "
          placeholder="search product....."
        />
        {isLoading && (
          <LoaderCircle class="absolute top-12 right-10 h-4 w-4 animate-spin" />
        )}
      </div>

      <Separator className="my-4" />
      <div className="px-7">
        <div
          onClick={() => setShowSorting(!showSorting)}
          className="flex justify-between items-center cursor-pointer"
        >
          <h2 className="text-lg font-semibold tracking-tight">Sorting</h2>
          {showSorting ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 1024 1024"
            >
              <path
                fill="currentColor"
                d="m488.832 344.32l-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872l319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m7 10l5 5l5-5"
              />
            </svg>
          )}
        </div>
        <div
          className={`transition-all duration-200 ease-in-out ${
            showSorting
              ? "max-h-40 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          {sortOptions.map((option, index) => (
            <div
              key={index}
              className="my-2 flex items-center space-x-2 cursor-default"
              onClick={() => handleSort(option)}
            >
              <input
                type="checkbox"
                checked={option.current}
                readOnly
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm">{option.name}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />
      <div className="px-7">
        <div
          onClick={() => setShowPriceRange(!showPriceRange)}
          className="flex justify-between items-center cursor-pointer"
        >
          <h2 className="text-lg font-semibold tracking-tight">PRICE RANGE</h2>
          {showPriceRange ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 1024 1024"
            >
              <path
                fill="currentColor"
                d="m488.832 344.32l-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872l319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m7 10l5 5l5-5"
              />
            </svg>
          )}
        </div>
        <div
          className={`transition-all duration-200 ease-in-out ${
            showPriceRange
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          {priceRanges.map((range, index) => (
            <div
              key={index}
              className="my-2 flex items-center space-x-2 cursor-default"
              onClick={() => handlePriceRangeChange(range)}
            >
              <input
                type="checkbox"
                checked={
                  selectedPriceRange &&
                  selectedPriceRange.minPrice === range.minPrice &&
                  selectedPriceRange.maxPrice === range.maxPrice
                }
                readOnly
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm">{range.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />
      <div className="px-7">
        <div
          onClick={() => setShowBrands(!showBrands)}
          className="flex justify-between items-center cursor-pointer"
        >
          <h2 className="text-lg font-semibold tracking-tight">Brands</h2>
          {showBrands ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 1024 1024"
            >
              <path
                fill="currentColor"
                d="m488.832 344.32l-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872l319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m7 10l5 5l5-5"
              />
            </svg>
          )}
        </div>
        {brands.map((brand, index) => (
          <div
            key={index}
            className={`transition-all duration-200 ease-in-out ${
              showBrands
                ? "max-h-40 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div
              className="my-2 flex items-center space-x-2 cursor-default"
              onClick={() => handleFilter(brand)}
            >
              <input
                type="checkbox"
                checked={filter.brand?.includes(brand.value) || false}
                readOnly
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm">{brand.label}</span>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />
    </div>
  );
};
