import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { login, register, selectloginUser } from "./authSlice";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import image from "../../assets/images/Big_phone_with_cart.jpg";
import image2 from "../../assets/images/White Modern Minimal E-Commerce Logo.png";
import darkImage from "../../assets/images/White Modern Minimal E-Commerce Logo (1).png";
import { LoaderCircle } from "lucide-react";
import { useToast } from "../../components/ui/use-toast";
import ValidationIcon from "../../components/validationIcon";
import { selectedMode } from "../../app/toggleSlice";
const AuthPage = ({}) => {
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const themeMode = useSelector(selectedMode);

  const { toast } = useToast();

  const user = useSelector(selectloginUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current location

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleAdminClick = async () => {
    const obj = {
      email: "admin@gmail.com",
      password: "1",
    };
    setLoading(true);
    await dispatch(login(obj));
    setLoading(false);
  };

  const handleUserClick = async () => {
    const obj = {
      email: "user@gmail.com",
      password: "1",
    };
    setLoading(true);
    await dispatch(login(obj));
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setLoading(true);

    if (auth) {
      const obj = {
        email,
        password,
        userName,
      };
      if (!email || !password || !userName) {
        toast({
          variant: "destructive",
          title: "Uh oh!",
          description: "All fields are required",
        });
        setError(true);
        setLoading(false);
        return;
      } else if (password.length < 8) {
        toast({
          variant: "destructive",
          title: "Weak Password",
          description: "Password must be at least 8 characters long",
        });
        setError(true);
        setLoading(false);
        return;
      }
      try {
        const response = await dispatch(register(obj));
        if (response?.payload === "User already registered") {
          toast({
            variant: "destructive",
            title: " Uh oh!",
            description: "User already registered",
          });
        } else {
          navigate(`/verify-email?email=${email}`);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: " Uh oh!",
          description: "Something went wrong",
        });
      }
      setLoading(false);
    } else {
      const obj = {
        email: email,
        password: password,
      };
      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Uh oh!",
          description: "All fields are required",
        });
        setError(true);
        setLoading(false);
        return;
      } else if (password.length < 8) {
        toast({
          variant: "destructive",
          title: "Weak Password",
          description: "Password must be at least 8 characters long",
        });
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await dispatch(login(obj));
        if (response?.payload === "User is not verified") {
          toast({
            variant: "destructive",
            title: " Uh oh!",
            description: "User is not verified",
          });
          navigate(`/verify-email?email=${email}`);
          setError(false);
        } else {
          if (location.state && location.state.from) {
            navigate(location.state.from);
          } else if (
            response.error.message === "Request failed with status code 400"
          ) {
            toast({
              variant: "destructive",
              title: " Uh oh!",
              description: "Email or password is not valid",
            });
          }
        }
       
      } catch (error) {}
      setLoading(false);
    }
  };

  return (
    <>
      {user?.Isverified && <Navigate to="/" replace={true}></Navigate>}
      <div class="relative">
        <div class="hidden lg:block relative lg:fixed w-full lg:w-5/12 min-h-screen inset-0">
          <img
            src={image}
            alt="Image"
            class="lg:h-full xl:h-full 2xl:h-full w-full object-cover  "
          />
        </div>
        <div class="flex flex-col items-center justify-center min-h-screen mx-3 xl:my-0 my-4 ">
          <div class="lg:hidden flex flex-col justify-end items-center mt-3">
            {themeMode ? (
              <img src={image2} alt="logo" class="h-32 w-32" />
            ) : (
              <img src={darkImage} alt="logo" class="h-32 w-32" />
            )}
          </div>
          <div class="flex items-center justify-center w-full lg:w-7/12 ml-auto">
            <Card className="">
              <CardContent class="p-8">
                <div class="mx-auto grid sm:w-[350px] gap-6">
                  <div class="grid gap-2 text-center">
                    <h1 class="text-3xl font-semibold tracking-tight">
                      {!auth ? "login to your account" : "Create new account"}
                    </h1>
                    <p class="text-balance text-muted-foreground">
                      enter your credentials to {auth ? "signup" : "login"}
                    </p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div class="grid gap-4">
                      <div className="grid grid-cols-2 gap-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAdminClick}
                          disabled={loading}
                        >
                          Admin
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={loading}
                          onClick={handleUserClick}
                        >
                          User
                        </Button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>
                      {auth && (
                        <div class="grid gap-2">
                          {error && !userName ? (
                            <Label class="text-red-600">
                              Username <ValidationIcon />
                            </Label>
                          ) : (
                            <Label>Username</Label>
                          )}
                          <Input
                            id="name"
                            placeholder="username"
                            type="text"
                            auto-capitalize="none"
                            auto-complete="email"
                            auto-correct="off"
                            value={userName}
                            onChange={(e) => setuserName(e.target.value)}
                          />
                        </div>
                      )}
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

                      <div className="grid gap-2 relative">
                        {error && password.length < 8 ? (
                          <Label className="text-red-600">
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
                            value={password}
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
                        {!auth && (
                          <NavLink
                            className="text-danger"
                            to="/forgot-password"
                          >
                            Forgot Password?
                          </NavLink>
                        )}
                      </div>

                      {!auth && (
                        <div class="">
                          <Label for="remember">
                            <input
                              type="checkbox"
                              id="remember"
                              name="remember"
                              v-model="remember"
                            />
                            <span class="ml-1"> remember me </span>
                          </Label>
                        </div>
                      )}
                      <Button disabled={loading}>
                        {loading && (
                          <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
                        )}
                        submit
                      </Button>
                    </div>
                  </form>
                  {!auth ? (
                    <p className="text-center  ">
                      don't have an account?{" "}
                      <span
                        className="text-danger cursor-pointer"
                        onClick={() => {
                          setAuth(true);
                          setError(false);
                          setEmail("");
                          setuserName("");
                          setPassword("");
                        }}
                      >
                        Sign Up
                      </span>
                    </p>
                  ) : (
                    <p className="text-center">
                      Already have an account?{" "}
                      <span
                        className="text-danger cursor-pointer"
                        onClick={() => {
                          setAuth(false);
                          setError(false);
                          setEmail("");
                          setuserName("");
                          setPassword("");
                        }}
                      >
                        {" "}
                        Login
                      </span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
