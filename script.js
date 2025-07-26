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
    gameState.week++;
    
    // Calculate weekly income and expenses
    const income = jobSalaries[gameState.currentJob];
    const totalExpenses = gameState.expenses.living + gameState.expenses.studentLoans;
    const netWeekly = income - totalExpenses;
    
    // Update cash
    gameState.cash += netWeekly;
    
    // Add random events occasionally
    if (Math.random() < 0.3) {
        generateRandomEvent();
    }
    
    // Update all displays immediately
    updateAllDisplays();
    
    // Add a brief visual feedback
    elements.advanceTurn.textContent = 'Week Advanced!';
    elements.advanceTurn.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        elements.advanceTurn.textContent = 'Advance 1 Week';
        elements.advanceTurn.style.backgroundColor = '';
    }, 1000);
}

function generateRandomEvent() {
    const events = [
        {
            text: "Found $50 in old jacket!",
            effect: 50
        },
        {
            text: "Car repair cost $200",
            effect: -200
        },
        {
            text: "Tax refund: $150",
            effect: 150
        },
        {
            text: "Medical bill: $100",
            effect: -100
        },
        {
            text: "Sold textbooks: $75",
            effect: 75
        },
        {
            text: "High utility bill: $80",
            effect: -80
        },
        {
            text: "Freelance work: $120",
            effect: 120
        }
    ];
    
    if (Math.random() < 0.7) { // 70% chance of an event
        const event = events[Math.floor(Math.random() * events.length)];
        gameState.cash += event.effect;
        
        // Show event as a brief notification in the button
        const originalText = elements.advanceTurn.textContent;
        elements.advanceTurn.textContent = event.text;
        elements.advanceTurn.style.backgroundColor = event.effect > 0 ? '#27ae60' : '#e74c3c';
        
        setTimeout(() => {
            elements.advanceTurn.textContent = 'Week Advanced!';
            elements.advanceTurn.style.backgroundColor = '#27ae60';
        }, 2000);
    }
}

function updateAllDisplays() {
    // Update header info
    elements.currentWeek.textContent = `Week: ${gameState.week}`;
    elements.currentBalance.textContent = `Net Worth: $${gameState.cash}`;
    
    // Calculate financial values
    const income = jobSalaries[gameState.currentJob];
    const totalExpenses = gameState.expenses.living + gameState.expenses.studentLoans;
    const weeklyChange = income - totalExpenses;
    
    // Update financial display
    elements.cashAmount.textContent = `$${gameState.cash}`;
    elements.totalAssets.textContent = `$${gameState.cash}`;
    elements.livingExpenses.textContent = `-$${gameState.expenses.living}`;
    elements.studentLoans.textContent = `-$${gameState.expenses.studentLoans}`;
    elements.totalExpenses.textContent = `-$${totalExpenses}`;
    elements.jobIncome.textContent = `$${income}`;
    elements.totalIncome.textContent = `$${income}`;
    elements.weeklyChange.textContent = `${weeklyChange >= 0 ? '+' : ''}$${weeklyChange}`;
    elements.netWorth.textContent = `$${gameState.cash}`;
    
    // Color code weekly change
    const weeklyChangeElement = elements.weeklyChange;
    if (weeklyChange < 0) {
        weeklyChangeElement.style.color = '#e74c3c';
    } else if (weeklyChange > 0) {
        weeklyChangeElement.style.color = '#27ae60';
    } else {
        weeklyChangeElement.style.color = '#f39c12';
    }
    
    // Color code net worth in header
    const balanceElement = elements.currentBalance;
    if (gameState.cash < 0) {
        balanceElement.style.color = '#ff6b6b';
    } else if (gameState.cash > 5000) {
        balanceElement.style.color = '#51cf66';
    } else {
        balanceElement.style.color = 'white';
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);