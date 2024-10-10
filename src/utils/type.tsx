// type.tsx

export interface user {
    id: string;
    name: string;
  }
  
  export interface OrderItem {
    id: string;
    name: string;
  }
  
  export interface OrderT {
    id: string;
    userId: string;
    orderItems: OrderItem[];
    status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    createdAt: string;
  }
  
  export interface UpdateOrderStatusParams {
    orderId: string;
    newStatus: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  }
  