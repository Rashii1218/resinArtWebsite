
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface Order {
  id: string;
  customer: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

interface OrderManagementProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: string) => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  onUpdateOrderStatus
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Delivered": return "default";
      case "Shipped": return "secondary";
      case "Processing": return "outline";
      case "Cancelled": return "destructive";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onUpdateOrderStatus(order.id, "Shipped")}
                        disabled={order.status === "Delivered" || order.status === "Cancelled"}
                      >
                        Ship
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onUpdateOrderStatus(order.id, "Delivered")}
                        disabled={order.status === "Delivered" || order.status === "Cancelled" || order.status === "Processing"}
                      >
                        Deliver
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
