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

// Landing Page Component
const LandingPage = ({ onShowAuth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
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
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-cyan-700 to-blue-700 bg-clip-text text-transparent leading-tight">
          Gerencie seu Negócio de Estética
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
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
        <h2 className="text-4xl font-bold text-center mb-16 text-slate-800">
          Funcionalidades Principais
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <CardTitle className="text-xl text-slate-800">Agendamento Online</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Link personalizado para seus clientes agendarem serviços diretamente. Aceite, recuse ou remarque com facilidade.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <CardTitle className="text-xl text-slate-800">Controle Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Registre entradas e saídas, acompanhe seu balanço em tempo real com filtros por período e categoria.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <CardTitle className="text-xl text-slate-800">Gestão de Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Cadastre seus serviços, defina preços, duração e categorias. Mantenha seu catálogo sempre organizado.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-slate-600"
              data-testid="auth-back-btn"
            >
              ← Voltar
            </Button>
          </div>
          <CardTitle className="text-2xl text-center text-slate-800">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </CardTitle>
          <CardDescription className="text-center text-slate-600">
            {isLogin ? 'Acesse sua conta' : 'Cadastre-se no BeautyPro'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required={!isLogin}
                    data-testid="auth-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="business_name">Nome do Negócio</Label>
                  <Input
                    id="business_name"
                    type="text"
                    placeholder="Nome do seu salão/estúdio"
                    value={formData.business_name}
                    onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                    required={!isLogin}
                    data-testid="auth-business-input"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required={!isLogin}
                    data-testid="auth-phone-input"
                  />
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                data-testid="auth-email-input"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
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

// Dashboard Component
const Dashboard = ({ user, onLogout }) => {
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
    category: 'service'
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
      await axios.post(`${API}/services`, {
        ...serviceForm,
        price: parseFloat(serviceForm.price),
        duration_minutes: parseInt(serviceForm.duration_minutes)
      });
      
      toast.success('Serviço criado com sucesso!');
      setServiceForm({ name: '', description: '', price: '', duration_minutes: '', category: 'service' });
      loadDashboardData();
    } catch (error) {
      toast.error('Erro ao criar serviço');
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

  const getBookingLink = () => {
    return `${window.location.origin}/booking/${user.id}`;
  };

  const copyBookingLink = () => {
    navigator.clipboard.writeText(getBookingLink());
    toast.success('Link de agendamento copiado!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">✨</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{user.business_name}</h1>
              <p className="text-sm text-slate-600">Olá, {user.name}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={onLogout}
            className="text-slate-600 hover:text-slate-800"
            data-testid="dashboard-logout-btn"
          >
            Sair
          </Button>
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
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="text-lg text-amber-800">Link de Agendamento</CardTitle>
            <CardDescription className="text-amber-700">
              Compartilhe este link com seus clientes para agendamentos online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                value={getBookingLink()} 
                readOnly 
                className="bg-white border-amber-200"
                data-testid="booking-link-input"
              />
              <Button 
                onClick={copyBookingLink}
                variant="outline"
                className="border-amber-500 text-amber-700 hover:bg-amber-100"
                data-testid="copy-booking-link-btn"
              >
                Copiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid grid-cols-4 bg-white shadow-sm border border-slate-200">
            <TabsTrigger value="services" data-testid="services-tab">Serviços</TabsTrigger>
            <TabsTrigger value="financial" data-testid="financial-tab">Financeiro</TabsTrigger>
            <TabsTrigger value="appointments" data-testid="appointments-tab">Agendamentos</TabsTrigger>
            <TabsTrigger value="reports" data-testid="reports-tab">Relatórios</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Cadastrar Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateService} className="space-y-4">
                    <Input
                      placeholder="Nome do serviço"
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
                    <Input
                      type="number"
                      placeholder="Duração (minutos)"
                      value={serviceForm.duration_minutes}
                      onChange={(e) => setServiceForm({...serviceForm, duration_minutes: e.target.value})}
                      required
                      data-testid="service-duration-input"
                    />
                    <Select
                      value={serviceForm.category}
                      onValueChange={(value) => setServiceForm({...serviceForm, category: value})}
                    >
                      <SelectTrigger data-testid="service-category-select">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">Serviço</SelectItem>
                        <SelectItem value="product">Produto</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      type="submit" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      data-testid="create-service-btn"
                    >
                      Cadastrar Serviço
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Meus Serviços ({services.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {services.map((service) => (
                      <div 
                        key={service.id} 
                        className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                        data-testid={`service-item-${service.id}`}
                      >
                        <div>
                          <h4 className="font-medium text-slate-800">{service.name}</h4>
                          <p className="text-sm text-slate-600">
                            R$ {service.price.toFixed(2)} • {service.duration_minutes}min
                          </p>
                        </div>
                        <Badge variant="secondary">{service.category}</Badge>
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
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Novo Lançamento</CardTitle>
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

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Últimos Lançamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {financialEntries.slice(0, 10).map((entry) => (
                      <div 
                        key={entry.id} 
                        className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                        data-testid={`financial-entry-${entry.id}`}
                      >
                        <div>
                          <h4 className="font-medium text-slate-800">{entry.description}</h4>
                          <p className="text-sm text-slate-600">{entry.category} • {entry.date}</p>
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
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Agendamentos Pendentes ({appointments.filter(apt => apt.status === 'pending').length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.filter(apt => apt.status === 'pending').map((appointment) => (
                    <Card key={appointment.id} className="bg-amber-50 border-amber-200" data-testid={`appointment-${appointment.id}`}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-slate-800">{appointment.client_name}</h4>
                            <p className="text-sm text-slate-600">{appointment.client_phone}</p>
                            <p className="text-sm text-slate-600">{appointment.service_name}</p>
                            <p className="text-sm text-slate-600">{appointment.date} às {appointment.time}</p>
                          </div>
                          <Badge variant="outline" className="border-amber-500 text-amber-700">
                            Pendente
                          </Badge>
                        </div>
                        <div className="flex gap-2">
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
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {appointments.filter(apt => apt.status === 'pending').length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      Nenhum agendamento pendente
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Confirmed Appointments */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Agendamentos Confirmados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.filter(apt => apt.status === 'confirmed').slice(0, 5).map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                      data-testid={`confirmed-appointment-${appointment.id}`}
                    >
                      <div>
                        <h4 className="font-medium text-slate-800">{appointment.client_name}</h4>
                        <p className="text-sm text-slate-600">{appointment.service_name}</p>
                        <p className="text-sm text-slate-600">{appointment.date} às {appointment.time}</p>
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
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
                <CardDescription>Visão geral das suas finanças</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-emerald-50 rounded-lg">
                    <div className="text-3xl font-bold text-emerald-600">R$ {balance.income.toFixed(2)}</div>
                    <div className="text-sm text-slate-600 mt-1">Total de Receitas</div>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">R$ {balance.expenses.toFixed(2)}</div>
                    <div className="text-sm text-slate-600 mt-1">Total de Despesas</div>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">R$ {balance.balance.toFixed(2)}</div>
                    <div className="text-sm text-slate-600 mt-1">Saldo Final</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Booking Page Component
const BookingPage = () => {
  const [professional, setProfessional] = useState(null);
  const [services, setServices] = useState([]);
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando informações...</p>
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center pt-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Profissional não encontrado</h2>
            <p className="text-slate-600">Verifique o link e tente novamente.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
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
                  <Label htmlFor="client_name">Seu Nome</Label>
                  <Input
                    id="client_name"
                    placeholder="Nome completo"
                    value={bookingForm.client_name}
                    onChange={(e) => setBookingForm({...bookingForm, client_name: e.target.value})}
                    required
                    data-testid="booking-name-input"
                  />
                </div>

                <div>
                  <Label htmlFor="client_phone">WhatsApp</Label>
                  <Input
                    id="client_phone"
                    placeholder="(11) 99999-9999"
                    value={bookingForm.client_phone}
                    onChange={(e) => setBookingForm({...bookingForm, client_phone: e.target.value})}
                    required
                    data-testid="booking-phone-input"
                  />
                </div>

                <div>
                  <Label htmlFor="service_id">Serviço Desejado</Label>
                  <Select
                    value={bookingForm.service_id}
                    onValueChange={(value) => setBookingForm({...bookingForm, service_id: value})}
                    required
                  >
                    <SelectTrigger data-testid="booking-service-select">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Data Preferida</Label>
                    <Input
                      id="date"
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      data-testid="booking-date-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Horário Preferido</Label>
                    <Input
                      id="time"
                      type="time"
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                      required
                      data-testid="booking-time-input"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Observações (Opcional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Alguma informação adicional?"
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                    data-testid="booking-notes-input"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white py-3 text-lg"
                data-testid="submit-booking-btn"
              >
                Solicitar Agendamento
              </Button>
            </form>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800 text-center">
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

  if (currentView === 'booking') {
    return (
      <BrowserRouter>
        <BookingPage />
      </BrowserRouter>
    );
  }

  return (
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
      </div>
    </BrowserRouter>
  );
}

export default App;