import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '../../sharedComponents/UIElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../sharedComponents/validators';
import Button from '../../sharedComponents/UIElements/Button';
import useForm from '../../sharedComponents/hooks/FormHook';
import { useContext, useEffect, useState } from 'react';
import useHttpHook from '../../sharedComponents/hooks/HttpHook';
import Spinner from '../../sharedComponents/UIElements/Spinner';
import ErrorModal from '../../sharedComponents/UIElements/ErrorModal';
import { AuthContext } from '../../sharedComponents/Context/AuthContext';

export default function UpdatePlace(){
    const auth = useContext(AuthContext)
    const {isLoading, error, sendRequest, clearError} = useHttpHook()
    const [loadedPlace, setLoadedPlace] = useState()
    const { placeId } = useParams()

    const navigate = useNavigate()

    const [formState, inputHandler, setFormData] = useForm({
        title:{
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false)

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest( import.meta.env.VITE_BACKEND_URL + `/places/${placeId}`)
                setLoadedPlace(responseData)
                setFormData({
                    title:{
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                }, true)
            } catch (error) {
                
            }
        }
        fetchPlace()
    }, [sendRequest, placeId, setFormData])

    const placeUpdateSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            await sendRequest(
                import.meta.env.VITE_BACKEND_URL + `/places/${placeId}`,
            'PATCH',
            JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value
            }), {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            })
            navigate('/' + auth.userId + '/places')
        } catch (err) {
            
        }
    }

    if (isLoading) {
        return <div className="center mt-10 ">{<Spinner />}</div>;
    }

    if(!loadedPlace && !error){
        return (
            <div className="text-center mt-20">
              <h2 className="text-2xl font-semibold text-gray-600">Could Not find a Place!!</h2>
            </div>
          );
    }

    return <>
        <ErrorModal error={error} onClear={clearError}/>
        {!isLoading && loadedPlace && <form onSubmit={placeUpdateSubmitHandler} className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Update a New Place</h2>
        <Input 
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]} 
            errorText="Please enter a valid title" 
            onInput={inputHandler} 
            value={formState.inputs.title.value}
            valid={formState.inputs.title.isValid}/>

        <Input 
            id="description"
            element="textarea"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]} 
            errorText="Please enter a valid description" 
            onInput={inputHandler} 
            value={formState.inputs.description.value}
            valid={formState.inputs.description.isValid}/>

        <Button type='submit' disabled={!formState.isValid}>Update Place</Button>
    </form>}
    </>
}