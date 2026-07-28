import { useAuth } from "@/context/AuthProvider";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-semibold">Welcome{user ? `, ${user.username}` : ""}</h1>
      <p className="text-gray-500 mt-2">Your vehicles will show up here.</p>
    </div>
  );
};

export default HomePage;
