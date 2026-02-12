import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  FileText, 
  Users,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Invoice, Product, Inventory } from '@/lib/types';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    pendingInvoices: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
    inventoryValue: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<(Inventory & { product: Product })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch customers count
      const { count: customersCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      // Fetch pending invoices
      const { data: pendingInvoicesData, count: pendingCount } = await supabase
        .from('invoices')
        .select('*, customer:customers(*)', { count: 'exact' })
        .eq('status', 'pendiente')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch low stock items
      const { data: lowStockData } = await supabase
        .from('inventory')
        .select('*, product:products(*)')
        .filter('quantity', 'lt', 10)
        .limit(5);

      // Calculate monthly revenue (paid invoices this month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlyInvoices } = await supabase
        .from('invoices')
        .select('total')
        .eq('status', 'pagada')
        .gte('created_at', startOfMonth.toISOString());

      const monthlyRevenue = monthlyInvoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0;

      setStats({
        totalProducts: productsCount || 0,
        lowStockItems: lowStockData?.length || 0,
        pendingInvoices: pendingCount || 0,
        totalCustomers: customersCount || 0,
        monthlyRevenue,
        inventoryValue: 0,
      });

      setRecentInvoices((pendingInvoicesData as Invoice[]) || []);
      setLowStockProducts((lowStockData as (Inventory & { product: Product })[]) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Resumen general de tu negocio
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Productos"
            value={stats.totalProducts}
            icon={<Package className="h-6 w-6" />}
            change={12}
            changeLabel="vs mes anterior"
            variant="primary"
          />
          <StatCard
            title="Ingresos del Mes"
            value={formatCurrency(stats.monthlyRevenue)}
            icon={<DollarSign className="h-6 w-6" />}
            change={8}
            changeLabel="vs mes anterior"
            variant="success"
          />
          <StatCard
            title="Facturas Pendientes"
            value={stats.pendingInvoices}
            icon={<FileText className="h-6 w-6" />}
            variant="warning"
          />
          <StatCard
            title="Alertas de Stock"
            value={stats.lowStockItems}
            icon={<AlertTriangle className="h-6 w-6" />}
            variant={stats.lowStockItems > 0 ? 'danger' : 'default'}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Facturas Pendientes</CardTitle>
              <Link 
                to="/invoices" 
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Ver todas <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentInvoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No hay facturas pendientes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentInvoices.map((invoice) => (
                    <div 
                      key={invoice.id} 
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{invoice.invoice_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.customer?.name || 'Cliente'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(Number(invoice.total))}</p>
                        <StatusBadge status={invoice.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Alertas de Inventario</CardTitle>
              <Link 
                to="/inventory" 
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Ver inventario <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Todo el inventario está en niveles óptimos</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lowStockProducts.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{item.product?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.product?.sku}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-destructive">{item.quantity} unidades</p>
                        <p className="text-xs text-muted-foreground">Mín: {item.min_stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/customers">
            <Card className="card-elevated hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clientes</p>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Users className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/products">
            <Card className="card-elevated hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Productos Activos</p>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Package className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/invoices">
            <Card className="card-elevated hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Por Cobrar</p>
                  <p className="text-2xl font-bold">{stats.pendingInvoices} facturas</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
