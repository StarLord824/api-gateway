import { useQuery } from "@apollo/client";
import { GET_USERS_QUERY } from "./api";

const Users = () => {
  const { data, loading } = useQuery(GET_USERS_QUERY);

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users List</h2>
      {data.users.map((user) => (
        <p key={user.id} className="border p-2 rounded-md mb-2 shadow">
          {user.name} ({user.email})
        </p>
      ))}
    </div>
  );
};

export default Users;
