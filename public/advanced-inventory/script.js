// Global inventory
let inventory = getInventory();

// Calculate production analysis for a motor type
function analyzeProduction(motorType, useQuantity = 0) {
    const requirements = MOTOR_REQUIREMENTS[motorType];
    if (!requirements) return null;

    let maxProduction = Infinity;
    let criticalComponent = null;
    let totalAvailable = 0;
    let totalUsed = 0;
    let totalRemaining = 0;
    const componentAnalysis = [];
    const shortages = [];

    requirements.forEach(req => {
        const component = inventory.find(c => c.id === req.componentId);
        if (component) {
            const canProduce = Math.floor(component.quantity / req.required);
            const used = req.required * useQuantity;
            const remaining = component.quantity - used;
            const isShortage = remaining < 0;

            totalAvailable += component.quantity;
            totalUsed += used;
            totalRemaining += Math.max(0, remaining);

            if (canProduce < maxProduction) {
                maxProduction = canProduce;
                criticalComponent = component.name;
            }

            componentAnalysis.push({
                id: component.id,
                name: component.name,
                unit: component.unit,
                required: req.required,
                available: component.quantity,
                canProduce: canProduce,
                used: used,
                remaining: remaining,
                isShortage: isShortage,
                isLowStock: component.quantity < req.required,
                isCritical: canProduce === maxProduction
            });

            if (isShortage) {
                shortages.push({
                    name: component.name,
                    shortage: Math.abs(remaining)
                });
            }
        }
    });

    const efficiency = totalAvailable > 0 ? (totalUsed / totalAvailable) * 100 : 0;

    return {
        maxProduction: maxProduction === Infinity ? 0 : maxProduction,
        criticalComponent,
        componentAnalysis,
        shortages,
        totalAvailable,
        totalUsed,
        totalRemaining,
        efficiency: efficiency.toFixed(2),
        isPossible: shortages.length === 0
    };
}

// Update component quantity
function updateQuantity(componentId, newQuantity) {
    const component = inventory.find(c => c.id === componentId);
    if (component) {
        component.quantity = parseFloat(newQuantity) || 0;
        saveInventory(inventory);
        return true;
    }
    return false;
}

// Actually perform withdrawal (permanent)
function performWithdrawal(motorType, quantity) {
    const requirements = MOTOR_REQUIREMENTS[motorType];
    if (!requirements) return { success: false, message: 'Invalid motor type' };

    // Check if possible
    const analysis = analyzeProduction(motorType, quantity);
    if (!analysis.isPossible) {
        return {
            success: false,
            message: 'Insufficient stock',
            shortages: analysis.shortages
        };
    }

    // Perform withdrawal
    requirements.forEach(req => {
        const component = inventory.find(c => c.id === req.componentId);
        if (component) {
            component.quantity -= req.required * quantity;
        }
    });

    saveInventory(inventory);
    return {
        success: true,
        message: `Successfully produced ${quantity} x ${motorType} motors`
    };
}

// Generate CSV report
function generateCSVReport(motorType, analysis) {
    let csv = 'Component Name,Required Qty,Available,Can Produce,Used,Remaining,Status\n';
    
    analysis.componentAnalysis.forEach(comp => {
        const status = comp.isShortage ? 'SHORTAGE' : comp.isLowStock ? 'LOW STOCK' : 'OK';
        csv += `"${comp.name}",${comp.required},${comp.available},${comp.canProduce},${comp.used},${comp.remaining},${status}\n`;
    });

    csv += `\nSummary\n`;
    csv += `Motor Type,${motorType}\n`;
    csv += `Max Production,${analysis.maxProduction}\n`;
    csv += `Critical Component,${analysis.criticalComponent || 'None'}\n`;
    csv += `Total Available,${analysis.totalAvailable.toFixed(2)}\n`;
    csv += `Total Used,${analysis.totalUsed.toFixed(2)}\n`;
    csv += `Total Remaining,${analysis.totalRemaining.toFixed(2)}\n`;
    csv += `Efficiency,${analysis.efficiency}%\n`;
    csv += `Status,${analysis.isPossible ? 'POSSIBLE' : 'NOT POSSIBLE'}\n`;

    if (analysis.shortages.length > 0) {
        csv += `\nShortages\n`;
        analysis.shortages.forEach(s => {
            csv += `${s.name},${s.shortage.toFixed(2)}\n`;
        });
    }

    return csv;
}

// Download report
function downloadReport(motorType, analysis) {
    const csv = generateCSVReport(motorType, analysis);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${motorType}_Production_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Format number
function formatNumber(num) {
    return parseFloat(num).toFixed(2);
}
