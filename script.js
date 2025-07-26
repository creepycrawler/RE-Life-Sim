// Game State
let week = 1;
let cash = 1000;
let currentJob = 'unemployed';

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

function log(message) {
    console.log(message);
}

function updateJob() {
    log('updateJob called');
    const dropdown = document.getElementById('job-dropdown');
    if (dropdown) {
        currentJob = dropdown.value;
        log('Job changed to: ' + currentJob);
        updateAllDisplays();
    } else {
        log('ERROR: job-dropdown not found');
    }
}

function advanceTurn() {
    log('advanceTurn called');
    
    try {
        // Increment week
        week++;
        log('Week is now: ' + week);
        
        // Calculate income and expenses
        const income = jobSalaries[currentJob] || 0;
        const expenses = 700; // 500 living + 200 student loans
        const netChange = income - expenses;
        
        log('Income: $' + income + ', Expenses: $' + expenses + ', Net: $' + netChange);
        
        // Update cash
        cash += netChange;
        log('New cash: $' + cash);
        
        // Random events (25% chance)
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
            cash += event.effect;
            log('Random event: ' + event.text + ' (effect: ' + event.effect + ')');
        }
        
        // Update all displays
        updateAllDisplays();
        
        // Button feedback
        const btn = document.getElementById('advance-turn');
        if (btn) {
            btn.textContent = 'Week Advanced!';
            btn.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                btn.textContent = 'Advance 1 Week';
                btn.style.backgroundColor = '';
            }, 1000);
        }
        
        log('Turn advanced successfully');
        
    } catch (error) {
        log('ERROR in advanceTurn: ' + error.message);
        alert('Error: ' + error.message);
    }
}

function updateAllDisplays() {
    log('updateAllDisplays called');
    
    try {
        // Calculate values
        const income = jobSalaries[currentJob] || 0;
        const expenses = 700;
        const weeklyChange = income - expenses;
        
        // Update each element
        const elements = [
            { id: 'current-week', text: 'Week: ' + week },
            { id: 'current-balance', text: 'Net Worth: $' + cash },
            { id: 'cash-amount', text: '$' + cash },
            { id: 'total-assets', text: '$' + cash },
            { id: 'living-expenses', text: '-$500' },
            { id: 'student-loans', text: '-$200' },
            { id: 'total-expenses', text: '-$' + expenses },
            { id: 'job-income', text: '$' + income },
            { id: 'total-income', text: '$' + income },
            { id: 'weekly-change', text: (weeklyChange >= 0 ? '+' : '') + '$' + weeklyChange },
            { id: 'net-worth', text: '$' + cash }
        ];
        
        elements.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                element.textContent = item.text;
                log('Updated ' + item.id + ' to: ' + item.text);
            } else {
                log('WARNING: Element not found: ' + item.id);
            }
        });
        
        // Color coding for weekly change
        const weeklyChangeEl = document.getElementById('weekly-change');
        if (weeklyChangeEl) {
            if (weeklyChange < 0) {
                weeklyChangeEl.style.color = '#e74c3c';
            } else if (weeklyChange > 0) {
                weeklyChangeEl.style.color = '#27ae60';
            } else {
                weeklyChangeEl.style.color = '#f39c12';
            }
        }
        
        // Color coding for net worth in header
        const balanceEl = document.getElementById('current-balance');
        if (balanceEl) {
            if (cash < 0) {
                balanceEl.style.color = '#ff6b6b';
            } else if (cash > 5000) {
                balanceEl.style.color = '#51cf66';
            } else {
                balanceEl.style.color = 'white';
            }
        }
        
        log('All displays updated successfully');
        
    } catch (error) {
        log('ERROR in updateAllDisplays: ' + error.message);
        alert('Display update error: ' + error.message);
    }
}

// Initialize when page loads
window.onload = function() {
    log('Page loaded, initializing...');
    
    try {
        // Set up event handlers using onclick (more reliable)
        const advanceBtn = document.getElementById('advance-turn');
        const jobDropdown = document.getElementById('job-dropdown');
        
        if (advanceBtn) {
            advanceBtn.onclick = advanceTurn;
            log('Advance button handler set');
        } else {
            log('ERROR: advance-turn button not found');
        }
        
        if (jobDropdown) {
            jobDropdown.onchange = updateJob;
            log('Job dropdown handler set');
        } else {
            log('ERROR: job-dropdown not found');
        }
        
        // Initial display update
        updateAllDisplays();
        
        log('Initialization complete!');
        
    } catch (error) {
        log('ERROR during initialization: ' + error.message);
        alert('Initialization error: ' + error.message);
    }
};