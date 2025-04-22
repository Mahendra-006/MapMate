import { useEffect, useState } from "react";
import useHttpHook from "../../sharedComponents/hooks/HttpHook";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import ErrorModal from "../../sharedComponents/UIElements/ErrorModal";
import Spinner from "../../sharedComponents/UIElements/Spinner";

export default function UserPlaces(){
    const [loadedPlaces, setLoadedPlaces] = useState()
    const {isLoading, error, sendRequest, clearError} = useHttpHook()
    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(import.meta.env.VITE_BACKEND_URL + `/places/user/${userId}`)
                setLoadedPlaces(responseData.places)
            } catch (error) {
                
            }
        }
        fetchPlaces()
    }, [sendRequest, userId])

    const placeDeleteHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId))
    }

    return <>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && <Spinner/>}
        {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler}/>}
    </>
}