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
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
  orders?: Array<{
    _id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export default function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/customers`, {
        withCredentials: true
      });
      setCustomers(response.data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      setError(error.response?.data?.message || 'Error fetching customers');
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Error fetching customers',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customerId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/customers/${customerId}`, {
        withCredentials: true
      });
      setSelectedCustomer(response.data);
    } catch (error: any) {
      console.error('Error fetching customer details:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Error fetching customer details',
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return <div>Loading customers...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer._id}>
              <TableCell>
                {customer.firstName} {customer.lastName}
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phoneNumber || '-'}</TableCell>
              <TableCell>
                {format(new Date(customer.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchCustomerDetails(customer._id)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedCustomer && (
        <div className="mt-8 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Customer Details: {selectedCustomer.firstName} {selectedCustomer.lastName}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{selectedCustomer.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p>{selectedCustomer.phoneNumber || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Joined</p>
              <p>{format(new Date(selectedCustomer.createdAt), 'MMM d, yyyy')}</p>
            </div>
          </div>

          {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
            <div>
              <h4 className="font-semibold mb-2">Order History</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCustomer.orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order._id}</TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No orders found</p>
          )}
        </div>
      )}
    </div>
  );
} 