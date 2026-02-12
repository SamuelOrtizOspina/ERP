// ERP Types - Core business entities

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  gender?: string;
  national_id?: string;
  marital_status?: string;
  birth_date?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export type AppRole = 'admin' | 'vendedor' | 'almacenista' | 'contador';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export type ProductCategory = 'electronica' | 'ropa' | 'alimentos' | 'servicios' | 'otros';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: ProductCategory;
  price: number;
  cost: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: string;
  product_id: string;
  quantity: number;
  min_stock: number;
  max_stock: number;
  location?: string;
  last_restock_date?: string;
  updated_at: string;
  product?: Product;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  created_at: string;
  updated_at: string;
}

export type InvoiceStatus = 'pendiente' | 'pagada' | 'cancelada' | 'vencida';

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  user_id: string;
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  total: number;
  due_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  product?: Product;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  quantity: number;
  movement_type: 'entrada' | 'salida' | 'ajuste';
  reference?: string;
  user_id: string;
  notes?: string;
  created_at: string;
  product?: Product;
}

// Dashboard Stats
export interface DashboardStats {
  totalProducts: number;
  totalInventoryValue: number;
  lowStockItems: number;
  pendingInvoices: number;
  monthlyRevenue: number;
  totalCustomers: number;
}

// Category labels in Spanish
export const categoryLabels: Record<ProductCategory, string> = {
  electronica: 'Electrónica',
  ropa: 'Ropa',
  alimentos: 'Alimentos',
  servicios: 'Servicios',
  otros: 'Otros',
};

export const statusLabels: Record<InvoiceStatus, string> = {
  pendiente: 'Pendiente',
  pagada: 'Pagada',
  cancelada: 'Cancelada',
  vencida: 'Vencida',
};

export const roleLabels: Record<AppRole, string> = {
  admin: 'Administrador',
  vendedor: 'Vendedor',
  almacenista: 'Almacenista',
  contador: 'Contador',
};
