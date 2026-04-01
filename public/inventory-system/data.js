// Inventory Data - Component definitions
const INITIAL_INVENTORY = [
    { id: 'comp_1', name: 'Connector MC-4', unit: 'Set', quantity: 200, category: 'Electrical' },
    { id: 'comp_2', name: 'Bitumen Tape', unit: 'Nos', quantity: 200, category: 'Accessories' },
    { id: 'comp_3', name: 'Teflon Tape', unit: 'Nos', quantity: 200, category: 'Accessories' },
    { id: 'comp_4', name: 'PVC Electrical Insulation Tape', unit: 'Nos', quantity: 200, category: 'Accessories' },
    { id: 'comp_5', name: 'Cable Red (4 sq mm)', unit: 'Mtr', quantity: 200, category: 'Electrical' },
    { id: 'comp_6', name: 'Cable Black (4 sq mm)', unit: 'Mtr', quantity: 200, category: 'Electrical' },
    { id: 'comp_7', name: 'Flat Cable (3CX 2.5 sq mm)', unit: 'Mtr', quantity: 200, category: 'Electrical' },
    { id: 'comp_8', name: 'Earthing Cable (1.5m)', unit: 'Nos', quantity: 200, category: 'Electrical' },
    { id: 'comp_9', name: 'Lightning Arrestor Assembly', unit: 'Set', quantity: 200, category: 'Safety' },
    { id: 'comp_10', name: 'Arrestor Spike', unit: 'Set', quantity: 200, category: 'Safety' },
    { id: 'comp_11', name: 'Arrestor Rod 14mm', unit: 'Nos', quantity: 200, category: 'Safety' },
    { id: 'comp_12', name: 'Earthing Rod (14mm x 1m)', unit: 'Set', quantity: 200, category: 'Safety' },
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
    { id: 'comp_24', name: 'M6 x 50 GI Nut & Bolt', unit: 'Nos', quantity: 200, category: 'Hardware' },
    { id: 'comp_25', name: 'M8 x 75 SS Nut & Bolt', unit: 'Nos', quantity: 200, category: 'Hardware' },
    { id: 'comp_26', name: 'Chemical Bag (5kg)', unit: 'Bag', quantity: 200, category: 'Accessories' }
];

// Motor Requirements - Based on PDF data
const MOTOR_REQUIREMENTS = {
    '3HP': [
        { componentId: 'comp_1', componentName: 'Connector MC-4', required: 4 },
        { componentId: 'comp_5', componentName: 'Cable Red (4 sq mm)', required: 4 },
        { componentId: 'comp_6', componentName: 'Cable Black (4 sq mm)', required: 4 },
        { componentId: 'comp_7', componentName: 'Flat Cable (3CX 2.5 sq mm)', required: 30 },
        { componentId: 'comp_9', componentName: 'Lightning Arrestor Assembly', required: 1 },
        { componentId: 'comp_12', componentName: 'Earthing Rod (14mm x 1m)', required: 2 },
        { componentId: 'comp_16', componentName: 'HDPE Pipe 63mm', required: 30 }
    ],
    '5HP': [
        { componentId: 'comp_1', componentName: 'Connector MC-4', required: 4 },
        { componentId: 'comp_5', componentName: 'Cable Red (4 sq mm)', required: 5 },
        { componentId: 'comp_6', componentName: 'Cable Black (4 sq mm)', required: 5 },
        { componentId: 'comp_10', componentName: 'Arrestor Spike', required: 1 },
        { componentId: 'comp_12', componentName: 'Earthing Rod (14mm x 1m)', required: 2 },
        { componentId: 'comp_17', componentName: 'HDPE Pipe 75mm', required: 30 }
    ],
    '7.5HP': [
        { componentId: 'comp_1', componentName: 'Connector MC-4', required: 4 },
        { componentId: 'comp_5', componentName: 'Cable Red (4 sq mm)', required: 13 },
        { componentId: 'comp_6', componentName: 'Cable Black (4 sq mm)', required: 13 },
        { componentId: 'comp_10', componentName: 'Arrestor Spike', required: 1 },
        { componentId: 'comp_12', componentName: 'Earthing Rod (14mm x 1m)', required: 2 },
        { componentId: 'comp_17', componentName: 'HDPE Pipe 75mm', required: 50 }
    ]
};

// Initialize inventory from localStorage or use default
function getInventory() {
    const stored = localStorage.getItem('solarInventory');
    if (stored) {
        return JSON.parse(stored);
    }
    return [...INITIAL_INVENTORY];
}

// Save inventory to localStorage
function saveInventory(inventory) {
    localStorage.setItem('solarInventory', JSON.stringify(inventory));
}

// Reset to initial values
function resetInventory() {
    localStorage.setItem('solarInventory', JSON.stringify(INITIAL_INVENTORY));
    return [...INITIAL_INVENTORY];
}
