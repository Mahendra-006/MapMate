import { useReducer } from "react";
import { useCallback } from "react";

const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for(const inputId in state.inputs){
                if(!state.inputs[inputId]){
                    continue;
                }
                if(inputId === action.inputId){
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {value: action.value, isValid: action.isValid}
                },
                isValid: formIsValid
            }
        case 'SET_DATA':
            return {
                inputs: action.inputs,
                isValid: action.formIsValid
            }
        default: 
            return state;
    }
}

export default function useForm(iniInputs, iniFormValidity) {
    const [formState, dispatch] = useReducer(formReducer, {
        input: iniInputs,
        isValid: iniFormValidity
    })

    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id
        })
    }, [])

    const setFormData = useCallback((iniInputs, iniFormValidity) => {
        dispatch({
            type: "SET_DATA",
            inputs: iniInputs,
            formIsValid: iniFormValidity
        })
    }, [])

    return [formState, inputHandler, setFormData]
}