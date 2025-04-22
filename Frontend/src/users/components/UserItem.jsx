import Avatar from "../../sharedComponents/UIElements/Avatar";
import { Link } from "react-router-dom";
import Card from "../../sharedComponents/UIElements/Card";
import { useContext } from "react";
import { AuthContext } from "../../sharedComponents/Context/AuthContext";

export default function UserItem({ id, image, name, placeCount }) {
  const auth = useContext(AuthContext);

  const isLoggedInUser = auth.userId === id;

  return (
    <li>
      <Link to={`/${id}/places`}>
        <Card className={isLoggedInUser ? "bg-blue-100 border-2 border-blue-600" : ""}> 
          <div className="flex items-center space-x-4 p-4">
            <Avatar image={`${import.meta.env.VITE_ASSET_URL}/${image}`} alt={name} />
            <div>
              <h2 className="text-lg font-bold text-gray-800">{name}</h2>
              <h3 className="text-sm text-gray-600">
                {placeCount} {placeCount === 1 ? "Place" : "Places"}
              </h3>
            </div>
          </div>
        </Card>
      </Link>
    </li>
  );
}
