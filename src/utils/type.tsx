// type.tsx

export interface UserT {
    id: string;
    name: string;
  }
  
  export interface OrderItem {
    id: string;
    name: string;
  }
  export type StatusT = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  
  export interface OrderT {
    id: string;
    userId: string;
    orderItems: OrderItem[];
    status: StatusT;
    createdAt: string;
  }
  
  export interface UpdateOrderStatusParams {
    orderId: string;
    newStatus: StatusT;
  }
  