// Game State
let gameState = {
    week: 1,
    cash: 1000, // Starting cash
    currentJob: 'unemployed',
    expenses: {
        living: 500,
        studentLoans: 200
    }
};

// Job salary mapping
const jobSalaries = {
    'unemployed': 0,
    'intern': 400,
    'customer-service': 450,
    'entry-sales': 600,
    'project-coordinator': 650,
    'marketing-coordinator': 700,
    'data-analyst': 750,
    'junior-dev': 800,
    'financial-analyst': 900
};

// DOM Elements
const elements = {
    // Game Info
    currentWeek: document.getElementById('current-week'),
    currentBalance: document.getElementById('current-balance'),
    
    // Job Selection
    jobDropdown: document.getElementById('job-dropdown'),
    
    // Turn Control
    advanceTurn: document.getElementById('advance-turn'),
    
    // Financial Display
    cashAmount: document.getElementById('cash-amount'),
    totalAssets: document.getElementById('total-assets'),
    livingExpenses: document.getElementById('living-expenses'),
    studentLoans: document.getElementById('student-loans'),
    totalExpenses: document.getElementById('total-expenses'),
    jobIncome: document.getElementById('job-income'),
    totalIncome: document.getElementById('total-income'),
    weeklyChange: document.getElementById('weekly-change'),
    netWorth: document.getElementById('net-worth')
};

// Initialize Game
function initGame() {
    // Job Selection Event
    elements.jobDropdown.addEventListener('change', updateJob);
    
    // Turn Advancement
    elements.advanceTurn.addEventListener('click', advanceTurn);
    
    // Initial display update
    updateAllDisplays();
}

function updateJob() {
    gameState.currentJob = elements.jobDropdown.value;
    updateAllDisplays();
}

function advanceTurn() {
    // Increment week immediately
    gameState.week++;
    
    // Calculate weekly income and expenses
    const income = jobSalaries[gameState.currentJob];
    const totalExpenses = gameState.expenses.living + gameState.expenses.studentLoans;
    const netWeekly = income - totalExpenses;
    
    // Update cash immediately
    gameState.cash += netWeekly;
    
    // Check for random events and apply immediately
    const randomEvent = generateRandomEvent();
    
    // Update ALL displays immediately - no delays
    updateAllDisplays();
    
    // Provide instant visual feedback on button
    elements.advanceTurn.textContent = randomEvent ? randomEvent : 'Week Advanced!';
    elements.advanceTurn.style.backgroundColor = '#27ae60';
    elements.advanceTurn.style.transform = 'scale(0.98)';
    
    // Reset button appearance after brief moment (doesn't affect data updates)
    setTimeout(() => {
        elements.advanceTurn.textContent = 'Advance 1 Week';
        elements.advanceTurn.style.backgroundColor = '';
        elements.advanceTurn.style.transform = '';
    }, 800);
}

function generateRandomEvent() {
    // Only 25% chance of random event to keep it interesting but not overwhelming
    if (Math.random() < 0.25) {
        const events = [
            { text: "Found $50!", effect: 50 },
            { text: "Car repair: -$150", effect: -150 },
            { text: "Tax refund: +$120", effect: 120 },
            { text: "Medical bill: -$80", effect: -80 },
            { text: "Side gig: +$100", effect: 100 },
            { text: "Utility spike: -$60", effect: -60 }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        
        // Apply effect immediately
        gameState.cash += event.effect;
        
        return event.text;
    }
    return null;
}

function updateAllDisplays() {
    // Calculate financial values
    const income = jobSalaries[gameState.currentJob];
    const totalExpenses = gameState.expenses.living + gameState.expenses.studentLoans;
    const weeklyChange = income - totalExpenses;
    
    // Update ALL text elements immediately with textContent (fastest DOM update)
    elements.currentWeek.textContent = `Week: ${gameState.week}`;
    elements.currentBalance.textContent = `Net Worth: $${gameState.cash}`;
    elements.cashAmount.textContent = `$${gameState.cash}`;
    elements.totalAssets.textContent = `$${gameState.cash}`;
    elements.livingExpenses.textContent = `-$${gameState.expenses.living}`;
    elements.studentLoans.textContent = `-$${gameState.expenses.studentLoans}`;
    elements.totalExpenses.textContent = `-$${totalExpenses}`;
    elements.jobIncome.textContent = `$${income}`;
    elements.totalIncome.textContent = `$${income}`;
    elements.weeklyChange.textContent = `${weeklyChange >= 0 ? '+' : ''}$${weeklyChange}`;
    elements.netWorth.textContent = `$${gameState.cash}`;
    
    // Apply color coding immediately
    if (weeklyChange < 0) {
        elements.weeklyChange.style.color = '#e74c3c';
    } else if (weeklyChange > 0) {
        elements.weeklyChange.style.color = '#27ae60';
    } else {
        elements.weeklyChange.style.color = '#f39c12';
    }
    
    // Color code net worth in header
    if (gameState.cash < 0) {
        elements.currentBalance.style.color = '#ff6b6b';
    } else if (gameState.cash > 5000) {
        elements.currentBalance.style.color = '#51cf66';
    } else {
        elements.currentBalance.style.color = 'white';
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);