import React, { useState } from "react";
import { Card, CardTitle } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { AspectRatio } from "../../components/ui/aspect-ratio";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemFromCartAsync,
  selectItems,
  updateCartAsync,
  selectCartLoaded,
} from "./cartSlice";
import { useToast } from "../../components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { LoaderCircle } from "lucide-react";
// import Modal from "../../components/Common/Modal";

 
const ShoppingCart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const [quantities, setQuantities] = useState(
    items.map((item) => item.quantity)
  );
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const cartLoaded = useSelector(selectCartLoaded);

  const totalAmount = items.reduce(
    (amount, item) => item.product.price * item.quantity + amount,
    0
  );
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const handleQuantityChange = (value, item, index) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
    dispatch(updateCartAsync({ id: item.id, quantity: +value }));
  };

  const handleRemove = (item) => {
    setItemToDelete(item);
    setShowAlertDialog(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      setIsLoading(true);
      try {
        await dispatch(deleteItemFromCartAsync(itemToDelete.id));
        toast({
          title: " Successful",
          description: "item deleted successfully",
        });
      } finally {
        setIsLoading(false);
        setShowAlertDialog(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <>
      {items.length > 0 ? (
        <>
          <div className="flex justify-center items-center mx-4 my-5">
            <Card className="w-full sm:w-[600px] sm:mx-auto px-3 sm:px-4 py-8  ">
              <CardTitle className="text-3xl mb-10 text-center">
                Shopping Cart
              </CardTitle>
              <Separator className="my-3" />
              <div className="flex flex-col space-y-4">
                {items.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-start space-x-4">
                      <div className="w-[50px] sm:w-[150px] mt-1">
                        <AspectRatio
                          ratio={16 / 14}
                          className="bg-muted flex items-center justify-center sm:h-32 h-12"
                        >
                          <img
                            // src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80"
                            src={item.product.thumbnail}
                            className="object-contain w-full h-full py-1"
                            alt={item.name}
                          />
                        </AspectRatio>
                      </div>
                      <div className="flex flex-col w-full">
                        <div className="flex justify-between">
                          <divx>
                            <h2 className="sm:text-lg font-semibold">
                              {item.product.title}
                            </h2>
                            <p className="text-muted-foreground text-sm p-0 m-0">
                              {item.product.brand}
                            </p>
                            <p className="text-muted-foreground text-sm p-0 m-0">
                              {item.product.category}
                            </p>
                          </divx>
                          <p className="sm:text-lg font-semibold hidden sm:inline">
                            {item.product.price}
                          </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-destructive cursor-pointer h-5 w-5 sm:hidden inline"
                            viewBox="0 0 50 50"
                            onClick={() => handleRemove(item)}
                          >
                            <path
                              fill="currentColor"
                              d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17s-7.6 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.7-15-15-15"
                            />
                            <path fill="currentColor" d="M16 24h18v2H16z" />
                          </svg>
                        </div>
                        <div className="flex justify-between mt-4 pt-2">
                          <div className="flex items-center">
                            <Select
                              value={quantities[index]?.toString()}
                              onValueChange={(value) =>
                                handleQuantityChange(value, item, index)
                              }
                            >
                              <SelectTrigger className="w-[70px] sm:w-[110px]">
                                <SelectValue>{quantities[index]}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {[1, 2, 3, 4, 5].map((quantity) => (
                                    <SelectItem
                                      key={quantity}
                                      value={quantity.toString()}
                                    >
                                      {quantity}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          <button
                            onClick={() => handleRemove(item)}
                            className="text-red-500 hidden sm:inline"
                          >
                            Remove
                          </button>
                          <p className="text-md font-semibold inline sm:hidden mt-1">
                            {item.product.price}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-3" />
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3">
                  <p className="text-sm sm:text-lg font-semibold">
                    total items
                  </p>
                  <p className="text-sm sm:text-lg font-semibold">
                    {totalItems}
                  </p>
                </div>
                <div className="flex justify-between items-center my-1">
                  <p className="text-sm sm:text-lg font-semibold">Subtotal</p>
                  <p className="text-sm sm:text-lg font-semibold">
                    {totalAmount}
                  </p>
                </div>
                <Button onClick={() => navigate("/checkout")}>Checkout</Button>
                <NavLink
                  to="/"
                  className="text-blue-500 hover:underline text-center"
                >
                  or Continue Shopping
                  <span>
                    <svg
                      className="inline"
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 256 256"
                    >
                      <path
                        fill="currentColor"
                        d="m218.83 130.83l-72 72a4 4 0 0 1-5.66-5.66L206.34 132H40a4 4 0 0 1 0-8h166.34l-65.17-65.17a4 4 0 0 1 5.66-5.66l72 72a4 4 0 0 1 0 5.66"
                      />
                    </svg>
                  </span>
                </NavLink>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center mx-4 my-5">
          <Card className="w-full sm:w-[600px] sm:mx-auto px-3 sm:px-4 py-8">
            <CardTitle className="sm:text-3xl mb-10 text-center">
              Your Shopping Cart is Empty
            </CardTitle>
            <p className="text-center mb-6">
              It looks like you haven't added anything to your cart yet. Explore
              our products and find something you love.
            </p>
            <NavLink
              to="/"
              className="text-blue-500 hover:underline text-center flex justify-center"
            >
              Start Shopping
              <span>
                <svg
                  className="inline"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="m218.83 130.83l-72 72a4 4 0 0 1-5.66-5.66L206.34 132H40a4 4 0 0 1 0-8h166.34l-65.17-65.17a4 4 0 0 1 5.66-5.66l72 72a4 4 0 0 1 0 5.66"
                  />
                </svg>
              </span>
            </NavLink>
          </Card>
        </div>
      )}
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Item Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item from your cart? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlertDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isLoading}>
              {isLoading && <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ShoppingCart;
