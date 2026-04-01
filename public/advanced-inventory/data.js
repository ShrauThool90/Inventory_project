// Enhanced Inventory Data with Usage Tracking
const INITIAL_INVENTORY = [
    { id: 'comp_1', name: 'Connector MC-4', unit: 'Set', quantity: 200, category: 'Electrical' },
    { id: 'comp_2', name: 'Bitumen Tape', unit: 'Nos', quantity: 200, category: 'Accessories' },
    { id: 'comp_3', name: 'Teflon Tape', unit: 'Nos', quantity: 200, category: 'Accessories' },
    { id: 'comp_4', name: 'PVC Insulation Tape', unit: 'Nos', quantity: 200, category: 'Accessories' },
    { id: 'comp_5', name: 'Cable Red (4 sq mm)', unit: 'Mtr', quantity: 200, category: 'Electrical' },
    { id: 'comp_6', name: 'Cable Black (4 sq mm)', unit: 'Mtr', quantity: 200, category: 'Electrical' },
    { id: 'comp_7', name: 'Flat Cable (3CX 2.5 sq mm)', unit: 'Mtr', quantity: 200, category: 'Electrical' },
    { id: 'comp_8', name: 'Earthing Cable', unit: 'Nos', quantity: 200, category: 'Electrical' },
    { id: 'comp_9', name: 'Lightning Arrestor', unit: 'Set', quantity: 200, category: 'Safety' },
    { id: 'comp_10', name: 'Arrestor Spike', unit: 'Set', quantity: 200, category: 'Safety' },
    { id: 'comp_11', name: 'Arrestor Rod 14mm', unit: 'Nos', quantity: 200, category: 'Safety' },
    { id: 'comp_12', name: 'Earthing Rod', unit: 'Set', quantity: 200, category: 'Safety' },
    { id: 'comp_13', name: 'GI Pipe', unit: 'Nos', quantity: 200, category: 'Plumbing' },
    { id: 'comp_14', name: 'Earthing Patti', unit: 'Nos', quantity: 200, category: 'Safety' },
    { id: 'comp_15', name: 'Earthing Pit', unit: 'Nos', quantity: 200, category: 'Safety' },
    { id: 'comp_16', name: 'HDPE Pipe 63mm', unit: 'Mtr', quantity: 200, category: 'Plumbing' },
    { id: 'comp_17', name: 'HDPE Pipe 75mm', unit: 'Mtr', quantity: 200, category: 'Plumbing' },
    { id: 'comp_18', name: 'Cable Tie', unit: 'Pkt', quantity: 200, category: 'Accessories' },
    { id: 'comp_19', name: '35mm Sleeve', unit: 'Mtr', quantity: 200, category: 'Accessories' },
    { id: 'comp_20', name: 'SS Nipple 2"', unit: 'Nos', quantity: 200, category: 'Plumbing' },
    { id: 'comp_21', name: 'PP Rope 12mm', unit: 'Mtr', quantity: 200, category: 'Accessories' },
    { id: 'comp_22', name: '6 sq mm Ring Lugs', unit: 'Nos', quantity: 200, category: 'Electrical' },
    { id: 'comp_23', name: 'Hose Clamp 2"', unit: 'Nos', quantity: 200, category: 'Plumbing' },
    { id: 'comp_24', name: 'M6 x 50 Nut & Bolt', unit: 'Nos', quantity: 200, category: 'Hardware' },
    { id: 'comp_25', name: 'M8 x 75 Nut & Bolt', unit: 'Nos', quantity: 200, category: 'Hardware' },
    { id: 'comp_26', name: 'Chemical Bag (5kg)', unit: 'Bag', quantity: 200, category: 'Accessories' }
];

// Motor Requirements from PDFs
const MOTOR_REQUIREMENTS = {
    '3HP': [
        { componentId: 'comp_1', componentName: 'Connector MC-4', required: 4 },
        { componentId: 'comp_2', componentName: 'Bitumen Tape', required: 1 },
        { componentId: 'comp_3', componentName: 'Teflon Tape', required: 1 },
        { componentId: 'comp_4', componentName: 'PVC Insulation Tape', required: 1 },
        { componentId: 'comp_5', componentName: 'Cable Red (4 sq mm)', required: 4 },
        { componentId: 'comp_6', componentName: 'Cable Black (4 sq mm)', required: 4 },
        { componentId: 'comp_7', componentName: 'Flat Cable (3CX 2.5 sq mm)', required: 30 },
        { componentId: 'comp_8', componentName: 'Earthing Cable', required: 1 },
        { componentId: 'comp_9', componentName: 'Lightning Arrestor', required: 1 },
        { componentId: 'comp_12', componentName: 'Earthing Rod', required: 2 },
        { componentId: 'comp_15', componentName: 'Earthing Pit', required: 2 },
        { componentId: 'comp_16', componentName: 'HDPE Pipe 63mm', required: 30 },
        { componentId: 'comp_18', componentName: 'Cable Tie', required: 1 },
        { componentId: 'comp_19', componentName: '35mm Sleeve', required: 8 },
        { componentId: 'comp_20', componentName: 'SS Nipple 2"', required: 1 },
        { componentId: 'comp_21', componentName: 'PP Rope 12mm', required: 35 },
        { componentId: 'comp_22', componentName: '6 sq mm Ring Lugs', required: 4 },
        { componentId: 'comp_23', componentName: 'Hose Clamp 2"', required: 1 },
        { componentId: 'comp_24', componentName: 'M6 x 50 Nut & Bolt', required: 3 },
        { componentId: 'comp_25', componentName: 'M8 x 75 Nut & Bolt', required: 1 },
        { componentId: 'comp_26', componentName: 'Chemical Bag (5kg)', required: 2 }
    ],
    '5HP': [
        { componentId: 'comp_1', componentName: 'Connector MC-4', required: 4 },
        { componentId: 'comp_2', componentName: 'Bitumen Tape', required: 1 },
        { componentId: 'comp_3', componentName: 'Teflon Tape', required: 1 },
        { componentId: 'comp_4', componentName: 'PVC Insulation Tape', required: 1 },
        { componentId: 'comp_5', componentName: 'Cable Red (4 sq mm)', required: 5 },
        { componentId: 'comp_6', componentName: 'Cable Black (4 sq mm)', required: 5 },
        { componentId: 'comp_8', componentName: 'Earthing Cable', required: 1 },
        { componentId: 'comp_10', componentName: 'Arrestor Spike', required: 1 },
        { componentId: 'comp_11', componentName: 'Arrestor Rod 14mm', required: 1 },
        { componentId: 'comp_12', componentName: 'Earthing Rod', required: 2 },
        { componentId: 'comp_13', componentName: 'GI Pipe', required: 1 },
        { componentId: 'comp_14', componentName: 'Earthing Patti', required: 1 },
        { componentId: 'comp_15', componentName: 'Earthing Pit', required: 2 },
        { componentId: 'comp_17', componentName: 'HDPE Pipe 75mm', required: 30 },
        { componentId: 'comp_18', componentName: 'Cable Tie', required: 1 },
        { componentId: 'comp_19', componentName: '35mm Sleeve', required: 10 },
        { componentId: 'comp_20', componentName: 'SS Nipple 2"', required: 1 },
        { componentId: 'comp_21', componentName: 'PP Rope 12mm', required: 35 },
        { componentId: 'comp_22', componentName: '6 sq mm Ring Lugs', required: 2 },
        { componentId: 'comp_23', componentName: 'Hose Clamp 2"', required: 1 },
        { componentId: 'comp_24', componentName: 'M6 x 50 Nut & Bolt', required: 2 },
        { componentId: 'comp_25', componentName: 'M8 x 75 Nut & Bolt', required: 1 },
        { componentId: 'comp_26', componentName: 'Chemical Bag (5kg)', required: 1 }
    ],
    '7.5HP': [
        { componentId: 'comp_1', componentName: 'Connector MC-4', required: 4 },
        { componentId: 'comp_2', componentName: 'Bitumen Tape', required: 1 },
        { componentId: 'comp_3', componentName: 'Teflon Tape', required: 1 },
        { componentId: 'comp_4', componentName: 'PVC Insulation Tape', required: 1 },
        { componentId: 'comp_5', componentName: 'Cable Red (4 sq mm)', required: 13 },
        { componentId: 'comp_6', componentName: 'Cable Black (4 sq mm)', required: 13 },
        { componentId: 'comp_8', componentName: 'Earthing Cable', required: 1 },
        { componentId: 'comp_10', componentName: 'Arrestor Spike', required: 1 },
        { componentId: 'comp_11', componentName: 'Arrestor Rod 14mm', required: 1 },
        { componentId: 'comp_12', componentName: 'Earthing Rod', required: 2 },
        { componentId: 'comp_13', componentName: 'GI Pipe', required: 1 },
        { componentId: 'comp_14', componentName: 'Earthing Patti', required: 1 },
        { componentId: 'comp_15', componentName: 'Earthing Pit', required: 2 },
        { componentId: 'comp_17', componentName: 'HDPE Pipe 75mm', required: 50 },
        { componentId: 'comp_18', componentName: 'Cable Tie', required: 1 },
        { componentId: 'comp_19', componentName: '35mm Sleeve', required: 26 },
        { componentId: 'comp_20', componentName: 'SS Nipple 2"', required: 1 },
        { componentId: 'comp_21', componentName: 'PP Rope 12mm', required: 55 },
        { componentId: 'comp_22', componentName: '6 sq mm Ring Lugs', required: 2 },
        { componentId: 'comp_23', componentName: 'Hose Clamp 2"', required: 1 },
        { componentId: 'comp_24', componentName: 'M6 x 50 Nut & Bolt', required: 2 },
        { componentId: 'comp_25', componentName: 'M8 x 75 Nut & Bolt', required: 1 },
        { componentId: 'comp_26', componentName: 'Chemical Bag (5kg)', required: 1 }
    ]
};

// Get inventory from localStorage
function getInventory() {
    const stored = localStorage.getItem('solarInventoryV2');
    if (stored) {
        return JSON.parse(stored);
    }
    return JSON.parse(JSON.stringify(INITIAL_INVENTORY));
}

// Save inventory
function saveInventory(inventory) {
    localStorage.setItem('solarInventoryV2', JSON.stringify(inventory));
}

// Reset inventory
function resetInventory() {
    const fresh = JSON.parse(JSON.stringify(INITIAL_INVENTORY));
    localStorage.setItem('solarInventoryV2', JSON.stringify(fresh));
    return fresh;
}
