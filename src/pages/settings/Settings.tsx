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
    <div className="flex flex-col items-center p-6 space-y-8 w-full max-w-3xl mx-auto">
      <PageTitle title="User Profile" />
      
      {/* Profile Information Section */}
      <div className="p-8 bg-gray-50 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
        <ul className="space-y-3">
          <li className="flex justify-between items-center">
            <span className="font-medium text-gray-600">User ID:</span>
            <span>{profileData.userId}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Role:</span>
            <span>{profileData.userRole}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Email:</span>
            {editMode ? (
              <input
                type="email"
                name="userEmail"
                value={profileData.userEmail}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 text-sm"
              />
            ) : (
              <span>{profileData.userEmail}</span>
            )}
          </li>
        </ul>

        {editMode ? (
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full mt-4"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg w-full mt-4"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Orders Section */}
      <div className="p-8 bg-gray-50 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">User Orders</h2>
        {userOrders.length > 0 ? (
          <ul className="space-y-4">
            {userOrders.map((order) => (
              <li key={order.orderId} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Order ID:</span>
                  <span>{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Order Date:</span>
                  <span>{order.orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Order Total:</span>
                  <span>${order.orderTotal.toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No orders available.</p>
        )}
      </div>
    </div>
  );
}
