// Report Generation Functions

export function generateComprehensiveReport(motorType, components, requirements, maxProduction, criticalComponent, withdrawQty) {
  const timestamp = new Date().toLocaleString();
  const date = new Date().toISOString().split('T')[0];
  
  // Calculate all metrics
  const totalAvailable = components.reduce((sum, c) => sum + c.quantity, 0);
  const totalUsed = withdrawQty > 0 ? requirements.reduce((sum, req) => sum + (req.required_quantity * withdrawQty), 0) : 0;
  const totalRemaining = totalAvailable - totalUsed;
  
  // Identify shortages and low stock
  const shortages = [];
  const lowStock = [];
  
  requirements.forEach(req => {
    const comp = components.find(c => c.id === req.component_id);
    if (comp) {
      const needed = req.required_quantity * withdrawQty;
      if (comp.quantity < needed && withdrawQty > 0) {
        shortages.push({
          name: comp.name,
          available: comp.quantity,
          needed: needed,
          shortage: needed - comp.quantity
        });
      }
      if (comp.quantity < req.required_quantity) {
        lowStock.push({
          name: comp.name,
          available: comp.quantity,
          required: req.required_quantity
        });
      }
    }
  });
  
  const efficiency = totalAvailable > 0 ? ((totalUsed / totalAvailable) * 100).toFixed(2) : 0;
  
  // Build the report
  let report = '';
  
  // ========================================
  // HEADER
  // ========================================
  report += '═══════════════════════════════════════════════════════════════\n';
  report += '          SOLAR PUMP BOS INVENTORY MANAGEMENT SYSTEM\n';
  report += '           Production Analysis & Feasibility Report\n';
  report += '═══════════════════════════════════════════════════════════════\n\n';
  report += `Motor Type: ${motorType}\n`;
  report += `Report Generated: ${timestamp}\n`;
  report += `Production Quantity: ${withdrawQty} motors\n`;
  report += '───────────────────────────────────────────────────────────────\n\n';
  
  // ========================================
  // SUMMARY
  // ========================================
  report += '┌─────────────────────────────────────────────────────────────┐\n';
  report += '│                          SUMMARY                            │\n';
  report += '└─────────────────────────────────────────────────────────────┘\n\n';
  
  report += `Total Components: ${components.length}\n`;
  report += `Total Available Stock: ${totalAvailable.toFixed(2)} units\n`;
  report += `Total Stock to be Used: ${totalUsed.toFixed(2)} units\n`;
  report += `Remaining Stock: ${totalRemaining.toFixed(2)} units\n`;
  report += `Maximum Production Capacity: ${maxProduction} motors\n`;
  report += `Production Efficiency: ${efficiency}%\n`;
  report += `Production Status: ${shortages.length === 0 ? '✓ FEASIBLE' : '✗ NOT FEASIBLE'}\n`;
  report += `Shortage Components: ${shortages.length}\n`;
  report += `Low Stock Components: ${lowStock.length}\n\n`;
  
  // ========================================
  // COMPONENT TABLE
  // ========================================
  report += '┌─────────────────────────────────────────────────────────────┐\n';
  report += '│                     COMPONENT ANALYSIS                      │\n';
  report += '└─────────────────────────────────────────────────────────────┘\n\n';
  
  report += '─'.repeat(95) + '\n';
  report += `${'Component Name'.padEnd(30)} | ${'Required'.padEnd(10)} | ${'Available'.padEnd(10)} | ${'Used'.padEnd(10)} | ${'Remaining'.padEnd(10)} | ${'Can Produce'.padEnd(12)}\n`;
  report += '─'.repeat(95) + '\n';
  
  requirements.forEach(req => {
    const comp = components.find(c => c.id === req.component_id);
    if (comp) {
      const used = req.required_quantity * withdrawQty;
      const remaining = comp.quantity - used;
      const canProduce = Math.floor(comp.quantity / req.required_quantity);
      const isCritical = comp.name === criticalComponent ? ' ★' : '';
      
      report += `${(comp.name + isCritical).padEnd(30)} | `;
      report += `${(req.required_quantity + ' ' + comp.unit).padEnd(10)} | `;
      report += `${comp.quantity.toFixed(1).padEnd(10)} | `;
      report += `${used.toFixed(1).padEnd(10)} | `;
      report += `${remaining.toFixed(1).padEnd(10)} | `;
      report += `${canProduce.toString().padEnd(12)}\n`;
    }
  });
  report += '─'.repeat(95) + '\n\n';
  
  // ========================================
  // CRITICAL COMPONENT
  // ========================================
  report += '┌─────────────────────────────────────────────────────────────┐\n';
  report += '│                    CRITICAL COMPONENT                       │\n';
  report += '└─────────────────────────────────────────────────────────────┘\n\n';
  
  if (criticalComponent) {
    report += `★ CRITICAL COMPONENT: ${criticalComponent}\n\n`;
    report += `This component has the lowest production capacity and is limiting\n`;
    report += `the overall production. Priority should be given to restocking\n`;
    report += `this component to increase production capacity.\n\n`;
    report += `Impact: Production is capped at ${maxProduction} motors due to\n`;
    report += `this component's availability.\n\n`;
  } else {
    report += `No critical component identified.\n`;
    report += `All components have sufficient stock for production.\n\n`;
  }
  
  // ========================================
  // SHORTAGES
  // ========================================
  report += '┌─────────────────────────────────────────────────────────────┐\n';
  report += '│                         SHORTAGES                           │\n';
  report += '└─────────────────────────────────────────────────────────────┘\n\n';
  
  if (shortages.length > 0) {
    report += `⚠ ${shortages.length} COMPONENT(S) HAVE INSUFFICIENT STOCK\n\n`;
    report += `To produce ${withdrawQty} motors, the following components are short:\n\n`;
    
    shortages.forEach((item, index) => {
      report += `${index + 1}. ${item.name}\n`;
      report += `   Available: ${item.available.toFixed(2)}\n`;
      report += `   Required: ${item.needed.toFixed(2)}\n`;
      report += `   Shortage: ${item.shortage.toFixed(2)}\n\n`;
    });
    
    report += `ACTION REQUIRED: Production of ${withdrawQty} motors is NOT POSSIBLE\n`;
    report += `until the above components are restocked.\n\n`;
  } else {
    report += `✓ NO SHORTAGES DETECTED\n\n`;
    if (withdrawQty > 0) {
      report += `All components are available in sufficient quantity to produce\n`;
      report += `${withdrawQty} motors.\n\n`;
    } else {
      report += `Please enter production quantity to check for shortages.\n\n`;
    }
  }
  
  // ========================================
  // LOW STOCK
  // ========================================
  report += '┌─────────────────────────────────────────────────────────────┐\n';
  report += '│                         LOW STOCK                           │\n';
  report += '└─────────────────────────────────────────────────────────────┘\n\n';
  
  if (lowStock.length > 0) {
    report += `⚠ ${lowStock.length} COMPONENT(S) BELOW MINIMUM THRESHOLD\n\n`;
    report += `The following components cannot produce even 1 motor:\n\n`;
    
    lowStock.forEach((item, index) => {
      report += `${index + 1}. ${item.name}\n`;
      report += `   Available: ${item.available.toFixed(2)}\n`;
      report += `   Required (per motor): ${item.required.toFixed(2)}\n`;
      report += `   Status: ${item.available === 0 ? 'OUT OF STOCK' : 'CRITICALLY LOW'}\n\n`;
    });
    
    report += `WARNING: These components should be restocked immediately to\n`;
    report += `maintain production capability.\n\n`;
  } else {
    report += `✓ ALL COMPONENTS ABOVE MINIMUM THRESHOLD\n\n`;
    report += `All components have sufficient stock to produce at least 1 motor.\n\n`;
  }
  
  // ========================================
  // PRODUCTION ANALYSIS
  // ========================================
  report += '┌─────────────────────────────────────────────────────────────┐\n';
  report += '│                   PRODUCTION ANALYSIS                       │\n';
  report += '└─────────────────────────────────────────────────────────────┘\n\n';
  
  report += `Maximum Production Capacity: ${maxProduction} motors\n\n`;
  report += `Production Efficiency:\n`;
  report += `  - Resource Utilization: ${efficiency}%\n`;
  report += `  - Stock Usage: ${totalUsed.toFixed(2)} / ${totalAvailable.toFixed(2)} units\n`;
  report += `  - Remaining Stock: ${totalRemaining.toFixed(2)} units\n\n`;
  
  report += `Efficiency Rating:\n`;
  if (parseFloat(efficiency) < 30) {
    report += `  → LOW (< 30%) - Minimal resource utilization\n`;
    report += `     Good stock levels, low production stress\n\n`;
  } else if (parseFloat(efficiency) < 60) {
    report += `  → MODERATE (30-60%) - Balanced utilization\n`;
    report += `     Healthy production with adequate reserves\n\n`;
  } else if (parseFloat(efficiency) < 80) {
    report += `  → HIGH (60-80%) - Heavy utilization\n`;
    report += `     Monitor stock levels, plan restock soon\n\n`;
  } else {
    report += `  → CRITICAL (> 80%) - Very high utilization\n`;
    report += `     Immediate restocking required\n\n`;
  }
  
  report += `Feasibility Assessment:\n`;
  if (withdrawQty === 0) {
    report += `  → No production quantity specified\n`;
    report += `     Maximum capacity: ${maxProduction} motors\n\n`;
  } else if (withdrawQty > maxProduction) {
    report += `  → NOT FEASIBLE - Requested: ${withdrawQty}, Capacity: ${maxProduction}\n`;
    report += `     Exceeds maximum production capacity\n\n`;
  } else if (shortages.length > 0) {
    report += `  → NOT FEASIBLE - ${shortages.length} component shortage(s)\n`;
    report += `     Insufficient stock for requested quantity\n\n`;
  } else {
    report += `  → FEASIBLE ✓\n`;
    report += `     All components available for ${withdrawQty} motors\n\n`;
  }
  
  // ========================================
  // RECOMMENDATIONS
  // ========================================
  report += '┌─────────────────────────────────────────────────────────────┐\n';
  report += '│                     RECOMMENDATIONS                         │\n';
  report += '└─────────────────────────────────────────────────────────────┘\n\n';
  
  let recommendations = [];
  
  // Critical component recommendation
  if (criticalComponent) {
    recommendations.push(`1. PRIORITY RESTOCKING: Focus on "${criticalComponent}"\n   This is the bottleneck limiting production to ${maxProduction} motors.`);
  }
  
  // Shortage recommendations
  if (shortages.length > 0) {
    recommendations.push(`${recommendations.length + 1}. URGENT: Restock ${shortages.length} component(s) with shortages\n   Production cannot proceed until these are available.`);
  }
  
  // Low stock recommendations
  if (lowStock.length > 0) {
    recommendations.push(`${recommendations.length + 1}. WARNING: ${lowStock.length} component(s) below minimum threshold\n   Schedule restock to prevent future production halts.`);
  }
  
  // Efficiency recommendations
  if (parseFloat(efficiency) > 70) {
    recommendations.push(`${recommendations.length + 1}. HIGH UTILIZATION ALERT: ${efficiency}% stock usage\n   Plan for bulk restocking to maintain production continuity.`);
  }
  
  // Production optimization
  if (withdrawQty > 0 && withdrawQty <= maxProduction && shortages.length === 0) {
    recommendations.push(`${recommendations.length + 1}. PRODUCTION APPROVED: Proceed with ${withdrawQty} motors\n   All components available, production feasible.`);
  }
  
  // Safety stock recommendation
  const safetyStockNeeded = requirements.filter(req => {
    const comp = components.find(c => c.id === req.component_id);
    return comp && comp.quantity < (req.required_quantity * 5);
  }).length;
  
  if (safetyStockNeeded > 0) {
    recommendations.push(`${recommendations.length + 1}. SAFETY STOCK: ${safetyStockNeeded} component(s) below 5-motor buffer\n   Consider maintaining higher safety stock levels.`);
  }
  
  if (recommendations.length > 0) {
    recommendations.forEach(rec => {
      report += rec + '\n\n';
    });
  } else {
    report += `✓ All systems optimal\n`;
    report += `  - Sufficient stock levels\n`;
    report += `  - No immediate action required\n`;
    report += `  - Continue monitoring stock levels\n\n`;
  }
  
  // ========================================
  // CONCLUSION
  // ========================================
  report += '┌─────────────────────────────────────────────────────────────┐\n';
  report += '│                        CONCLUSION                           │\n';
  report += '└─────────────────────────────────────────────────────────────┘\n\n';
  
  if (shortages.length > 0) {
    report += `PRODUCTION STATUS: ✗ NOT FEASIBLE\n\n`;
    report += `The requested production of ${withdrawQty} ${motorType} motors CANNOT\n`;
    report += `proceed due to insufficient stock in ${shortages.length} component(s).\n\n`;
    report += `Required Action:\n`;
    report += `  → Restock shortage components immediately\n`;
    report += `  → Review and adjust production targets\n`;
    report += `  → Consider phased production based on availability\n\n`;
  } else if (withdrawQty > maxProduction) {
    report += `PRODUCTION STATUS: ✗ NOT FEASIBLE\n\n`;
    report += `The requested quantity (${withdrawQty} motors) EXCEEDS maximum\n`;
    report += `production capacity (${maxProduction} motors).\n\n`;
    report += `Required Action:\n`;
    report += `  → Reduce production quantity to ${maxProduction} or below\n`;
    report += `  → Restock critical component: ${criticalComponent}\n`;
    report += `  → Plan for phased production\n\n`;
  } else if (withdrawQty > 0) {
    report += `PRODUCTION STATUS: ✓ FEASIBLE\n\n`;
    report += `The production of ${withdrawQty} ${motorType} motors is FEASIBLE.\n`;
    report += `All required components are available in sufficient quantity.\n\n`;
    report += `Summary:\n`;
    report += `  ✓ ${totalUsed.toFixed(2)} units will be consumed\n`;
    report += `  ✓ ${totalRemaining.toFixed(2)} units will remain\n`;
    report += `  ✓ ${efficiency}% resource utilization\n`;
    if (lowStock.length > 0) {
      report += `  ⚠ ${lowStock.length} component(s) need future restocking\n`;
    }
    report += `\n`;
  } else {
    report += `SYSTEM STATUS: ✓ OPERATIONAL\n\n`;
    report += `Inventory system is ready for production planning.\n`;
    report += `Maximum capacity: ${maxProduction} ${motorType} motors\n\n`;
    if (lowStock.length > 0) {
      report += `Note: ${lowStock.length} component(s) below minimum threshold.\n`;
      report += `Consider restocking before starting production.\n\n`;
    }
  }
  
  report += '═══════════════════════════════════════════════════════════════\n';
  report += '                    END OF REPORT\n';
  report += '═══════════════════════════════════════════════════════════════\n';
  
  return report;
}

export function downloadReport(motorType, components, requirements, maxProduction, criticalComponent, withdrawQty) {
  const report = generateComprehensiveReport(
    motorType, 
    components, 
    requirements, 
    maxProduction, 
    criticalComponent, 
    withdrawQty
  );
  
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const date = new Date().toISOString().split('T')[0];
  const qty = withdrawQty > 0 ? `_${withdrawQty}motors` : '';
  link.download = `${motorType}_Production_Report_${date}${qty}.txt`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
