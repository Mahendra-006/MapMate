import { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../sharedComponents/UIElements/ErrorModal";
import Spinner from "../../sharedComponents/UIElements/Spinner";
import useHttpHook from "../../sharedComponents/hooks/HttpHook";

export default function Users() {
  const {isLoading, error, sendRequest, clearError} = useHttpHook()
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await sendRequest(import.meta.env.VITE_BACKEND_URL + "/users");
        setLoadedUsers(res.users);
      } catch (err) {
      }
    };
    fetchUser(); 
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <Spinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
}
