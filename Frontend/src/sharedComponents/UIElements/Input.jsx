import { useReducer, useEffect } from "react";
import { validate } from "../validators";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };

    case 'TOUCH':
        return {
            ...state,
            isTouched:true
        }
    default:
      return state;
  }
};

export function Input(props) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || "",
    isTouched: false,
    isValid: props.valid || false
  });

  const {id, onInput} = props;
  const {value, isValid} = inputState;

  useEffect(() => {
    props.onInput(id, value, isValid)
  },[id, onInput, value, isValid])

  const onChangeHandler = (e) => {
    dispatch({ type: "CHANGE", val: e.target.value , validators:props.validators});
  };

  const touchHandler = () => {
    dispatch({
        type:"TOUCH"
    })
  }

  const baseInputStyles =
    "w-full p-3 rounded-md border outline-none focus:ring-2 transition";
    const inputStyles = (!inputState.isValid && inputState.isTouched)
    ? `${baseInputStyles} border-red-500 focus:ring-red-400`
    : `${baseInputStyles} border-gray-300 focus:ring-blue-400`;
  

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={onChangeHandler}
        value={inputState.value}
        onBlur={touchHandler}
        className={inputStyles}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={onChangeHandler}
        value={inputState.value}
        placeholder={props.placeholder}
        onBlur={touchHandler}
        className={inputStyles}
      />
    );

  return (
    <div className="mb-6">
      <label
        htmlFor={props.id}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      {element}
      {!inputState.isValid && inputState.isTouched && (
        <p className="text-sm text-red-500 mt-1">{props.errorText}</p>
      )}
    </div>
  );
}
