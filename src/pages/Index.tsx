import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { 
  ShoppingCart, 
  Package, 
  FileText, 
  Boxes, 
  Users, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'Catálogo de Productos',
    description: 'Gestiona todos tus productos con categorías, precios y descripciones detalladas.',
  },
  {
    icon: Boxes,
    title: 'Control de Inventario',
    description: 'Monitorea stock en tiempo real con alertas de nivel bajo y movimientos registrados.',
  },
  {
    icon: FileText,
    title: 'Facturación',
    description: 'Crea y administra facturas profesionales con cálculo automático de impuestos.',
  },
  {
    icon: Users,
    title: 'Gestión de Clientes',
    description: 'Base de datos completa de clientes con historial de compras y contacto.',
  },
  {
    icon: BarChart3,
    title: 'Reportes y Análisis',
    description: 'Estadísticas de ventas, productos más vendidos y análisis de rentabilidad.',
  },
  {
    icon: Shield,
    title: 'Control de Acceso',
    description: 'Sistema de roles y permisos para gestionar usuarios del sistema.',
  },
];

const benefits = [
  'Acceso desde cualquier dispositivo',
  'Datos en tiempo real',
  'Backup automático',
  'Soporte técnico incluido',
  'Actualizaciones continuas',
  'Interfaz intuitiva',
];

export default function Index() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <ShoppingCart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">NexoGest</span>
        </div>
          
          <div className="flex items-center gap-4">
            {!loading && (
              user ? (
                <Link to="/dashboard">
                  <Button className="btn-primary-gradient">
                    Ir al Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button className="btn-primary-gradient">
                    Iniciar Sesión
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto text-center text-primary-foreground">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-sm mb-8">
            <Zap className="h-4 w-4" />
            Sistema ERP Integral
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Gestiona tu negocio de forma{' '}
            <span className="text-primary">inteligente</span>
          </h1>
          
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Sistema completo de planificación de recursos empresariales. 
            Control de inventario, facturación y clientes en una sola plataforma.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tienda">
              <Button size="lg" className="btn-primary-gradient text-lg px-8 h-14">
                Ver Productos
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to={user ? '/dashboard' : '/auth'}>
              <Button size="lg" variant="secondary" className="text-lg px-8 h-14">
                {user ? 'Ir al Dashboard' : 'Iniciar Sesión'}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-primary/10 backdrop-blur-sm">
              <p className="text-3xl font-bold">100%</p>
              <p className="text-sm opacity-80">En la Nube</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 backdrop-blur-sm">
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm opacity-80">Disponible</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 backdrop-blur-sm">
              <p className="text-3xl font-bold">SSL</p>
              <p className="text-sm opacity-80">Seguridad</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 backdrop-blur-sm">
              <p className="text-3xl font-bold">∞</p>
              <p className="text-sm opacity-80">Escalable</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitas para tu negocio
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Módulos integrados que trabajan juntos para optimizar tus operaciones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-elevated group hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                ¿Por qué elegir nuestro sistema ERP?
              </h2>
              <p className="text-muted-foreground mb-8">
                Diseñado para pequeñas y medianas empresas que buscan profesionalizar 
                sus operaciones sin complicaciones.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8">
                <div className="h-full w-full rounded-xl bg-card border border-border shadow-xl flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <p className="font-display text-2xl font-bold">NexoGest</p>
                  <p className="text-muted-foreground">Versión 1.0</p>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="card-elevated overflow-hidden">
            <CardContent className="p-0">
              <div className="p-8 md:p-12 text-center" style={{ background: 'var(--gradient-primary)' }}>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                  Comienza a gestionar tu negocio hoy
                </h2>
                <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
                  Registra tu cuenta y accede a todas las funcionalidades del sistema ERP
                </p>
                <Link to={user ? '/dashboard' : '/auth'}>
                  <Button size="lg" variant="secondary" className="text-lg px-8">
                    {user ? 'Ir al Dashboard' : 'Crear Cuenta Gratis'}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span className="font-display font-bold">NexoGest</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 NexoGest. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
