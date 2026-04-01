import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, AlertCircle, CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import { toast } from 'sonner';
import InventoryTable from '../components/InventoryTable';
import MotorCard from '../components/MotorCard';
import FeasibilityChecker from '../components/FeasibilityChecker';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Dashboard() {
  const [components, setComponents] = useState([]);
  const [maxProduction, setMaxProduction] = useState({ '3HP': 0, '5HP': 0, '7.5HP': 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [componentsRes, maxProdRes] = await Promise.all([
        axios.get(`${API}/components`),
        axios.get(`${API}/calculate-max-production`)
      ]);
      setComponents(componentsRes.data);
      setMaxProduction(maxProdRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateComponentQuantity = async (componentId, newQuantity) => {
    try {
      await axios.put(`${API}/components/${componentId}`, {
        quantity: newQuantity
      });
      await fetchData();
      toast.success('Quantity updated');
    } catch (error) {
      console.error('Error updating component:', error);
      toast.error('Failed to update quantity');
    }
  };

  const handleWithdraw = async (motorType, quantity) => {
    try {
      const response = await axios.post(`${API}/withdraw`, {
        motor_type: motorType,
        quantity: quantity
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchData();
      } else {
        const shortage = response.data.insufficient_components
          .map(comp => `${comp.component}: need ${comp.shortage} more`)
          .join(', ');
        toast.error(`Insufficient stock: ${shortage}`);
      }
    } catch (error) {
      console.error('Error withdrawing:', error);
      toast.error('Failed to withdraw components');
    }
  };

  // Calculate stats
  const totalComponents = components.length;
  const lowStockCount = components.filter(c => c.quantity < 40).length;
  const totalValue = components.reduce((sum, c) => sum + c.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F0' }}>
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#3A5C45' }} />
          <p style={{ color: '#596157' }}>Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F0', fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Header */}
      <header className="border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E2D9' }}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#E8F0EA' }}>
                <Zap className="w-6 h-6" style={{ color: '#3A5C45' }} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight" style={{ color: '#1E231D', fontFamily: 'Outfit, sans-serif' }}>
                  Solar Pump Inventory
                </h1>
                <p className="text-sm mt-1" style={{ color: '#596157' }}>Balance of System Components Management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border rounded-xl shadow-sm p-6" style={{ borderColor: '#E2E2D9' }} data-testid="stat-total-components">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#596157' }}>Total Components</p>
                <p className="text-2xl font-semibold mt-2" style={{ color: '#1E231D' }}>{totalComponents}</p>
              </div>
              <Package className="w-8 h-8" style={{ color: '#3A5C45', opacity: 0.6 }} />
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-6" style={{ borderColor: '#E2E2D9' }} data-testid="stat-low-stock">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#596157' }}>Low Stock Items</p>
                <p className="text-2xl font-semibold mt-2" style={{ color: lowStockCount > 0 ? '#A33022' : '#1E231D' }}>{lowStockCount}</p>
              </div>
              <AlertCircle className="w-8 h-8" style={{ color: '#B36B00', opacity: 0.6 }} />
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-6" style={{ borderColor: '#E2E2D9' }} data-testid="stat-total-stock">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#596157' }}>Total Stock Units</p>
                <p className="text-2xl font-semibold mt-2" style={{ color: '#1E231D' }}>{totalValue.toFixed(0)}</p>
              </div>
              <TrendingUp className="w-8 h-8" style={{ color: '#2B593F', opacity: 0.6 }} />
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-6" style={{ borderColor: '#E2E2D9' }} data-testid="stat-max-production">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#596157' }}>Max Production (3HP)</p>
                <p className="text-2xl font-semibold mt-2" style={{ color: '#1E231D' }}>{maxProduction['3HP']}</p>
              </div>
              <CheckCircle2 className="w-8 h-8" style={{ color: '#2B593F', opacity: 0.6 }} />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inventory Table */}
          <div className="lg:col-span-8">
            <InventoryTable 
              components={components} 
              onUpdateQuantity={updateComponentQuantity}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Motor Production Cards */}
            <MotorCard 
              motorType="3HP"
              maxProduction={maxProduction['3HP']}
              onWithdraw={handleWithdraw}
            />
            
            <MotorCard 
              motorType="5HP"
              maxProduction={maxProduction['5HP']}
              onWithdraw={handleWithdraw}
            />
            
            <MotorCard 
              motorType="7.5HP"
              maxProduction={maxProduction['7.5HP']}
              onWithdraw={handleWithdraw}
            />

            {/* Feasibility Checker */}
            <FeasibilityChecker />
          </div>
        </div>
      </main>
    </div>
  );
}
