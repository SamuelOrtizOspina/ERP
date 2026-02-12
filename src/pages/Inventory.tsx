import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Boxes, Search, Plus, ArrowUpCircle, ArrowDownCircle, Loader2, AlertTriangle } from 'lucide-react';
import type { Inventory, Product } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type InventoryWithProduct = Inventory & { product: Product };

export default function InventoryPage() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryWithProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [movementType, setMovementType] = useState<'entrada' | 'salida'>('entrada');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*, product:products(*)')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setInventory((data as InventoryWithProduct[]) || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setProducts((data as Product[]) || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleMovement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setFormLoading(true);

    const formData = new FormData(e.currentTarget);
    const productId = formData.get('product_id') as string;
    const quantity = parseInt(formData.get('quantity') as string);
    const notes = formData.get('notes') as string;

    try {
      // Check if inventory exists for this product
      const { data: existingInventory } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', productId)
        .single();

      const adjustedQuantity = movementType === 'entrada' ? quantity : -quantity;

      if (existingInventory) {
        const newQuantity = existingInventory.quantity + adjustedQuantity;
        if (newQuantity < 0) {
          toast.error('Stock insuficiente para esta salida');
          setFormLoading(false);
          return;
        }

        // Update inventory
        await supabase
          .from('inventory')
          .update({ quantity: newQuantity })
          .eq('id', existingInventory.id);
      } else {
        if (movementType === 'salida') {
          toast.error('No hay inventario para este producto');
          setFormLoading(false);
          return;
        }
        // Create new inventory record
        await supabase
          .from('inventory')
          .insert([{ product_id: productId, quantity }]);
      }

      // Record movement
      await supabase.from('inventory_movements').insert([{
        product_id: productId,
        quantity: adjustedQuantity,
        movement_type: movementType,
        user_id: user.id,
        notes,
      }]);

      toast.success(`Movimiento de ${movementType} registrado`);
      setIsDialogOpen(false);
      fetchInventory();
    } catch (error) {
      console.error('Error recording movement:', error);
      toast.error('Error al registrar el movimiento');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product?.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockLevel = (quantity: number, minStock: number, maxStock: number) => {
    if (quantity <= minStock) return 'critical';
    if (quantity <= minStock * 2) return 'low';
    if (quantity >= maxStock * 0.9) return 'high';
    return 'normal';
  };

  const getStockPercentage = (quantity: number, maxStock: number) => {
    return Math.min((quantity / maxStock) * 100, 100);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Control de Inventario</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona el stock de productos
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Registrar Movimiento</DialogTitle>
                <DialogDescription>
                  Registra entradas o salidas de inventario
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleMovement} className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={movementType === 'entrada' ? 'default' : 'outline'}
                    className={cn(
                      'flex-1',
                      movementType === 'entrada' && 'bg-success hover:bg-success/90'
                    )}
                    onClick={() => setMovementType('entrada')}
                  >
                    <ArrowUpCircle className="h-4 w-4 mr-2" />
                    Entrada
                  </Button>
                  <Button
                    type="button"
                    variant={movementType === 'salida' ? 'default' : 'outline'}
                    className={cn(
                      'flex-1',
                      movementType === 'salida' && 'bg-destructive hover:bg-destructive/90'
                    )}
                    onClick={() => setMovementType('salida')}
                  >
                    <ArrowDownCircle className="h-4 w-4 mr-2" />
                    Salida
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_id">Producto</Label>
                  <Select name="product_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.sku} - {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas (opcional)</Label>
                  <Input
                    id="notes"
                    name="notes"
                    placeholder="Referencia, proveedor, etc."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={formLoading}>
                    {formLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Registrar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="card-elevated mb-6">
          <CardContent className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Boxes className="h-5 w-5" />
              Inventario ({filteredInventory.length} productos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredInventory.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Boxes className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay productos en inventario</p>
                <p className="text-sm">Registra un movimiento de entrada para comenzar</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="w-[200px]">Nivel de Stock</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const stockLevel = getStockLevel(item.quantity, item.min_stock, item.max_stock);
                    const percentage = getStockPercentage(item.quantity, item.max_stock);
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">
                          {item.product?.sku}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{item.product?.name}</p>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.location || 'Sin asignar'}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-lg font-bold">{item.quantity}</span>
                          <span className="text-sm text-muted-foreground ml-1">uds</span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress 
                              value={percentage} 
                              className={cn(
                                'h-2',
                                stockLevel === 'critical' && '[&>div]:bg-destructive',
                                stockLevel === 'low' && '[&>div]:bg-warning',
                                stockLevel === 'normal' && '[&>div]:bg-success',
                                stockLevel === 'high' && '[&>div]:bg-primary'
                              )}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Min: {item.min_stock}</span>
                              <span>Max: {item.max_stock}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {stockLevel === 'critical' && (
                            <span className="inline-flex items-center gap-1 text-destructive text-sm font-medium">
                              <AlertTriangle className="h-4 w-4" />
                              Crítico
                            </span>
                          )}
                          {stockLevel === 'low' && (
                            <span className="text-warning text-sm font-medium">Stock bajo</span>
                          )}
                          {stockLevel === 'normal' && (
                            <span className="text-success text-sm font-medium">Normal</span>
                          )}
                          {stockLevel === 'high' && (
                            <span className="text-primary text-sm font-medium">Óptimo</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
