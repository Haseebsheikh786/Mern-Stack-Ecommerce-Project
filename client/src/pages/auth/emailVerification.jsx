import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Input } from "reactstrap";
import { Card, CardContent } from "../../components/ui/card";
// import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import image from "../../assets/images/Big_phone_with_cart.jpg";
import image2 from "../../assets/images/White Modern Minimal E-Commerce Logo.png";
import darkImage from "../../assets/images/White Modern Minimal E-Commerce Logo (1).png";

import { LoaderCircle } from "lucide-react";
import { useToast } from "../../components/ui/use-toast";
import {
  ResendVerificationCodeAsync,
  emailVerificationAsync,
  selectUserInfo,
  selectloginUser,
} from "./authSlice";
import ValidationIcon from "../../components/validationIcon";
import { selectedMode } from "../../app/toggleSlice";

const EmailVerification = () => {
  const user = useSelector(selectUserInfo);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const themeMode = useSelector(selectedMode);

  const dispatch = useDispatch();
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const handleInputChange = (index, event) => {
    const input = event.target;
    const maxLength = parseInt(input.getAttribute("maxlength"));
    const currentLength = input.value.length;

    if (currentLength >= maxLength) {
      if (index < inputRefs.length - 1) {
        inputRefs[index + 1].current.focus();
      }
    }
    if (
      currentLength === 0 &&
      event.nativeEvent.inputType === "deleteContentBackward"
    ) {
      if (index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }
    const newVerificationCode = inputRefs
      .map((ref) => ref.current.value)
      .join("");
    setVerificationCode(newVerificationCode);
  };
  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    const obj = {
      email: email,
      verificationCode: verificationCode,
    };

    if (!verificationCode) {
      toast({
        variant: "destructive",
        title: " Uh oh!",
        description: "Enter verification code",
      });
      setError(true);
      setLoading(false);
      return;
    }

    const response = await dispatch(emailVerificationAsync(obj));
    if (
      response.payload?.response?.data?.error === "Invalid verification code"
    ) {
      toast({
        variant: "destructive",
        title: " Uh oh!",
        description: "Invalid verification code",
      });
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const ResendCode = () => {
    setLoading(true);

    const obj = {
      email: email,
    };

    dispatch(ResendVerificationCodeAsync(obj))
      .then(() => {
        toast({
          title: "Successful",
          description: "Code sent successfully",
        });
        setLoading(false);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: " Uh oh!",
          description: "something went wrong",
        });
        setLoading(false);
      });
  };
  return (
    <>
      {user && <Navigate to="/" replace={true}></Navigate>}
      <div class="relative">
        <div class="hidden lg:block relative lg:fixed w-full lg:w-5/12 min-h-screen inset-0">
          <img
            src={image}
            alt="Image"
            class="lg:h-full xl:h-full 2xl:h-full w-full object-cover  "
          />
        </div>
        <div class="flex flex-col items-center justify-center lg:h-screen mx-3 ">
          <div class="lg:hidden flex flex-col justify-end items-center">
            {themeMode ? (
              <img src={image2} alt="logo" class="h-32 w-32" />
            ) : (
              <img src={darkImage} alt="logo" class="h-32 w-32" />
            )}{" "}
          </div>
          <div class="flex items-center justify-center w-full lg:w-7/12 ml-auto">
            <Card className="">
              <CardContent class="p-8">
                <div class="mx-auto grid sm:w-[350px] gap-6">
                  <div class="grid gap-2 text-center">
                    <h1 class="text-3xl font-semibold tracking-tight">
                      Verification
                    </h1>
                    <p class="text-balance text-muted-foreground">
                      Please enter the code sent to your email address.
                    </p>
                  </div>
                  <form onSubmit={handleVerification}>
                    <div class="grid gap-4">
                      <div class="grid gap-2">
                        {error && !verificationCode ? (
                          <Label class="text-red-600">
                            Verification Code <ValidationIcon />
                          </Label>
                        ) : (
                          <Label>Verification Code</Label>
                        )}{" "}
                        <div className="d-flex">
                          {[0, 1, 2, 3].map((index) => (
                            <Input
                              key={index}
                              className="w-25 mx-1"
                              type="text"
                              name={`code${index + 1}`}
                              id={`code${index + 1}`}
                              maxLength="1"
                              innerRef={inputRefs[index]}
                              onChange={(event) =>
                                handleInputChange(index, event)
                              }
                            />
                          ))}
                        </div>
                        <a
                          onClick={ResendCode}
                          className="text-danger cursor-pointer"
                        >
                          Resend Code
                        </a>
                      </div>
                      <Button disabled={loading}>
                        {loading && (
                          <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
                        )}
                        submit
                      </Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerification;
