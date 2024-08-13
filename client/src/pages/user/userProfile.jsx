import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  GetLoginUserAsync,
  selectUserInfo,
  updateUserAsync,
} from "../auth/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";

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

import { useToast } from "../../components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Address } from "../../components/address";
export default function UserProfile() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const userInfo = useSelector(selectUserInfo);
  const [showDialog, setShowDialog] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editAbleData, setEditAbleData] = useState({});

  const handleRemove = (item) => {
    setItemToDelete(item);
    setShowAlertDialog(true);
  };
  const editHandler = (item, index) => {
    setItemToDelete(index);
    setEditAbleData(item);
    setShowDialog(true);
  };

  const confirmDelete = async () => {
    const newUser = { ...userInfo, addresses: [...userInfo.addresses] }; // for shallow copy issue
    newUser.addresses.splice(itemToDelete, 1);
    await dispatch(updateUserAsync(newUser));
    try {
      toast({
        title: " Successful",
        description: "address deleted successfully",
      });
    } finally {
      setIsLoading(false);
      setShowAlertDialog(false);
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (userInfo) {
        setIsLoading(true);
        await dispatch(GetLoginUserAsync());
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [dispatch, updateUserAsync]);
  return (
    <>
      <Card className="my-5 mx-4">
        <div className="sm:flex justify-between items-center ">
          <CardHeader>
            <CardTitle>{userInfo?.userName}</CardTitle>
            <CardDescription>{userInfo?.email}</CardDescription>
          </CardHeader>
          <div className="text-end mb-3 sm:mb-0 sm:mt-3">
            <Button
              className="mx-4"
              size="sm"
              onClick={() => setShowDialog(true)}
            >
              Add Address
            </Button>
          </div>
        </div>
       
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Street</TableHead>
                <TableHead>City</TableHead>
                <TableHead>zip</TableHead>
                <TableHead>options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                userInfo?.addresses.map((address, index) => (
                  <TableRow>
                    <TableCell className="">{address.name}</TableCell>
                    <TableCell className="">{address.email}</TableCell>
                    <TableCell className="">{address.phone}</TableCell>
                    <TableCell className="">{address.city}</TableCell>
                    <TableCell className="">{address.street}</TableCell>
                    <TableCell className="">{address.zip}</TableCell>
                    <TableCell class="border-b cursor-pointer px-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <div class="cursor-pointer">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-36">
                          <DropdownMenuItem
                            onClick={() => editHandler(address, index)}
                            class="cursor-pointer hover:bg-muted  p-2 border-b"
                          >
                            <button
                              class="flex space-x-1 items-center"
                              v-if="permissions.includes('edit_cottages')"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-4 h-4 mt-1"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                />
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                              </svg>
                              <span>edit </span>
                            </button>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            class="cursor-pointer hover:bg-muted p-2"
                            onClick={() => handleRemove(index)}
                          >
                            <button class="flex space-x-1 text-destructive  ">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-4 h-4 mt-1"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                              <span> delete</span>
                            </button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {userInfo?.addresses.length === 0 && (
            <>
              <p className="text-center mt-4">No data found</p>
            </>
          )}
        </CardContent>
      </Card>
      <Address
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        editAbleData={editAbleData}
        setEditAbleData={setEditAbleData}
        index={itemToDelete}
        setIndex={setItemToDelete}
      />
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Address Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address from your profile?
              This action cannot be undone.
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
}
