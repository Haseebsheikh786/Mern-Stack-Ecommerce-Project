import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByIdAsync, selectProductById } from "./productSlice";
import { addToCartAsync, selectItems } from "../cart/cartSlice";
import { useParams } from "react-router-dom";
import { CardTitle, Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useMediaQuery } from "react-responsive";

import { useToast } from "../../components/ui/use-toast";
import { Skeleton } from "../../components/ui/skeleton";
const colors = [
  { name: "black", bgColor: "bg-black" },
  { name: "white", bgColor: "bg-white" },
  { name: "blue", bgColor: "bg-primary" },
  // Add more colors as needed
];
const ProductDetail = () => {
  const product = useSelector(selectProductById);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const params = useParams();
  const items = useSelector(selectItems);
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const [memory, setMemory] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMemory = (value) => {
    setMemory(value);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color.name);
  };

  const handleCart = (e) => {
    e.preventDefault();
    if (items.findIndex((item) => item.product.id === product.id) < 0) {
      const newItem = {
        product: product.id,
        quantity: 1,
        color: selectedColor,
        memory: memory,
      };
      dispatch(addToCartAsync({ item: newItem }));
      toast({
        title: " Successful",
        description: "item added successfully",
      });
    } else {
      toast({
        variant: "destructive",
        title: " Uh oh!",
        description: "item already added ",
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        await dispatch(fetchProductByIdAsync(params.id));
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, params.id]);

  return (
    <div>
      {loading ? (
        <div class="grid sm:grid-cols-2 sm:space-x-5 my-5 mx-4">
          <div className="hidden sm:inline-block">
            <Skeleton className="h-screen w-auto rounded-lg" />
          </div>
          <div>
            {/* Title and price placeholders */}
            <div className="flex justify-between items-center space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[50px]" />
            </div>

            {/* Color options placeholder */}
            <div className="flex items-center mt-2 space-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>

            {/* Memory options placeholder */}
            <div className="flex items-center space-x-2 mt-3">
              <Skeleton className="h-4 w-[40px]" />
              <Skeleton className="h-4 w-[40px]" />
              <Skeleton className="h-4 w-[40px]" />
              <Skeleton className="h-4 w-[40px]" />
            </div>

            {/* Add to cart button placeholder */}
            <Skeleton className="h-8 w-full rounded-md mt-3" />

            {/* Description placeholder */}
            <Skeleton className="h-10 w-full rounded-lg mt-3" />
          </div>
        </div>
      ) : (
        product && (
          <Card class=" my-5 sm:mx-4">
            <div class="flex flex-col lg:flex-row">
              <div class="w-full lg:w-1/2 px-4 hidden lg:flex">
                <img
                  src={product.thumbnail}
                  alt="Basic Tee"
                  class="w-full h-auto rounded-lg shadow-lg  "
                />
              </div>

              <div class="w-full lg:w-1/2 px-4">
                <div class="flex justify-between items-center">
                  <CardTitle class=" sm:text-xl">{product.title}</CardTitle>
                  <CardTitle class="sm:text-xl ">{product.price}</CardTitle>
                </div>

                <div class="w-full pt-7 pb-2 flex lg:hidden">
                  <img
                    // src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80"
                    src={product.thumbnail}
                    alt="Basic Tee"
                    class="w-full h-auto rounded-lg shadow-lg  "
                  />
                </div>

                <div className="my-6">
                  <span className="font-semibold">Color:</span>
                  <div className="flex items-center mt-2">
                    {colors.map((color) => (
                      <span
                        key={color.name}
                        className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                          color.bgColor
                        } ${
                          selectedColor === color.name
                            ? "border-red-600 w-12 h-12"
                            : ""
                        } mr-2`}
                        onClick={() => handleColorClick(color)}
                      ></span>
                    ))}
                  </div>
                </div>
                <div class="my-6">
                  <span class="font-semibold">Memory</span>
                  <div className="flex items-center space-x-2 mt-2">
                    {["32", "64", "128", "512"].map((value) => (
                      <Button
                        key={value}
                        size={isSmallScreen ? "sm" : "default"}
                        variant={memory === value ? "default" : "outline"}
                        onClick={() => handleMemory(value)}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button className="min-w-full" onClick={handleCart}>
                  Add to cart
                </Button>
                <div class="mt-3">
                  <p class="">{product.description}</p>
                </div>
              </div>
            </div>
          </Card>
        )
      )}
    </div>
  );
};

export default ProductDetail;
