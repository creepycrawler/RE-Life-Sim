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
    netWorth: document.getElementById('net-worth'),
    
    // Modal
    eventModal: document.getElementById('event-modal'),
    eventTitle: document.getElementById('event-title'),
    eventDescription: document.getElementById('event-description'),
    closeModal: document.getElementById('close-modal')
};

// Initialize Game
function initGame() {
    // Job Selection Event
    elements.jobDropdown.addEventListener('change', updateJob);
    
    // Turn Advancement
    elements.advanceTurn.addEventListener('click', advanceTurn);
    
    // Modal Close
    elements.closeModal.addEventListener('click', closeModal);
    
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
    let randomEventText = '';
    if (Math.random() < 0.3) {
        const randomEvent = generateRandomEvent();
        if (randomEvent) {
            randomEventText = `<hr><h4>Random Event</h4><p>${randomEvent}</p>`;
        }
    }
    
    // Create weekly report
    let eventText = `<h4>Week ${gameState.week} Summary</h4>`;
    eventText += `<p><strong>Job:</strong> ${getJobDisplayName(gameState.currentJob)}</p>`;
    eventText += `<p><strong>Weekly Income:</strong> $${income}</p>`;
    eventText += `<p><strong>Weekly Expenses:</strong> $${totalExpenses}</p>`;
    eventText += `<p><strong>Net Weekly Change:</strong> ${netWeekly >= 0 ? '+' : ''}$${netWeekly}</p>`;
    eventText += `<p><strong>New Cash Balance:</strong> $${gameState.cash}</p>`;
    
    if (randomEventText) {
        eventText += randomEventText;
    }
    
    // Check for financial warnings
    if (gameState.cash < 0) {
        eventText += `<hr><p style="color: red; font-weight: bold;">⚠️ WARNING: You're in debt! Find a better job or reduce expenses!</p>`;
    } else if (gameState.cash < 500) {
        eventText += `<hr><p style="color: orange; font-weight: bold;">⚠️ CAUTION: Your cash is running low!</p>`;
    } else if (gameState.cash > 5000) {
        eventText += `<hr><p style="color: green; font-weight: bold;">🎉 Excellent! You're building wealth!</p>`;
    }
    
    showModal('Weekly Update', eventText);
    updateAllDisplays();
}

function getJobDisplayName(jobId) {
    const jobNames = {
        'unemployed': 'Unemployed',
        'intern': 'Intern',
        'customer-service': 'Customer Service Rep',
        'entry-sales': 'Sales Associate', 
        'project-coordinator': 'Project Coordinator',
        'marketing-coordinator': 'Marketing Coordinator',
        'data-analyst': 'Data Analyst',
        'junior-dev': 'Junior Developer',
        'financial-analyst': 'Financial Analyst'
    };
    return jobNames[jobId] || jobId;
}

function generateRandomEvent() {
    const events = [
        {
            text: "You found $50 in an old jacket pocket!",
            effect: () => gameState.cash += 50
        },
        {
            text: "Unexpected car repair cost you $200.",
            effect: () => gameState.cash -= 200
        },
        {
            text: "You received a small tax refund of $150!",
            effect: () => gameState.cash += 150
        },
        {
            text: "Medical bill arrived: $100",
            effect: () => gameState.cash -= 100
        },
        {
            text: "You sold some old textbooks for $75!",
            effect: () => gameState.cash += 75
        },
        {
            text: "Utility bill was higher this week: $80",
            effect: () => gameState.cash -= 80
        },
        {
            text: "You got a small freelance gig: $120!",
            effect: () => gameState.cash += 120
        }
    ];
    
    if (Math.random() < 0.7) { // 70% chance of an event
        const event = events[Math.floor(Math.random() * events.length)];
        event.effect();
        return event.text;
    }
    
    return null;
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

function showModal(title, content) {
    elements.eventTitle.textContent = title;
    elements.eventDescription.innerHTML = content;
    elements.eventModal.classList.add('active');
}

function closeModal() {
    elements.eventModal.classList.remove('active');
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);