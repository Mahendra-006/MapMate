import { useContext } from "react";
import Button from "../../sharedComponents/UIElements/Button";
import PlaceItem from "./PlaceItem";
import { AuthContext } from "../../sharedComponents/Context/AuthContext";
import { useParams } from "react-router-dom";

export default function PlaceList({ items, onDeletePlace }) {
  const auth = useContext(AuthContext);
  const { userId } = useParams();

  if (!items || items.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold text-gray-600 pb-5">No Places Found!!</h2>
        {auth.userId === userId && (
          <Button to={"/places/new"}>Share Place</Button>
        )}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-8 px-4 py-8 max-w-3xl mx-auto">
      {items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={onDeletePlace}
        />
      ))}
    </ul>
  );
}

