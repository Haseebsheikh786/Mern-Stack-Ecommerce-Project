import { useEffect } from "react";
import { Link, Navigate, NavLink, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetCartAsync } from "../cart/cartSlice";
import { resetOrder } from "./orderSlice";
import { Card } from "../../components/ui/card";

function Order() {
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(resetCartAsync());
    dispatch(resetOrder());
  }, [dispatch]);

  return (
    <>
      {!params.id && <Navigate to="/" replace={true}></Navigate>}
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8 ">
        <Card className="text-center p-4 ">
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white-900">
            Thank you for shopping with us
          </h1>
          <p className="mt-6 text-base leading-7 text-white-600">
            Your Order will be delivered in 3 days
          </p>
          <NavLink
            to="/"
            className="text-blue-500 mt-6 hover:underline text-center flex justify-center"
          >
            Continue Shopping
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
      </main>
    </>
  );
}

export default Order;
