import { useContext, useState } from "react";
import useForm from "../../sharedComponents/hooks/FormHook";
import Button from "../../sharedComponents/UIElements/Button";
import Card from "../../sharedComponents/UIElements/Card";
import { Input } from "../../sharedComponents/UIElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../sharedComponents/validators";
import { AuthContext } from "../../sharedComponents/Context/AuthContext";
import Spinner from "../../sharedComponents/UIElements/Spinner";
import ErrorModal from "../../sharedComponents/UIElements/ErrorModal";
import useHttpHook from "../../sharedComponents/hooks/HttpHook";
import ImageUpload from "../../sharedComponents/UIElements/ImageUpload";

export default function Auth() {
  const auth = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  const authSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
  
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL+ "/users/signup",
          "POST",
          formData 
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };
  

  const switchModeHandler = () => {
    if (!isLogin) {
      const { name, ...restInputs } = formState.inputs;
      setFormData(restInputs, restInputs.email.isValid && restInputs.password.isValid);
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: { value: "", isValid: false },
          image: {value: null, isValid: false}
        },
        false
      );
    }
    setIsLogin((prevMode) => !prevMode);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <div className="max-w-md mx-auto px-4 mt-24">
        <Card className="bg-white p-8 shadow-xl relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center rounded-xl z-10">
              <Spinner />
            </div>
          )}

          <form onSubmit={authSubmitHandler} className="relative z-0">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
              {isLogin ? "Login" : "Create an Account"}
            </h2>

            {!isLogin && (
              <Input
                id="name"
                element="input"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a name"
                onInput={inputHandler}
              />
            )}

            {!isLogin && (
              <ImageUpload id="image" onInput={inputHandler} errorText="Please Provide an Image"/>
            )}

            <Input
              id="email"
              element="input"
              type="email"
              label="Email"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid Email Address"
              onInput={inputHandler}
            />

            <Input
              id="password"
              element="input"
              type="password"
              label="Password"
              validators={[VALIDATOR_MINLENGTH(8)]}
              errorText="Please enter a valid Password"
              onInput={inputHandler}
            />

            <Button
              type="submit"
              disabled={!formState.isValid}
              className="w-full mt-6"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              onClick={switchModeHandler}
              variant="ghost"
              className="mt-2 text-blue-600 hover:underline"
            >
              Switch to {isLogin ? "Sign Up" : "Login"}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
