import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resetPasswordAsync,
  resetPasswordRequestAsync,
  verifyCodeAsync,
} from "./authSlice";
import { Card, CardContent } from "../../components/ui/card";
// import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import image from "../../assets/images/Big_phone_with_cart.jpg";
import image2 from "../../assets/images/White Modern Minimal E-Commerce Logo.png";
import darkImage from "../../assets/images/White Modern Minimal E-Commerce Logo (1).png";

import { Input } from "reactstrap";
import { useToast } from "../../components/ui/use-toast";
import { LoaderCircle } from "lucide-react";
import ValidationIcon from "../../components/validationIcon";
import { selectedMode } from "../../app/toggleSlice";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setnewPassword] = useState(false);
  const [Password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState("");

  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const { toast } = useToast();
  const themeMode = useSelector(selectedMode);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleInputChange = (index, event) => {
    console.log(index, event);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      email: email,
    };
    if (!email) {
      toast({
        variant: "destructive",
        title: " Uh oh!",
        description: "Enter valid email address",
      });
      setLoading(false);
      setError(true);
      return;
    }
    dispatch(resetPasswordRequestAsync(data))
      .then((response) => {
        if (response?.payload?.message === "Code sent successfully") {
          setAuth(true);
          toast({
            title: " Successful",
            description: "Code sent successfully",
          });
          setError(false);
        } else {
          toast({
            variant: "destructive",
            title: " Uh oh!",
            description: response?.payload?.response?.data?.error,
          });
        }
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      email: email,
      ResetPasswordCode: verificationCode,
    };
    if (!verificationCode) {
      toast({
        variant: "destructive",
        title: " Uh oh!",
        description: "Enter verification code",
      });
      setLoading(false);
      setError(true);
      return;
    }
    dispatch(verifyCodeAsync(data))
      .then((response) => {
        if (response?.payload?.message === "verify code successfully") {
          setnewPassword(true);
          toast({
            title: " Successful",
            description: "verified successfully",
          });
          setError(false);
        } else {
          toast({
            variant: "destructive",
            title: " Uh oh!",
            description: response?.payload?.response?.data?.error,
          });
        }
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCHangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      email: email,
      password: Password,
    };
    if (!Password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: " Uh oh!",
        description: "Enter new password",
      });
      setLoading(false);
      setError(true);
      return;
    } else if (Password.length < 8 || confirmPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 8 characters long",
      });
      setError(true);
      setLoading(false);
      return;
    }
    if (Password !== confirmPassword) {
      toast("Passwords do not match");
      toast({
        variant: "destructive",
        title: " Uh oh!",
        description: "Password do not match",
      });
      setLoading(false);
      return;
    }
    dispatch(resetPasswordAsync(data))
      .then((response) => {
        if (
          response?.payload?.data?.message === "password change successfully"
        ) {
          toast({
            title: " Successful",
            description: "password change successfully",
          });
          setError(false);
          navigate("/login");
        } else {
          toast({
            variant: "destructive",
            title: " Uh oh!",
            description: response?.payload?.response?.data?.error,
          });
        }
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {!newPassword ? (
        <>
          {!auth ? (
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
                            Forgot Password
                          </h1>
                          <p class="text-balance text-muted-foreground">
                            enter your email to continue
                          </p>
                        </div>
                        <form onSubmit={handleSubmit}>
                          <div class="grid gap-4">
                            <div class="grid gap-2">
                              {error && !email ? (
                                <Label class="text-red-600">
                                  Email <ValidationIcon />
                                </Label>
                              ) : (
                                <Label>Email</Label>
                              )}
                              <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                auto-capitalize="none"
                                auto-complete="email"
                                auto-correct="off"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
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
          ) : (
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
                              )}
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
          )}
        </>
      ) : (
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
                        Enter your new password
                      </h1>
                      <p class="text-balance text-muted-foreground">
                        Please enter your new credentials to continue.
                      </p>
                    </div>
                    <form onSubmit={handleCHangePassword}>
                      <div class="grid gap-4">
                        <div class="grid gap-2">
                          {error && Password.length < 8 ? (
                            <Label class="text-red-600">
                              Password <ValidationIcon />
                            </Label>
                          ) : (
                            <Label>Password</Label>
                          )}
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="******"
                              value={Password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <div
                              className="absolute top-1 right-0 h-full rounded flex items-center px-3 cursor-pointer"
                              onClick={toggleShowPassword}
                            >
                              {showPassword ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 32 32"
                                >
                                  <path
                                    fill="currentColor"
                                    d="m5.24 22.51l1.43-1.42A14.06 14.06 0 0 1 3.07 16C5.1 10.93 10.7 7 16 7a12.4 12.4 0 0 1 4 .72l1.55-1.56A14.7 14.7 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68a16 16 0 0 0 4.18 6.17"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="M12 15.73a4 4 0 0 1 3.7-3.7l1.81-1.82a6 6 0 0 0-7.33 7.33zm18.94-.07a16.4 16.4 0 0 0-5.74-7.44L30 3.41L28.59 2L2 28.59L3.41 30l5.1-5.1A15.3 15.3 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M20 16a4 4 0 0 1-6 3.44L19.44 14a4 4 0 0 1 .56 2m-4 9a13.05 13.05 0 0 1-6-1.58l2.54-2.54a6 6 0 0 0 8.35-8.35l2.87-2.87A14.54 14.54 0 0 1 28.93 16C26.9 21.07 21.3 25 16 25"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="h-5 w-5"
                                >
                                  <g fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="3.5" />
                                    <path d="M20.188 10.934c.388.472.582.707.582 1.066c0 .359-.194.594-.582 1.066C18.768 14.79 15.636 18 12 18c-3.636 0-6.768-3.21-8.188-4.934c-.388-.472-.582-.707-.582-1.066c0-.359.194-.594.582-1.066C5.232 9.21 8.364 6 12 6c3.636 0 6.768 3.21 8.188 4.934Z" />
                                  </g>
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                        <div class="grid gap-2">
                          {error && confirmPassword.length < 8 ? (
                            <Label class="text-red-600">
                              Confirm Password <ValidationIcon />
                            </Label>
                          ) : (
                            <Label>Confirm Password</Label>
                          )}

                          <div className="relative">
                            <Input
                              id="password"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="******"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                            <div
                              className="absolute top-1 right-0 h-full rounded flex items-center px-3 cursor-pointer"
                              onClick={toggleShowConfirmPassword}
                            >
                              {showConfirmPassword ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 32 32"
                                >
                                  <path
                                    fill="currentColor"
                                    d="m5.24 22.51l1.43-1.42A14.06 14.06 0 0 1 3.07 16C5.1 10.93 10.7 7 16 7a12.4 12.4 0 0 1 4 .72l1.55-1.56A14.7 14.7 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68a16 16 0 0 0 4.18 6.17"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="M12 15.73a4 4 0 0 1 3.7-3.7l1.81-1.82a6 6 0 0 0-7.33 7.33zm18.94-.07a16.4 16.4 0 0 0-5.74-7.44L30 3.41L28.59 2L2 28.59L3.41 30l5.1-5.1A15.3 15.3 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M20 16a4 4 0 0 1-6 3.44L19.44 14a4 4 0 0 1 .56 2m-4 9a13.05 13.05 0 0 1-6-1.58l2.54-2.54a6 6 0 0 0 8.35-8.35l2.87-2.87A14.54 14.54 0 0 1 28.93 16C26.9 21.07 21.3 25 16 25"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="h-5 w-5"
                                >
                                  <g fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="3.5" />
                                    <path d="M20.188 10.934c.388.472.582.707.582 1.066c0 .359-.194.594-.582 1.066C18.768 14.79 15.636 18 12 18c-3.636 0-6.768-3.21-8.188-4.934c-.388-.472-.582-.707-.582-1.066c0-.359.194-.594.582-1.066C5.232 9.21 8.364 6 12 6c3.636 0 6.768 3.21 8.188 4.934Z" />
                                  </g>
                                </svg>
                              )}
                            </div>
                          </div>
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
      )}
    </>
  );
};

export default ForgetPassword;
