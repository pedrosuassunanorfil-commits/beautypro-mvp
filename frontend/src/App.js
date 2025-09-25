import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import Shadcn components
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Calendar } from './components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import { Separator } from './components/ui/separator';
import { Switch } from './components/ui/switch';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Set up axios interceptor for auth
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Theme Context
const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'default';
  });

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

const useTheme = () => React.useContext(ThemeContext);

// Landing Page Component
const LandingPage = ({ onShowAuth }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen landing-bg-${theme}`}>
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">✨</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            BeautyPro
          </span>
        </div>
        <Button 
          onClick={onShowAuth}
          className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-6"
          data-testid="header-login-btn"
        >
          Entrar
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className={`text-6xl font-bold mb-6 hero-text-${theme} leading-tight`}>
          Gerencie seu Negócio de Estética
        </h1>
        <p className={`text-xl hero-subtitle-${theme} mb-10 max-w-3xl mx-auto leading-relaxed`}>
          Sistema completo para profissionais de estética com agendamento online, controle financeiro e gestão de serviços. Tudo o que você precisa em um só lugar.
        </p>
        <Button 
          onClick={onShowAuth}
          size="lg"
          className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          data-testid="hero-get-started-btn"
        >
          Começar Agora - R$ 30/mês
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className={`text-4xl font-bold text-center mb-16 section-title-${theme}`}>
          Funcionalidades Principais
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className={`border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 feature-card-${theme}`}>
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <CardTitle className={`text-xl card-title-${theme}`}>Agendamento Online</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`card-text-${theme}`}>Link personalizado para seus clientes agendarem serviços diretamente. Aceite, recuse ou remarque com facilidade.</p>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 feature-card-${theme}`}>
            <CardHeader>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <CardTitle className={`text-xl card-title-${theme}`}>Controle Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`card-text-${theme}`}>Registre entradas e saídas, acompanhe seu balanço em tempo real com filtros por período e categoria.</p>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 feature-card-${theme}`}>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <CardTitle className={`text-xl card-title-${theme}`}>Gestão de Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`card-text-${theme}`}>Cadastre seus serviços e produtos, defina preços, duração e controle estoque. Mantenha seu catálogo sempre organizado.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">Pronto para começar?</CardTitle>
            <CardDescription className="text-emerald-50 text-lg">
              Plano único de R$ 30/mês com todas as funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={onShowAuth}
              size="lg"
              variant="secondary"
              className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg rounded-full font-semibold"
              data-testid="cta-get-started-btn"
            >
              Criar Minha Conta
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

// Auth Component
const AuthComponent = ({ onLoginSuccess, onBack }) => {
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    business_name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${API}${endpoint}`, formData);
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success(isLogin ? 'Login realizado com sucesso!' : 'Conta criada com sucesso!');
      onLoginSuccess(response.data.user);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen auth-bg-${theme} flex items-center justify-center p-4`}>
      <Card className={`w-full max-w-md shadow-2xl border-0 auth-card-${theme}`}>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className={`auth-back-btn-${theme}`}
              data-testid="auth-back-btn"
            >
              ← Voltar
            </Button>
          </div>
          <CardTitle className={`text-2xl text-center auth-title-${theme}`}>
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </CardTitle>
          <CardDescription className={`text-center auth-subtitle-${theme}`}>
            {isLogin ? 'Acesse sua conta' : 'Cadastre-se no BeautyPro'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name" className={`auth-label-${theme}`}>Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required={!isLogin}
                    className={`auth-input-${theme}`}
                    data-testid="auth-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="business_name" className={`auth-label-${theme}`}>Nome do Negócio</Label>
                  <Input
                    id="business_name"
                    type="text"
                    placeholder="Nome do seu salão/estúdio"
                    value={formData.business_name}
                    onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                    required={!isLogin}
                    className={`auth-input-${theme}`}
                    data-testid="auth-business-input"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className={`auth-label-${theme}`}>Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required={!isLogin}
                    className={`auth-input-${theme}`}
                    data-testid="auth-phone-input"
                  />
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email" className={`auth-label-${theme}`}>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className={`auth-input-${theme}`}
                data-testid="auth-email-input"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className={`auth-label-${theme}`}>Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className={`auth-input-${theme}`}
                data-testid="auth-password-input"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white"
              disabled={loading}
              data-testid="auth-submit-btn"
            >
              {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-emerald-600 hover:text-emerald-700"
              data-testid="auth-toggle-btn"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Theme Selector Component
const ThemeSelector = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="theme-select" className={`theme-label-${theme}`}>Tema:</Label>
      <Select value={theme} onValueChange={toggleTheme}>
        <SelectTrigger className="w-32" data-testid="theme-selector">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Padrão</SelectItem>
          <SelectItem value="gray">Cinza</SelectItem>
          <SelectItem value="pink">Rosa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ user, onLogout }) => {
  const { theme } = useTheme();
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [financialEntries, setFinancialEntries] = useState([]);
  const [balance, setBalance] = useState({ income: 0, expenses: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
    category: 'service',
    stock_quantity: ''
  });

  // Financial form state
  const [financialForm, setFinancialForm] = useState({
    type: 'income',
    description: '',
    amount: '',
    category: '',
    service_id: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Reschedule dialog state
  const [rescheduleDialog, setRescheduleDialog] = useState({
    open: false,
    appointment: null,
    proposals: {
      date1: '',
      time1: '',
      date2: '',
      time2: '',
      date3: '',
      time3: '',
      message: ''
    }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [servicesRes, appointmentsRes, financialRes, balanceRes] = await Promise.all([
        axios.get(`${API}/services`),
        axios.get(`${API}/appointments`),
        axios.get(`${API}/financial`),
        axios.get(`${API}/financial/balance`)
      ]);

      setServices(servicesRes.data);
      setAppointments(appointmentsRes.data);
      setFinancialEntries(financialRes.data);
      setBalance(balanceRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...serviceForm,
        price: parseFloat(serviceForm.price),
        duration_minutes: serviceForm.category === 'service' ? parseInt(serviceForm.duration_minutes) : 0,
        stock_quantity: serviceForm.category === 'product' ? parseInt(serviceForm.stock_quantity) : null
      };

      await axios.post(`${API}/services`, payload);
      
      toast.success(`${serviceForm.category === 'service' ? 'Serviço' : 'Produto'} criado com sucesso!`);
      setServiceForm({ name: '', description: '', price: '', duration_minutes: '', category: 'service', stock_quantity: '' });
      loadDashboardData();
    } catch (error) {
      toast.error(`Erro ao criar ${serviceForm.category === 'service' ? 'serviço' : 'produto'}`);
    }
  };

  const handleCreateFinancialEntry = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/financial`, {
        ...financialForm,
        amount: parseFloat(financialForm.amount)
      });
      
      toast.success('Lançamento registrado com sucesso!');
      setFinancialForm({
        type: 'income',
        description: '',
        amount: '',
        category: '',
        service_id: '',
        date: new Date().toISOString().split('T')[0]
      });
      loadDashboardData();
    } catch (error) {
      toast.error('Erro ao registrar lançamento');
    }
  };

  const handleAppointmentUpdate = async (appointmentId, status, newDate = null, newTime = null) => {
    try {
      await axios.put(`${API}/appointments/${appointmentId}`, {
        status,
        new_date: newDate,
        new_time: newTime
      });
      
      toast.success(`Agendamento ${status === 'confirmed' ? 'confirmado' : status === 'rejected' ? 'recusado' : 'remarcado'} com sucesso!`);
      loadDashboardData();
    } catch (error) {
      toast.error('Erro ao atualizar agendamento');
    }
  };

  const handleProposeReschedule = async () => {
    try {
      const response = await axios.post(`${API}/appointments/${rescheduleDialog.appointment.id}/propose-reschedule`, rescheduleDialog.proposals);
      
      toast.success('Proposta de reagendamento enviada!');
      toast.info('Mensagem WhatsApp: ' + response.data.whatsapp_message.substring(0, 100) + '...');
      
      setRescheduleDialog({ open: false, appointment: null, proposals: {} });
      loadDashboardData();
    } catch (error) {
      toast.error('Erro ao enviar proposta de reagendamento');
    }
  };

  const getBookingLink = () => {
    return `${window.location.origin}/booking/${user.id}`;
  };

  const copyBookingLink = () => {
    navigator.clipboard.writeText(getBookingLink());
    toast.success('Link de agendamento copiado!');
  };

  if (loading) {
    return (
      <div className={`min-h-screen dashboard-bg-${theme} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`dashboard-text-${theme}`}>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen dashboard-bg-${theme}`}>
      {/* Header */}
      <header className={`dashboard-header-${theme} shadow-sm border-b border-slate-200`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">✨</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold header-title-${theme}`}>{user.business_name}</h1>
              <p className={`text-sm header-subtitle-${theme}`}>Olá, {user.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSelector />
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className={`logout-btn-${theme}`}
              data-testid="dashboard-logout-btn"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Receitas</CardTitle>
              <div className="text-2xl font-bold">R$ {balance.income.toFixed(2)}</div>
            </CardHeader>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Despesas</CardTitle>
              <div className="text-2xl font-bold">R$ {balance.expenses.toFixed(2)}</div>
            </CardHeader>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Saldo</CardTitle>
              <div className="text-2xl font-bold">R$ {balance.balance.toFixed(2)}</div>
            </CardHeader>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Agendamentos</CardTitle>
              <div className="text-2xl font-bold">{appointments.filter(apt => apt.status === 'pending').length}</div>
            </CardHeader>
          </Card>
        </div>

        {/* Booking Link */}
        <Card className={`mb-8 border-0 shadow-lg booking-link-card-${theme}`}>
          <CardHeader>
            <CardTitle className={`text-lg booking-link-title-${theme}`}>Link de Agendamento</CardTitle>
            <CardDescription className={`booking-link-subtitle-${theme}`}>
              Compartilhe este link com seus clientes para agendamentos online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                value={getBookingLink()} 
                readOnly 
                className={`booking-link-input-${theme}`}
                data-testid="booking-link-input"
              />
              <Button 
                onClick={copyBookingLink}
                variant="outline"
                className={`booking-link-btn-${theme}`}
                data-testid="copy-booking-link-btn"
              >
                Copiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className={`grid grid-cols-4 tabs-list-${theme}`}>
            <TabsTrigger value="services" data-testid="services-tab">Serviços</TabsTrigger>
            <TabsTrigger value="financial" data-testid="financial-tab">Financeiro</TabsTrigger>
            <TabsTrigger value="appointments" data-testid="appointments-tab">Agendamentos</TabsTrigger>
            <TabsTrigger value="reports" data-testid="reports-tab">Relatórios</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className={`border-0 shadow-lg tab-card-${theme}`}>
                <CardHeader>
                  <CardTitle className={`tab-card-title-${theme}`}>Cadastrar Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateService} className="space-y-4">
                    <Select
                      value={serviceForm.category}
                      onValueChange={(value) => setServiceForm({...serviceForm, category: value})}
                    >
                      <SelectTrigger data-testid="service-category-select">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">Serviço</SelectItem>
                        <SelectItem value="product">Produto</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      placeholder={`Nome do ${serviceForm.category === 'service' ? 'serviço' : 'produto'}`}
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                      required
                      data-testid="service-name-input"
                    />
                    <Textarea
                      placeholder="Descrição (opcional)"
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                      data-testid="service-description-input"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Preço (R$)"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                      required
                      data-testid="service-price-input"
                    />
                    
                    {serviceForm.category === 'service' && (
                      <Input
                        type="number"
                        placeholder="Duração (minutos)"
                        value={serviceForm.duration_minutes}
                        onChange={(e) => setServiceForm({...serviceForm, duration_minutes: e.target.value})}
                        required
                        data-testid="service-duration-input"
                      />
                    )}
                    
                    {serviceForm.category === 'product' && (
                      <Input
                        type="number"
                        placeholder="Quantidade em estoque"
                        value={serviceForm.stock_quantity}
                        onChange={(e) => setServiceForm({...serviceForm, stock_quantity: e.target.value})}
                        required
                        data-testid="service-stock-input"
                      />
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      data-testid="create-service-btn"
                    >
                      Cadastrar {serviceForm.category === 'service' ? 'Serviço' : 'Produto'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className={`border-0 shadow-lg tab-card-${theme}`}>
                <CardHeader>
                  <CardTitle className={`tab-card-title-${theme}`}>Meus Itens ({services.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {services.map((service) => (
                      <div 
                        key={service.id} 
                        className={`flex justify-between items-center p-3 service-item-${theme} rounded-lg`}
                        data-testid={`service-item-${service.id}`}
                      >
                        <div>
                          <h4 className={`font-medium service-item-title-${theme}`}>{service.name}</h4>
                          <p className={`text-sm service-item-subtitle-${theme}`}>
                            R$ {service.price.toFixed(2)}
                            {service.category === 'service' && ` • ${service.duration_minutes}min`}
                            {service.category === 'product' && ` • Estoque: ${service.stock_quantity}`}
                          </p>
                        </div>
                        <Badge variant={service.category === 'service' ? 'default' : 'secondary'}>
                          {service.category === 'service' ? 'Serviço' : 'Produto'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className={`border-0 shadow-lg tab-card-${theme}`}>
                <CardHeader>
                  <CardTitle className={`tab-card-title-${theme}`}>Novo Lançamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateFinancialEntry} className="space-y-4">
                    <Select
                      value={financialForm.type}
                      onValueChange={(value) => setFinancialForm({...financialForm, type: value})}
                    >
                      <SelectTrigger data-testid="financial-type-select">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Receita</SelectItem>
                        <SelectItem value="expense">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={financialForm.service_id}
                      onValueChange={(value) => setFinancialForm({...financialForm, service_id: value === "none" ? "" : value})}
                    >
                      <SelectTrigger data-testid="financial-service-select">
                        <SelectValue placeholder="Selecione um item (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum item específico</SelectItem>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - R$ {service.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      placeholder="Descrição"
                      value={financialForm.description}
                      onChange={(e) => setFinancialForm({...financialForm, description: e.target.value})}
                      required
                      data-testid="financial-description-input"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Valor (R$)"
                      value={financialForm.amount}
                      onChange={(e) => setFinancialForm({...financialForm, amount: e.target.value})}
                      required
                      data-testid="financial-amount-input"
                    />
                    <Input
                      placeholder="Categoria"
                      value={financialForm.category}
                      onChange={(e) => setFinancialForm({...financialForm, category: e.target.value})}
                      required
                      data-testid="financial-category-input"
                    />
                    <Input
                      type="date"
                      value={financialForm.date}
                      onChange={(e) => setFinancialForm({...financialForm, date: e.target.value})}
                      required
                      data-testid="financial-date-input"
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      data-testid="create-financial-entry-btn"
                    >
                      Registrar Lançamento
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className={`border-0 shadow-lg tab-card-${theme}`}>
                <CardHeader>
                  <CardTitle className={`tab-card-title-${theme}`}>Últimos Lançamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {financialEntries.slice(0, 10).map((entry) => (
                      <div 
                        key={entry.id} 
                        className={`flex justify-between items-center p-3 financial-item-${theme} rounded-lg`}
                        data-testid={`financial-entry-${entry.id}`}
                      >
                        <div>
                          <h4 className={`font-medium financial-item-title-${theme}`}>{entry.description}</h4>
                          <p className={`text-sm financial-item-subtitle-${theme}`}>{entry.category} • {entry.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`font-semibold ${entry.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {entry.type === 'income' ? '+' : '-'} R$ {entry.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card className={`border-0 shadow-lg tab-card-${theme}`}>
              <CardHeader>
                <CardTitle className={`tab-card-title-${theme}`}>Agendamentos Pendentes ({appointments.filter(apt => apt.status === 'pending').length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.filter(apt => apt.status === 'pending').map((appointment) => (
                    <Card key={appointment.id} className={`appointment-card-pending-${theme}`} data-testid={`appointment-${appointment.id}`}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className={`font-semibold appointment-name-${theme}`}>{appointment.client_name}</h4>
                            <p className={`text-sm appointment-detail-${theme}`}>{appointment.client_phone}</p>
                            <p className={`text-sm appointment-detail-${theme}`}>{appointment.service_name}</p>
                            <p className={`text-sm appointment-detail-${theme}`}>{appointment.date} às {appointment.time}</p>
                          </div>
                          <Badge variant="outline" className="border-amber-500 text-amber-700">
                            Pendente
                          </Badge>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button 
                            size="sm"
                            onClick={() => handleAppointmentUpdate(appointment.id, 'confirmed')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            data-testid={`confirm-appointment-${appointment.id}`}
                          >
                            Confirmar
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleAppointmentUpdate(appointment.id, 'rejected')}
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            data-testid={`reject-appointment-${appointment.id}`}
                          >
                            Recusar
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => setRescheduleDialog({ open: true, appointment, proposals: {} })}
                            className="border-blue-500 text-blue-600 hover:bg-blue-50"
                            data-testid={`reschedule-appointment-${appointment.id}`}
                          >
                            Propor Reagendamento
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {appointments.filter(apt => apt.status === 'pending').length === 0 && (
                    <div className={`text-center py-8 empty-state-${theme}`}>
                      Nenhum agendamento pendente
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Confirmed Appointments */}
            <Card className={`border-0 shadow-lg tab-card-${theme}`}>
              <CardHeader>
                <CardTitle className={`tab-card-title-${theme}`}>Agendamentos Confirmados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.filter(apt => apt.status === 'confirmed').slice(0, 5).map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className={`flex justify-between items-center p-3 appointment-confirmed-${theme} rounded-lg border`}
                      data-testid={`confirmed-appointment-${appointment.id}`}
                    >
                      <div>
                        <h4 className={`font-medium appointment-name-${theme}`}>{appointment.client_name}</h4>
                        <p className={`text-sm appointment-detail-${theme}`}>{appointment.service_name}</p>
                        <p className={`text-sm appointment-detail-${theme}`}>{appointment.date} às {appointment.time}</p>
                      </div>
                      <Badge className="bg-emerald-600 text-white">Confirmado</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className={`border-0 shadow-lg tab-card-${theme}`}>
              <CardHeader>
                <CardTitle className={`tab-card-title-${theme}`}>Resumo Financeiro</CardTitle>
                <CardDescription className={`tab-card-subtitle-${theme}`}>Visão geral das suas finanças</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className={`text-center p-6 report-card-income-${theme} rounded-lg`}>
                    <div className="text-3xl font-bold text-emerald-600">R$ {balance.income.toFixed(2)}</div>
                    <div className={`text-sm report-label-${theme} mt-1`}>Total de Receitas</div>
                  </div>
                  <div className={`text-center p-6 report-card-expense-${theme} rounded-lg`}>
                    <div className="text-3xl font-bold text-red-600">R$ {balance.expenses.toFixed(2)}</div>
                    <div className={`text-sm report-label-${theme} mt-1`}>Total de Despesas</div>
                  </div>
                  <div className={`text-center p-6 report-card-balance-${theme} rounded-lg`}>
                    <div className="text-3xl font-bold text-blue-600">R$ {balance.balance.toFixed(2)}</div>
                    <div className={`text-sm report-label-${theme} mt-1`}>Saldo Final</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reschedule Dialog */}
        <Dialog open={rescheduleDialog.open} onOpenChange={(open) => setRescheduleDialog({...rescheduleDialog, open})}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Propor Reagendamento</DialogTitle>
              <DialogDescription>
                Ofereça 3 opções de horários para o cliente {rescheduleDialog.appointment?.client_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Label>Opção 1:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={rescheduleDialog.proposals.date1 || ''}
                    onChange={(e) => setRescheduleDialog({
                      ...rescheduleDialog,
                      proposals: {...rescheduleDialog.proposals, date1: e.target.value}
                    })}
                  />
                  <Input
                    type="time"
                    value={rescheduleDialog.proposals.time1 || ''}
                    onChange={(e) => setRescheduleDialog({
                      ...rescheduleDialog,
                      proposals: {...rescheduleDialog.proposals, time1: e.target.value}
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Label>Opção 2:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={rescheduleDialog.proposals.date2 || ''}
                    onChange={(e) => setRescheduleDialog({
                      ...rescheduleDialog,
                      proposals: {...rescheduleDialog.proposals, date2: e.target.value}
                    })}
                  />
                  <Input
                    type="time"
                    value={rescheduleDialog.proposals.time2 || ''}
                    onChange={(e) => setRescheduleDialog({
                      ...rescheduleDialog,
                      proposals: {...rescheduleDialog.proposals, time2: e.target.value}
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Label>Opção 3:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={rescheduleDialog.proposals.date3 || ''}
                    onChange={(e) => setRescheduleDialog({
                      ...rescheduleDialog,
                      proposals: {...rescheduleDialog.proposals, date3: e.target.value}
                    })}
                  />
                  <Input
                    type="time"
                    value={rescheduleDialog.proposals.time3 || ''}
                    onChange={(e) => setRescheduleDialog({
                      ...rescheduleDialog,
                      proposals: {...rescheduleDialog.proposals, time3: e.target.value}
                    })}
                  />
                </div>
              </div>
              
              <div>
                <Label>Mensagem adicional:</Label>
                <Textarea
                  placeholder="Explique o motivo do reagendamento..."
                  value={rescheduleDialog.proposals.message || ''}
                  onChange={(e) => setRescheduleDialog({
                    ...rescheduleDialog,
                    proposals: {...rescheduleDialog.proposals, message: e.target.value}
                  })}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleProposeReschedule} className="flex-1">
                  Enviar Proposta
                </Button>
                <Button variant="outline" onClick={() => setRescheduleDialog({open: false, appointment: null, proposals: {}})}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Booking Page Component
const BookingPage = () => {
  const { theme } = useTheme();
  const [professional, setProfessional] = useState(null);
  const [services, setServices] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    client_name: '',
    client_phone: '',
    service_id: '',
    date: '',
    time: '',
    notes: ''
  });

  const userId = window.location.pathname.split('/')[2];

  useEffect(() => {
    loadProfessionalData();
  }, []);

  useEffect(() => {
    if (bookingForm.date) {
      loadAvailableTimes();
    }
  }, [bookingForm.date]);

  const loadProfessionalData = async () => {
    try {
      const response = await axios.get(`${API}/public/professional/${userId}`);
      setProfessional(response.data.professional);
      setServices(response.data.services);
    } catch (error) {
      toast.error('Profissional não encontrado');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableTimes = async () => {
    try {
      const response = await axios.get(`${API}/public/available-times/${userId}?date=${bookingForm.date}`);
      setAvailableTimes(response.data.available_times);
    } catch (error) {
      console.error('Erro ao carregar horários disponíveis:', error);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/appointments/public/${userId}`, bookingForm);
      toast.success('Agendamento solicitado com sucesso! Aguarde a confirmação.');
      setBookingForm({
        client_name: '',
        client_phone: '',
        service_id: '',
        date: '',
        time: '',
        notes: ''
      });
    } catch (error) {
      toast.error('Erro ao solicitar agendamento');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen booking-bg-${theme} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`booking-text-${theme}`}>Carregando informações...</p>
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className={`min-h-screen booking-bg-${theme} flex items-center justify-center`}>
        <Card className={`max-w-md mx-auto booking-card-${theme}`}>
          <CardContent className="text-center pt-6">
            <h2 className={`text-xl font-semibold booking-error-title-${theme} mb-2`}>Profissional não encontrado</h2>
            <p className={`booking-error-text-${theme}`}>Verifique o link e tente novamente.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen booking-bg-${theme}`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className={`border-0 shadow-2xl booking-main-card-${theme}`}>
          <CardHeader className="text-center bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">{professional.business_name}</CardTitle>
            <CardDescription className="text-emerald-100">
              Agendar com {professional.name}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="client_name" className={`booking-label-${theme}`}>Seu Nome</Label>
                  <Input
                    id="client_name"
                    placeholder="Nome completo"
                    value={bookingForm.client_name}
                    onChange={(e) => setBookingForm({...bookingForm, client_name: e.target.value})}
                    required
                    className={`booking-input-${theme}`}
                    data-testid="booking-name-input"
                  />
                </div>

                <div>
                  <Label htmlFor="client_phone" className={`booking-label-${theme}`}>WhatsApp</Label>
                  <Input
                    id="client_phone"
                    placeholder="(11) 99999-9999"
                    value={bookingForm.client_phone}
                    onChange={(e) => setBookingForm({...bookingForm, client_phone: e.target.value})}
                    required
                    className={`booking-input-${theme}`}
                    data-testid="booking-phone-input"
                  />
                </div>

                <div>
                  <Label htmlFor="service_id" className={`booking-label-${theme}`}>Serviço Desejado</Label>
                  <Select
                    value={bookingForm.service_id}
                    onValueChange={(value) => setBookingForm({...bookingForm, service_id: value})}
                    required
                  >
                    <SelectTrigger className={`booking-select-${theme}`} data-testid="booking-service-select">
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - R$ {service.price.toFixed(2)} ({service.duration_minutes}min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date" className={`booking-label-${theme}`}>Data Preferida</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value, time: ''})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className={`booking-input-${theme}`}
                    data-testid="booking-date-input"
                  />
                </div>

                {bookingForm.date && (
                  <div>
                    <Label htmlFor="time" className={`booking-label-${theme}`}>Horário Preferido</Label>
                    <Select
                      value={bookingForm.time}
                      onValueChange={(value) => setBookingForm({...bookingForm, time: value})}
                      required
                    >
                      <SelectTrigger className={`booking-select-${theme}`} data-testid="booking-time-select">
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="notes" className={`booking-label-${theme}`}>Observações (Opcional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Alguma informação adicional?"
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                    className={`booking-textarea-${theme}`}
                    data-testid="booking-notes-input"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white py-3 text-lg"
                disabled={!bookingForm.time}
                data-testid="submit-booking-btn"
              >
                Solicitar Agendamento
              </Button>
            </form>

            <div className={`mt-6 p-4 booking-warning-${theme} rounded-lg border`}>
              <p className={`text-sm booking-warning-text-${theme} text-center`}>
                <strong>Importante:</strong> Seu agendamento será enviado para análise. 
                Aguarde a confirmação via WhatsApp no número informado.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
    
    // Check if it's a booking URL
    const path = window.location.pathname;
    if (path.startsWith('/booking/')) {
      setCurrentView('booking');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('landing');
  };

  const handleShowAuth = () => {
    setCurrentView('auth');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="App">
          {currentView === 'landing' && (
            <LandingPage onShowAuth={handleShowAuth} />
          )}
          
          {currentView === 'auth' && (
            <AuthComponent 
              onLoginSuccess={handleLoginSuccess}
              onBack={handleBackToLanding}
            />
          )}
          
          {currentView === 'dashboard' && user && (
            <Dashboard 
              user={user}
              onLogout={handleLogout}
            />
          )}
          
          {currentView === 'booking' && (
            <BookingPage />
          )}
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;