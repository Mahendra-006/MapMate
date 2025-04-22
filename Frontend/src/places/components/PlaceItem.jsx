import { useContext, useState } from "react";
import Button from "../../sharedComponents/UIElements/Button";
import Card from "../../sharedComponents/UIElements/Card";
import Modal from "../../sharedComponents/UIElements/Modal";
import Map from "../../sharedComponents/UIElements/Map";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../sharedComponents/Context/AuthContext";
import useHttpHook from "../../sharedComponents/hooks/HttpHook";
import ErrorModal from "../../sharedComponents/UIElements/ErrorModal";
import Spinner from "../../sharedComponents/UIElements/Spinner";

export default function PlaceItem({ id, image, title, description, address, coordinates, onDelete, creatorId }) {
  const {isLoading, error, sendRequest ,clearError} = useHttpHook()
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const [showMap, setShowMap] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openDeleteModalHandler = () => setShowDeleteModal(true);
  const closeDeleteModalHandler = () => setShowDeleteModal(false);

  const confirmDeleteHandler = async () => {
    setShowDeleteModal(false);
    try {
      await sendRequest(import.meta.env.VITE_BACKEND_URL + `/places/${id}`, 'DELETE', null, {
        Authorization: 'Bearer ' + auth.token
      })
      onDelete(id)
    } catch (error) {
      
    }
  };


  return (
   <>
    <ErrorModal error={error} onClear={clearError}/>
     <li className="animate-fade-in-up">
      <Card>
        <div className="md:flex gap-6 p-4">
          <img
            src={`${import.meta.env.VITE_ASSET_URL}/${image}`}
            alt={title}
            className="w-full md:w-64 h-64 object-cover rounded-lg shadow-md"
          />

          <div className="flex flex-col justify-between mt-4 md:mt-0 flex-1">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
              <h3 className="text-gray-600 mb-1">{address}</h3>
              <p className="text-gray-500">{description}</p>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              <Button variant="primary" onClick={() => setShowMap(true)}>
                View on Map
              </Button>
              {auth.userId === creatorId && <Button variant="edting" onClick={() => navigate(`/places/${id}`)}>
                EDIT
              </Button>}
              {auth.userId === creatorId && <Button variant="danger" onClick={openDeleteModalHandler}>
                DELETE
              </Button>}
            </div>
          </div>
        </div>
      </Card>
    </li>

    <Modal isOpen={showMap} onClose={() => setShowMap(false)}>
        <h2 className="text-xl font-semibold mb-4">{title} Location</h2>
        <Map center={coordinates} zoom={13}/>
    </Modal>
    <Modal isOpen={showDeleteModal} onClose={closeDeleteModalHandler}>
        {isLoading && <Spinner asOverlay/>}
        <p className="mb-4 p-2">
          Do you want to proceed and delete this place? Please note that this can't be undone.
        </p>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={closeDeleteModalHandler}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteHandler}>
            Delete
          </Button>
        </div>
      </Modal>

   </>
  );
}