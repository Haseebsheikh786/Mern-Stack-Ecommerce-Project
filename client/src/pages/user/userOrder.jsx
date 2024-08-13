import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLoggedInUserOrderAsync, selectUserOrders } from "./userSlice";
 import { Link, Navigate } from "react-router-dom";
import { selectUserInfo } from "../auth/authSlice";
import { Separator } from "../../components/ui/separator";
import { cn } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
export default function UserOrder() {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(selectUserInfo);

  useEffect(() => {
    const fetchOrder = async () => {
      if (user) {
        setIsLoading(true);
        await dispatch(fetchLoggedInUserOrderAsync(user?._id));
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [dispatch, user]);

  return (
    <>
      <Card className="my-5 mx-4">
        <div className="flex justify-between items-center ">
          <CardHeader>
            <CardTitle> orders</CardTitle>
            <CardDescription> here's a list of all orders</CardDescription>
          </CardHeader>
        </div>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Delivery</TableHead>
                <TableHead>items</TableHead>
                <TableHead>total items</TableHead>
                <TableHead>amount</TableHead>
                <TableHead>address</TableHead>
              </TableRow>
            </TableHeader>
            {isLoading}
            <TableBody>
              {!isLoading &&
                orders?.map((order, index) => (
                  <TableRow>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="flex space-x-2">
                      {order.items.map((item, i) => (
                        <div className=" ">
                          <img
                            src={item.product.thumbnail}
                            // src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80"
                            alt={item.product.thumbnail}
                            className="h-11 w-11 rounded-lg"
                          />
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="">{order.totalItems}</TableCell>
                    <TableCell className="">{order.totalAmount}</TableCell>
                    <TableCell className="">
                      {order.selectedAddress.city},
                      {order.selectedAddress.street},
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {isLoading && (
            <>
              <Skeleton className="h-4 my-5" />
              <Skeleton className="h-4 my-5" />
              <Skeleton className="h-4 my-5" />
              <Skeleton className="h-4 mt-5" />
            </>
          )}
          {!isLoading && orders?.length === 0 && (
            <>
              <p className="text-center mt-4">No data found</p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
