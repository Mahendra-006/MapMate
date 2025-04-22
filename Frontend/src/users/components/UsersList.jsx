import UserItem from "./UserItem";

export default function UsersList({ items }) {
  if (items.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold text-gray-600">No Users Found!!</h2>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
}
