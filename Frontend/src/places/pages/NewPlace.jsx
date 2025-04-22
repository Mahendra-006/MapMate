import { Input } from "../../sharedComponents/UIElements/Input";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../sharedComponents/validators";
import Button from "../../sharedComponents/UIElements/Button";
import useForm from "../../sharedComponents/hooks/FormHook";
import useHttpHook from "../../sharedComponents/hooks/HttpHook";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../sharedComponents/Context/AuthContext";
import ErrorModal from "../../sharedComponents/UIElements/ErrorModal";
import Spinner from "../../sharedComponents/UIElements/Spinner";
import ImageUpload from "../../sharedComponents/UIElements/ImageUpload";


export default function NewPlace(){
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpHook();

    const [formState, inputHandler] = useForm(
        {
            title:{
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            },
            image: {
                value: null,
                isValid: false
            }
        },
        false
    )
    const navigate = useNavigate();

    async function placeSubmitHandler(e){
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", formState.inputs.title.value);
            formData.append("description", formState.inputs.description.value);
            formData.append("address", formState.inputs.address.value);
            formData.append("image", formState.inputs.image.value);
            await sendRequest( import.meta.env.VITE_BACKEND_URL + '/places', 
                'POST',
                formData,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            )
            navigate('/')
            
        } catch (err) {}
    }

    return <>
        <ErrorModal error={error} onClear={clearError}/>
        <form onSubmit={placeSubmitHandler} className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-2xl">
            {isLoading && <Spinner asOverlay/>}
         <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add a New Place</h2>
        <Input 
            id="title" 
            element="input" 
            type="text" 
            label="Title" 
            errorText="Please input a valid title" 
            validators={[VALIDATOR_REQUIRE()]} 
            placeholder="Title" 
            onInput={inputHandler}/>

        <Input 
            id="description" 
            element="textarea" 
            type="text" 
            label="Description" 
            errorText="Please input a valid description" 
            validators={[VALIDATOR_MINLENGTH(5)]} 
            placeholder="Description" 
            onInput={inputHandler}/>

        <Input 
            id="address" 
            element="input" 
            type="text" 
            label="Address" 
            errorText="Please input a valid Address" 
            validators={[VALIDATOR_REQUIRE()]} 
            placeholder="Address" 
            onInput={inputHandler}/>

        <ImageUpload 
            id="image"
            onInput={inputHandler}
            errorText="Please Provide an Image"/>

        <Button type="submit" disabled={!formState.isValid}>Add Place</ Button>
    </form>
    </>
}