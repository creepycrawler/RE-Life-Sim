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
let elements = {};

// Initialize Game
function initGame() {
    try {
        console.log('Initializing game...');
        
        // Get all DOM elements
        elements = {
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
        
        // Check if all elements were found
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`Element not found: ${key}`);
                alert(`Error: Could not find element ${key}`);
                return;
            }
        }
        
        console.log('All elements found successfully');
        
        // Job Selection Event
        elements.jobDropdown.addEventListener('change', function() {
            console.log('Job changed to:', elements.jobDropdown.value);
            updateJob();
        });
        
        // Turn Advancement - using both click and touchstart for mobile
        elements.advanceTurn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Advance button clicked');
            advanceTurn();
        });
        
        elements.advanceTurn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Advance button touched');
            advanceTurn();
        });
        
        // Initial display update
        updateAllDisplays();
        console.log('Game initialized successfully');
        
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Error initializing game: ' + error.message);
    }
}

function updateJob() {
    try {
        gameState.currentJob = elements.jobDropdown.value;
        console.log('Updated job to:', gameState.currentJob);
        updateAllDisplays();
    } catch (error) {
        console.error('Error updating job:', error);
    }
}

function advanceTurn() {
    try {
        console.log('Advancing turn...');
        
        // Increment week immediately
        gameState.week++;
        console.log('Week is now:', gameState.week);
        
        // Calculate weekly income and expenses
        const income = jobSalaries[gameState.currentJob] || 0;
        const totalExpenses = gameState.expenses.living + gameState.expenses.studentLoans;
        const netWeekly = income - totalExpenses;
        
        console.log('Income:', income, 'Expenses:', totalExpenses, 'Net:', netWeekly);
        
        // Update cash immediately
        gameState.cash += netWeekly;
        console.log('New cash:', gameState.cash);
        
        // Check for random events and apply immediately
        const randomEvent = generateRandomEvent();
        if (randomEvent) {
            console.log('Random event:', randomEvent);
        }
        
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
        
        console.log('Turn advanced successfully');
        
    } catch (error) {
        console.error('Error advancing turn:', error);
        alert('Error advancing turn: ' + error.message);
    }
}

function generateRandomEvent() {
    try {
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
    } catch (error) {
        console.error('Error in random event:', error);
        return null;
    }
}

function updateAllDisplays() {
    try {
        console.log('Updating displays...');
        
        // Calculate financial values
        const income = jobSalaries[gameState.currentJob] || 0;
        const totalExpenses = gameState.expenses.living + gameState.expenses.studentLoans;
        const weeklyChange = income - totalExpenses;
        
        // Update ALL text elements immediately with textContent (fastest DOM update)
        if (elements.currentWeek) elements.currentWeek.textContent = `Week: ${gameState.week}`;
        if (elements.currentBalance) elements.currentBalance.textContent = `Net Worth: $${gameState.cash}`;
        if (elements.cashAmount) elements.cashAmount.textContent = `$${gameState.cash}`;
        if (elements.totalAssets) elements.totalAssets.textContent = `$${gameState.cash}`;
        if (elements.livingExpenses) elements.livingExpenses.textContent = `-$${gameState.expenses.living}`;
        if (elements.studentLoans) elements.studentLoans.textContent = `-$${gameState.expenses.studentLoans}`;
        if (elements.totalExpenses) elements.totalExpenses.textContent = `-$${totalExpenses}`;
        if (elements.jobIncome) elements.jobIncome.textContent = `$${income}`;
        if (elements.totalIncome) elements.totalIncome.textContent = `$${income}`;
        if (elements.weeklyChange) elements.weeklyChange.textContent = `${weeklyChange >= 0 ? '+' : ''}$${weeklyChange}`;
        if (elements.netWorth) elements.netWorth.textContent = `$${gameState.cash}`;
        
        // Apply color coding immediately
        if (elements.weeklyChange) {
            if (weeklyChange < 0) {
                elements.weeklyChange.style.color = '#e74c3c';
            } else if (weeklyChange > 0) {
                elements.weeklyChange.style.color = '#27ae60';
            } else {
                elements.weeklyChange.style.color = '#f39c12';
            }
        }
        
        // Color code net worth in header
        if (elements.currentBalance) {
            if (gameState.cash < 0) {
                elements.currentBalance.style.color = '#ff6b6b';
            } else if (gameState.cash > 5000) {
                elements.currentBalance.style.color = '#51cf66';
            } else {
                elements.currentBalance.style.color = 'white';
            }
        }
        
        console.log('Displays updated successfully');
        
    } catch (error) {
        console.error('Error updating displays:', error);
        alert('Error updating displays: ' + error.message);
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting game...');
    initGame();
});

// Also try with window.onload as backup for mobile
window.onload = function() {
    console.log('Window loaded');
    if (!elements.currentWeek) {
        console.log('Retrying initialization...');
        initGame();
    }
};