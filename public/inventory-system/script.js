// Global inventory state
let inventory = getInventory();

// Calculate max production for a motor type
function calculateMaxProduction(motorType) {
    const requirements = MOTOR_REQUIREMENTS[motorType];
    if (!requirements) return { max: 0, critical: null };

    let maxProduction = Infinity;
    let criticalComponent = null;

    requirements.forEach(req => {
        const component = inventory.find(c => c.id === req.componentId);
        if (component) {
            const possible = Math.floor(component.quantity / req.required);
            if (possible < maxProduction) {
                maxProduction = possible;
                criticalComponent = component.name;
            }
        }
    });

    return {
        max: maxProduction === Infinity ? 0 : maxProduction,
        critical: criticalComponent
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

// Withdraw components for motor production
function withdrawComponents(motorType, quantity) {
    const requirements = MOTOR_REQUIREMENTS[motorType];
    if (!requirements) return { success: false, message: 'Invalid motor type' };

    // Check if sufficient stock
    const insufficient = [];
    requirements.forEach(req => {
        const component = inventory.find(c => c.id === req.componentId);
        if (component) {
            const needed = req.required * quantity;
            if (component.quantity < needed) {
                insufficient.push({
                    name: component.name,
                    needed: needed,
                    available: component.quantity,
                    shortage: needed - component.quantity
                });
            }
        }
    });

    if (insufficient.length > 0) {
        return {
            success: false,
            message: 'Insufficient stock',
            details: insufficient
        };
    }

    // Deduct components
    requirements.forEach(req => {
        const component = inventory.find(c => c.id === req.componentId);
        if (component) {
            component.quantity -= req.required * quantity;
        }
    });

    saveInventory(inventory);
    return {
        success: true,
        message: `Successfully withdrawn components for ${quantity} x ${motorType} motors`
    };
}

// Get dashboard statistics
function getDashboardStats() {
    const totalComponents = inventory.length;
    const totalStock = inventory.reduce((sum, c) => sum + c.quantity, 0);
    const lowStockItems = inventory.filter(c => c.quantity < 10);
    const criticalItems = inventory.filter(c => c.quantity === 0);

    const production3HP = calculateMaxProduction('3HP');
    const production5HP = calculateMaxProduction('5HP');
    const production75HP = calculateMaxProduction('7.5HP');

    return {
        totalComponents,
        totalStock,
        lowStockCount: lowStockItems.length,
        criticalCount: criticalItems.length,
        lowStockItems,
        criticalItems,
        production: {
            '3HP': production3HP,
            '5HP': production5HP,
            '7.5HP': production75HP
        }
    };
}

// Get stock status class
function getStockStatusClass(quantity) {
    if (quantity === 0) return 'critical';
    if (quantity < 10) return 'low';
    return 'normal';
}

// Get stock status text
function getStockStatusText(quantity) {
    if (quantity === 0) return 'Critical';
    if (quantity < 10) return 'Low Stock';
    return 'In Stock';
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Format number with commas
function formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
