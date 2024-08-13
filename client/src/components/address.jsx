import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { GetLoginUserAsync, selectUserInfo } from "../pages/auth/authSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAsync } from "../pages/auth/authSlice";
import { useToast } from "./ui/use-toast";
import ValidationIcon from "./validationIcon";

export function Address({
  showDialog,
  setShowDialog,
  editAbleData,
  setEditAbleData,
  index,
  setIndex,
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const userInfo = useSelector(selectUserInfo);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState(false);

  const handleAdd = () => {
    if (!name || !email || !phone || !city || !street || !zip) {
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: "All fields are required",
      });
      setError(true);
      return;
    }
    const address = {
      name: name,
      email: email,
      phone: phone,
      city: city,
      street: street,
      zip: zip,
    };
    if (editAbleData?.name) {
      const newUser = { ...userInfo, addresses: [...userInfo.addresses] };
      newUser.addresses.splice(index, 1, address);
      dispatch(updateUserAsync(newUser));
      closeDialog();
      setIndex(null);
      toast({
        title: " Successful",
        description: "address updated successfully",
      });
    } else {
      const newUser = {
        ...userInfo,
        addresses: [...userInfo.addresses, address],
      };
      toast({
        title: " Successful",
        description: "address added successfully",
      });
      dispatch(updateUserAsync(newUser));
      closeDialog();
    }
  };

  const closeDialog = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCity("");
    setStreet("");
    setZip("");
    setShowDialog(false);
    setError(false);
    if (editAbleData?.name) {
      setEditAbleData({});
    }
  };

  useEffect(() => {
    if (editAbleData) {
      setName(editAbleData.name || "");
      setEmail(editAbleData.email || "");
      setPhone(editAbleData.phone || "");
      setCity(editAbleData.city || "");
      setStreet(editAbleData.street || "");
      setZip(editAbleData.zip || "");
    }
  }, [editAbleData]);

  return (
    <>
      <Dialog open={showDialog} onOpenChange={closeDialog}>
        <form onSubmit={handleAdd}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              {editAbleData?.name ? (
                <DialogTitle>Edit Address</DialogTitle>
              ) : (
                <DialogTitle>Create New Address</DialogTitle>
              )}
              <DialogDescription>Kindly Fill All the details</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-2  ">
              <div className="space-y-1">
                {error && !name ? (
                  <Label class="text-red-600">
                    Name <ValidationIcon />
                  </Label>
                ) : (
                  <Label>Name</Label>
                )}
                <Input
                  id="name"
                  placeholder="name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                {error && !email ? (
                  <Label class="text-red-600">
                    Email <ValidationIcon />
                  </Label>
                ) : (
                  <Label>Email</Label>
                )}
                <Input
                  type="email"
                  id="email"
                  placeholder="email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                {error && !phone ? (
                  <Label class="text-red-600">
                    Phone <ValidationIcon />
                  </Label>
                ) : (
                  <Label>Phone</Label>
                )}

                <Input
                  id="phone"
                  type="number"
                  placeholder="phone..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                {error && !city ? (
                  <Label class="text-red-600">
                    City <ValidationIcon />
                  </Label>
                ) : (
                  <Label>City</Label>
                )}
                <Input
                  id="city"
                  placeholder="city..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                {error && !street ? (
                  <Label class="text-red-600">
                    Street <ValidationIcon />
                  </Label>
                ) : (
                  <Label>Street</Label>
                )}
                <Input
                  id="street"
                  placeholder="street..."
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                {error && !zip ? (
                  <Label class="text-red-600">
                    Zip <ValidationIcon />
                  </Label>
                ) : (
                  <Label>Zip</Label>
                )}
                <Input
                  id="zip"
                  type="number"
                  placeholder="zip..."
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Close
              </Button>
              <Button type="submit" onClick={handleAdd}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
