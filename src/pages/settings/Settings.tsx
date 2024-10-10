import { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";

type UserProfile = {
  userId: string;
  userRole: string;
  userEmail: string;
};

type UserOrder = {
  orderId: string;
  orderDate: string;
  orderTotal: number;
};

export default function Profile() {
  const [profileData, setProfileData] = useState<UserProfile>({
    userId: "Not available",
    userRole: "Not available",
    userEmail: "Not available",
  });
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Fetch user information from localStorage
    const userId = localStorage.getItem("userId") || "Not available";
    const userRole = localStorage.getItem("userRole") || "Not available";
    const userEmail = localStorage.getItem("userEmail") || "Not available";

    setProfileData({ userId, userRole, userEmail });

    // Fetch user orders (assuming orders are stored in localStorage for demo purposes)
    const orders: UserOrder[] = [
      { orderId: "12345", orderDate: "2024-10-05", orderTotal: 59.99 },
      { orderId: "12346", orderDate: "2024-10-07", orderTotal: 89.99 },
    ];
    setUserOrders(orders);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    // Save updated data to localStorage or API call
    localStorage.setItem("userEmail", profileData.userEmail);
    // You could also send data to an API here
    setEditMode(false); // Exit edit mode after saving
  };

  return (
    <div className="flex flex-col overflow-hidden p-10 gap-5 w-full">
      <PageTitle title="User Profile" />
      
      {/* Profile Information Section */}
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <ul className="mb-4">
          <li className="mb-2">
            <span className="font-bold">User ID: </span>
            <span>{profileData.userId}</span>
          </li>
          <li className="mb-2">
            <span className="font-bold">Role: </span>
            <span>{profileData.userRole}</span>
          </li>
          <li className="mb-2">
            <span className="font-bold">Email: </span>
            {editMode ? (
              <input
                type="email"
                name="userEmail"
                value={profileData.userEmail}
                onChange={handleInputChange}
                className="border p-1 rounded"
              />
            ) : (
              <span>{profileData.userEmail}</span>
            )}
          </li>
        </ul>

        {editMode ? (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Orders Section */}
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">User Orders</h2>
        {userOrders.length > 0 ? (
          <ul>
            {userOrders.map((order) => (
              <li key={order.orderId} className="mb-2">
                <span className="font-bold">Order ID: </span>
                <span>{order.orderId}</span>
                <br />
                <span className="font-bold">Order Date: </span>
                <span>{order.orderDate}</span>
                <br />
                <span className="font-bold">Order Total: </span>
                <span>${order.orderTotal.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
}
