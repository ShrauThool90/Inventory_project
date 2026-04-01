import React, { useState } from 'react';
import { AlertCircle, Plus, Minus } from 'lucide-react';

export default function InventoryTable({ components, onUpdateQuantity }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (component) => {
    setEditingId(component.id);
    setEditValue(component.quantity.toString());
  };

  const handleSave = async (componentId) => {
    const value = parseFloat(editValue);
    if (!isNaN(value) && value >= 0) {
      await onUpdateQuantity(componentId, value);
    }
    setEditingId(null);
  };

  const handleIncrement = (component) => {
    onUpdateQuantity(component.id, component.quantity + 1);
  };

  const handleDecrement = (component) => {
    if (component.quantity > 0) {
      onUpdateQuantity(component.id, component.quantity - 1);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', color: '#A33022', bgColor: '#FAECEB' };
    if (quantity < 40) return { label: 'Low Stock', color: '#B36B00', bgColor: '#FDF3E1' };
    return { label: 'In Stock', color: '#2B593F', bgColor: '#E8F0EA' };
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden" style={{ borderColor: '#E2E2D9' }}>
      <div className="p-6 border-b" style={{ borderColor: '#E2E2D9' }}>
        <h2 className="text-xl sm:text-2xl font-medium tracking-tight" style={{ color: '#1E231D', fontFamily: 'Outfit, sans-serif' }}>
          Inventory Components
        </h2>
        <p className="text-sm mt-1" style={{ color: '#596157' }}>Manage stock levels and track component availability</p>
      </div>

      <div className="overflow-x-auto" data-testid="inventory-table">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-y" style={{ backgroundColor: '#F0F0E8', borderColor: '#E2E2D9' }}>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#596157' }}>Item Name</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#596157' }}>Category</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#596157' }}>Unit</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#596157' }}>Quantity</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#596157' }}>Status</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#596157' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.map((component) => {
              const status = getStockStatus(component.quantity);
              return (
                <tr 
                  key={component.id} 
                  className="border-b transition-colors duration-150"
                  style={{ borderColor: '#E2E2D9' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F9F7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  data-testid={`row-${component.id}`}
                >
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1E231D' }}>
                    {component.name}
                    {component.quantity === 0 && (
                      <AlertCircle className="inline-block ml-2 w-4 h-4" style={{ color: '#A33022' }} />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#596157' }}>{component.category}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#596157' }}>{component.unit}</td>
                  <td className="px-4 py-3">
                    {editingId === component.id ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(component.id)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSave(component.id)}
                        className="w-24 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{ 
                          backgroundColor: '#FFFFFF', 
                          borderColor: '#E2E2D9',
                          color: '#1E231D'
                        }}
                        autoFocus
                        data-testid={`input-${component.id}`}
                      />
                    ) : (
                      <span 
                        onClick={() => handleEdit(component)}
                        className="cursor-pointer text-sm font-medium px-3 py-2 rounded-lg inline-block transition-colors"
                        style={{ 
                          color: component.quantity === 0 ? '#A33022' : '#1E231D',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#F5F5F0'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        data-testid={`quantity-${component.id}`}
                      >
                        {component.quantity}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: status.bgColor, color: status.color }}
                      data-testid={`status-${component.id}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecrement(component)}
                        className="p-1.5 rounded-lg border transition-all shadow-sm"
                        style={{ 
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E2E2D9',
                          color: '#1E231D'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#F5F5F0';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#FFFFFF';
                          e.target.style.transform = 'translateY(0)';
                        }}
                        data-testid={`decrement-${component.id}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleIncrement(component)}
                        className="p-1.5 rounded-lg transition-all shadow-sm"
                        style={{ 
                          backgroundColor: '#3A5C45',
                          color: '#FFFFFF'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#2D4836';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#3A5C45';
                          e.target.style.transform = 'translateY(0)';
                        }}
                        data-testid={`increment-${component.id}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
