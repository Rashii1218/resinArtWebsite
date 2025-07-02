import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface Order {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  items: Array<{
    product: {
      name: string;
      price: number;
      images: string[];
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  trackingNumber?: string;
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/orders`,
        { withCredentials: true }
      );
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Failed to fetch orders',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/orders/${orderId}/status`,
        { status },
        { withCredentials: true }
      );
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status } : order
      ));

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Failed to update order status',
        variant: "destructive",
      });
    }
  };

  const updateTrackingNumber = async (orderId: string, trackingNumber: string) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/orders/${orderId}/tracking`,
        { trackingNumber },
        { withCredentials: true }
      );
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, trackingNumber } : order
      ));

      toast({
        title: "Success",
        description: "Tracking number updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Failed to update tracking number',
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Tracking</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>
                <div>
                  <div>{order.user.firstName} {order.user.lastName}</div>
                  <div className="text-sm text-gray-500">{order.user.email}</div>
                  <div className="text-sm text-gray-500">{order.user.phoneNumber}</div>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(order.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value: Order['status']) => updateOrderStatus(order._id, value)}
                >
                  <SelectTrigger className={`w-[130px] ${getStatusColor(order.status)}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tracking #"
                    defaultValue={order.trackingNumber}
                    onBlur={(e) => updateTrackingNumber(order._id, e.target.value)}
                  />
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {/* TODO: Implement view order details */}}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 