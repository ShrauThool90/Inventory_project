import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Zap, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import InventoryTable from '../components/InventoryTable';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MOTOR_TYPE = '7.5HP';

export default function SevenHalfHP() {
  const [components, setComponents] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [maxProduction, setMaxProduction] = useState(0);
  const [criticalComponent, setCriticalComponent] = useState(null);
  const [withdrawQty, setWithdrawQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [componentsRes, requirementsRes, maxProdRes] = await Promise.all([
        axios.get(`${API}/components`),
        axios.get(`${API}/motor-requirements`),
        axios.get(`${API}/calculate-max-production`)
      ]);
      
      setComponents(componentsRes.data);
      const motorReqs = requirementsRes.data.filter(r => r.motor_type === MOTOR_TYPE);
      setRequirements(motorReqs);
      setMaxProduction(maxProdRes.data.production[MOTOR_TYPE] || 0);
      setCriticalComponent(maxProdRes.data.critical_components[MOTOR_TYPE]);
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

  const handleWithdraw = async () => {
    if (withdrawQty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (withdrawQty > maxProduction) {
      toast.error(`Cannot produce ${withdrawQty} motors. Maximum capacity: ${maxProduction}`);
      return;
    }

    try {
      const response = await axios.post(`${API}/withdraw`, {
        motor_type: MOTOR_TYPE,
        quantity: withdrawQty
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setWithdrawQty(1);
        await fetchData();
      } else {
        const shortage = response.data.insufficient_components
          .map(comp => `${comp.component}: need ${comp.shortage.toFixed(1)} more`)
          .join(', ');
        toast.error(`Insufficient stock: ${shortage}`);
      }
    } catch (error) {
      console.error('Error withdrawing:', error);
      toast.error('Failed to withdraw components');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F0' }}>
        <p style={{ color: '#596157' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F0', fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <header className="border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E2D9' }}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#ffebee' }}>
              <Zap className="w-6 h-6" style={{ color: '#e74c3c' }} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold" style={{ color: '#1E231D', fontFamily: 'Outfit, sans-serif' }}>7.5HP Motor System</h1>
              <p className="text-sm" style={{ color: '#596157' }}>Component Requirements & Production Management</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-lg font-medium" style={{ backgroundColor: '#f8f9fa', color: '#2c3e50' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Production Card */}
        <div className="bg-white border rounded-xl shadow-sm p-6 mb-8" style={{ borderColor: '#E2E2D9' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span className="inline-block px-6 py-2 rounded-full font-bold" style={{ background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white' }}>7.5HP</span>
              <span className="ml-3">Production Capacity</span>
            </h2>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl font-bold mb-2" style={{ color: maxProduction === 0 ? '#e74c3c' : '#27ae60' }}>{maxProduction}</div>
            <p className="text-lg" style={{ color: '#7f8c8d' }}>Maximum motors that can be produced</p>
          </div>

          {maxProduction === 0 && (
            <div className="p-4 rounded-lg border-l-4 mb-6" style={{ backgroundColor: '#f8d7da', borderColor: '#e74c3c', color: '#721c24' }}>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <strong>🚨 Production Halted!</strong>
              </div>
              <p className="text-sm mt-1">Cannot produce any motors. Some components are out of stock.</p>
            </div>
          )}

          {criticalComponent && maxProduction > 0 && (
            <div className="p-4 rounded-lg border-l-4 mb-6" style={{ backgroundColor: '#fff3cd', borderColor: '#f39c12', color: '#856404' }}>
              <strong>🎯 Critical Component:</strong> {criticalComponent}<br />
              <p className="text-sm mt-1">This component is limiting your production capacity. Restock it to increase production.</p>
            </div>
          )}

          {/* Withdraw Form */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#f8f9fa' }}>
            <label className="block text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#596157' }}>Enter Quantity to Produce:</label>
            <div className="flex gap-3">
              <input
                type="number"
                value={withdrawQty}
                onChange={(e) => setWithdrawQty(parseInt(e.target.value) || 0)}
                className="flex-1 px-4 py-3 border-2 rounded-lg text-center font-medium text-lg"
                style={{ borderColor: '#E2E2D9' }}
                min="1"
                max={maxProduction}
              />
              <button
                onClick={handleWithdraw}
                disabled={withdrawQty <= 0 || withdrawQty > maxProduction}
                className="px-8 py-3 rounded-lg font-semibold"
                style={{
                  background: withdrawQty > 0 && withdrawQty <= maxProduction ? 'linear-gradient(135deg, #27ae60 0%, #229954 100%)' : '#dfe6e9',
                  color: withdrawQty > 0 && withdrawQty <= maxProduction ? 'white' : '#636e72',
                  cursor: withdrawQty > 0 && withdrawQty <= maxProduction ? 'pointer' : 'not-allowed'
                }}
              >
                🚀 Withdraw Components
              </button>
            </div>
          </div>
        </div>

        {/* Requirements Table */}
        <div className="bg-white border rounded-xl shadow-sm p-6 mb-8" style={{ borderColor: '#E2E2D9' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>📝 Component Requirements (Per Motor)</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-y" style={{ backgroundColor: '#34495e', borderColor: '#2c3e50', color: 'white' }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Component Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Required Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Available</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Can Produce</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req) => {
                  const component = components.find(c => c.id === req.component_id);
                  if (!component) return null;
                  
                  const canProduce = Math.floor(component.quantity / req.required_quantity);
                  const isCritical = component.name === criticalComponent;
                  const bgColor = component.quantity === 0 ? '#ffe6e6' : canProduce === maxProduction ? '#fff9e6' : 'transparent';
                  
                  return (
                    <tr key={req.component_id} className="border-b" style={{ borderColor: '#E2E2D9', backgroundColor: bgColor }}>
                      <td className="px-4 py-3 font-medium">
                        {req.component_name} {isCritical && <span className="ml-2">🎯</span>}
                      </td>
                      <td className="px-4 py-3"><strong>{req.required_quantity}</strong> {component.unit}</td>
                      <td className="px-4 py-3">{component.quantity.toFixed(1)} {component.unit}</td>
                      <td className="px-4 py-3">
                        <strong style={{ color: canProduce === 0 ? '#e74c3c' : '#27ae60' }}>{canProduce}</strong> motors
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                          backgroundColor: component.quantity === 0 ? '#f8d7da' : component.quantity < 10 ? '#fff3cd' : '#d4edda',
                          color: component.quantity === 0 ? '#721c24' : component.quantity < 10 ? '#856404' : '#155724'
                        }}>
                          {component.quantity === 0 ? 'Critical' : component.quantity < 10 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Full Inventory */}
        <InventoryTable components={components} onUpdateQuantity={updateComponentQuantity} />
      </div>
    </div>
  );
}
