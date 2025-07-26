// Game State
let gameState = {
    player: {
        name: '',
        degree: '',
        currentJob: null,
        cash: 1000, // Starting with $1000
        weeklySalary: 0
    },
    week: 1,
    expenses: {
        living: 500,
        studentLoans: 200
    },
    jobs: [
        {
            id: 'intern',
            title: 'Intern',
            salary: 400,
            requirements: 'Any degree',
            description: 'Basic entry-level position to gain experience.'
        },
        {
            id: 'entry-sales',
            title: 'Sales Associate',
            salary: 600,
            requirements: 'Business, Marketing, or Economics preferred',
            description: 'Sell products and services to customers.'
        },
        {
            id: 'junior-dev',
            title: 'Junior Developer',
            salary: 800,
            requirements: 'Computer Science or Engineering',
            description: 'Write code and assist senior developers.'
        },
        {
            id: 'financial-analyst',
            title: 'Financial Analyst',
            salary: 900,
            requirements: 'Finance, Economics, or Business',
            description: 'Analyze financial data and create reports.'
        },
        {
            id: 'marketing-coordinator',
            title: 'Marketing Coordinator',
            salary: 700,
            requirements: 'Marketing or Business preferred',
            description: 'Coordinate marketing campaigns and events.'
        },
        {
            id: 'data-analyst',
            title: 'Data Analyst',
            salary: 750,
            requirements: 'Computer Science, Engineering, or Economics',
            description: 'Analyze data to provide business insights.'
        },
        {
            id: 'customer-service',
            title: 'Customer Service Rep',
            salary: 450,
            requirements: 'Any degree',
            description: 'Help customers with their questions and concerns.'
        },
        {
            id: 'project-coordinator',
            title: 'Project Coordinator',
            salary: 650,
            requirements: 'Business or Engineering preferred',
            description: 'Coordinate project timelines and resources.'
        }
    ]
};

// Degree compatibility for job matching
const degreeJobMatch = {
    'business': ['entry-sales', 'financial-analyst', 'marketing-coordinator', 'project-coordinator'],
    'computer-science': ['junior-dev', 'data-analyst'],
    'engineering': ['junior-dev', 'data-analyst', 'project-coordinator'],
    'finance': ['financial-analyst', 'entry-sales'],
    'marketing': ['marketing-coordinator', 'entry-sales'],
    'economics': ['financial-analyst', 'data-analyst', 'entry-sales'],
    'liberal-arts': ['customer-service', 'marketing-coordinator']
};

// DOM Elements
const elements = {
    // Screens
    characterCreation: document.getElementById('character-creation'),
    mainGame: document.getElementById('main-game'),
    
    // Character Creation
    playerName: document.getElementById('player-name'),
    collegeDegree: document.getElementById('college-degree'),
    startGame: document.getElementById('start-game'),
    
    // Game Info
    currentWeek: document.getElementById('current-week'),
    currentBalance: document.getElementById('current-balance'),
    
    // Character Display
    displayName: document.getElementById('display-name'),
    displayDegree: document.getElementById('display-degree'),
    currentJob: document.getElementById('current-job'),
    weeklySalary: document.getElementById('weekly-salary'),
    
    // Navigation
    navButtons: document.querySelectorAll('.nav-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Turn Control
    advanceTurn: document.getElementById('advance-turn'),
    
    // Job Listings
    jobListings: document.getElementById('job-listings'),
    
    // Finances
    cashAmount: document.getElementById('cash-amount'),
    totalAssets: document.getElementById('total-assets'),
    livingExpenses: document.getElementById('living-expenses'),
    studentLoans: document.getElementById('student-loans'),
    totalExpenses: document.getElementById('total-expenses'),
    jobIncome: document.getElementById('job-income'),
    totalIncome: document.getElementById('total-income'),
    netWorth: document.getElementById('net-worth'),
    
    // Modal
    eventModal: document.getElementById('event-modal'),
    eventTitle: document.getElementById('event-title'),
    eventDescription: document.getElementById('event-description'),
    closeModal: document.getElementById('close-modal')
};

// Initialize Game
function initGame() {
    // Character Creation Event
    elements.startGame.addEventListener('click', startGame);
    
    // Navigation Events
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.dataset.screen);
        });
    });
    
    // Turn Advancement
    elements.advanceTurn.addEventListener('click', advanceTurn);
    
    // Modal Close
    elements.closeModal.addEventListener('click', closeModal);
    
    // Load jobs
    loadJobs();
    
    // Update displays
    updateAllDisplays();
}

function startGame() {
    const name = elements.playerName.value.trim();
    const degree = elements.collegeDegree.value;
    
    if (!name || !degree) {
        alert('Please enter your name and select a degree!');
        return;
    }
    
    // Set player data
    gameState.player.name = name;
    gameState.player.degree = degree;
    
    // Hide character creation, show main game
    elements.characterCreation.classList.remove('active');
    elements.mainGame.classList.add('active');
    
    // Update displays
    updateAllDisplays();
    loadJobs();
    
    // Show welcome message
    showModal('Welcome to Corporate Climber!', 
        `Welcome ${name}! You've graduated with a degree in ${getDegreeDisplayName(degree)}. 
        Your career journey begins now. You start with $1,000 in cash but have weekly expenses. 
        Find a job quickly to start earning money!`);
}

function getDegreeDisplayName(degree) {
    const degreeNames = {
        'business': 'Business Administration',
        'computer-science': 'Computer Science',
        'engineering': 'Engineering',
        'finance': 'Finance',
        'marketing': 'Marketing',
        'economics': 'Economics',
        'liberal-arts': 'Liberal Arts'
    };
    return degreeNames[degree] || degree;
}

function switchTab(tabName) {
    // Update navigation
    elements.navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.screen === tabName);
    });
    
    // Update content
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
}

function loadJobs() {
    elements.jobListings.innerHTML = '';
    
    // Filter jobs based on player's degree and current employment status
    let availableJobs = gameState.jobs.filter(job => {
        // If unemployed, show all jobs except those requiring very specific degrees
        if (!gameState.player.currentJob) {
            return true;
        }
        // If employed, show better jobs
        return job.salary > gameState.player.weeklySalary;
    });
    
    // Sort by salary descending
    availableJobs.sort((a, b) => b.salary - a.salary);
    
    availableJobs.forEach(job => {
        const jobCard = createJobCard(job);
        elements.jobListings.appendChild(jobCard);
    });
    
    if (availableJobs.length === 0) {
        elements.jobListings.innerHTML = '<p>No jobs available at the moment. Advance a week to see new opportunities!</p>';
    }
}

function createJobCard(job) {
    const div = document.createElement('div');
    div.className = 'job-card';
    
    // Check if player meets requirements
    const meetsRequirements = checkJobRequirements(job);
    const isCurrentJob = gameState.player.currentJob?.id === job.id;
    
    div.innerHTML = `
        <div class="job-title">${job.title}</div>
        <div class="job-salary">$${job.salary}/week</div>
        <div class="job-requirements">Requirements: ${job.requirements}</div>
        <div class="job-description">${job.description}</div>
        <button class="btn primary" onclick="applyForJob('${job.id}')" 
                ${isCurrentJob ? 'disabled' : ''}>
            ${isCurrentJob ? 'Current Job' : (meetsRequirements ? 'Apply' : 'Apply (Less Likely)')}
        </button>
    `;
    
    return div;
}

function checkJobRequirements(job) {
    const playerDegree = gameState.player.degree;
    const preferredDegrees = degreeJobMatch[playerDegree] || [];
    
    // If job is in the preferred list for this degree, or if it's an entry-level job
    return preferredDegrees.includes(job.id) || job.id === 'intern' || job.id === 'customer-service';
}

function applyForJob(jobId) {
    const job = gameState.jobs.find(j => j.id === jobId);
    if (!job) return;
    
    const meetsRequirements = checkJobRequirements(job);
    const successChance = meetsRequirements ? 0.8 : 0.4; // 80% if qualified, 40% if not
    
    const success = Math.random() < successChance;
    
    if (success) {
        // Got the job!
        gameState.player.currentJob = job;
        gameState.player.weeklySalary = job.salary;
        
        showModal('Congratulations!', 
            `You got the job as ${job.title}! You'll earn $${job.salary} per week. 
            Your first paycheck will come next week.`);
        
        updateAllDisplays();
        loadJobs(); // Refresh job listings
    } else {
        showModal('Application Rejected', 
            `Unfortunately, your application for ${job.title} was rejected. 
            Don't give up - try applying to other positions or wait for new opportunities!`);
    }
}

function advanceTurn() {
    gameState.week++;
    
    // Calculate weekly income and expenses
    const income = gameState.player.weeklySalary;
    const totalExpenses = gameState.expenses.living + gameState.expenses.studentLoans;
    const netWeekly = income - totalExpenses;
    
    // Update cash
    gameState.player.cash += netWeekly;
    
    // Create weekly report
    let eventText = `<h4>Week ${gameState.week} Summary</h4>`;
    eventText += `<p><strong>Income:</strong> $${income}</p>`;
    eventText += `<p><strong>Expenses:</strong> $${totalExpenses}</p>`;
    eventText += `<p><strong>Net Change:</strong> ${netWeekly >= 0 ? '+' : ''}$${netWeekly}</p>`;
    eventText += `<p><strong>New Balance:</strong> $${gameState.player.cash}</p>`;
    
    // Add random events occasionally
    if (Math.random() < 0.3) {
        const randomEvent = generateRandomEvent();
        if (randomEvent) {
            eventText += `<hr><h4>Random Event</h4><p>${randomEvent}</p>`;
        }
    }
    
    // Check for game over conditions
    if (gameState.player.cash < -2000) {
        eventText += `<hr><p style="color: red;"><strong>Warning:</strong> Your finances are in serious trouble! 
                     You need to find better income sources soon.</p>`;
    }
    
    // Refresh job listings (new opportunities)
    if (gameState.week % 4 === 0) {
        eventText += `<hr><p><strong>New month!</strong> Fresh job opportunities may be available.</p>`;
    }
    
    showModal('Weekly Update', eventText);
    
    updateAllDisplays();
    loadJobs();
}

function generateRandomEvent() {
    const events = [
        {
            text: "You found $50 in an old jacket pocket!",
            effect: () => gameState.player.cash += 50
        },
        {
            text: "Unexpected car repair cost you $200.",
            effect: () => gameState.player.cash -= 200
        },
        {
            text: "You received a small tax refund of $150!",
            effect: () => gameState.player.cash += 150
        },
        {
            text: "Medical bill arrived: $100",
            effect: () => gameState.player.cash -= 100
        },
        {
            text: "You sold some old textbooks for $75!",
            effect: () => gameState.player.cash += 75
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
    elements.currentBalance.textContent = `Net Worth: $${gameState.player.cash}`;
    
    // Update character info
    elements.displayName.textContent = gameState.player.name;
    elements.displayDegree.textContent = getDegreeDisplayName(gameState.player.degree);
    elements.currentJob.textContent = gameState.player.currentJob ? gameState.player.currentJob.title : 'Unemployed';
    elements.weeklySalary.textContent = `$${gameState.player.weeklySalary}`;
    
    // Update financial display
    const totalExpenses = gameState.expenses.living + gameState.expenses.studentLoans;
    const netWorth = gameState.player.cash;
    
    elements.cashAmount.textContent = `$${gameState.player.cash}`;
    elements.totalAssets.textContent = `$${gameState.player.cash}`;
    elements.livingExpenses.textContent = `-$${gameState.expenses.living}`;
    elements.studentLoans.textContent = `-$${gameState.expenses.studentLoans}`;
    elements.totalExpenses.textContent = `-$${totalExpenses}`;
    elements.jobIncome.textContent = `$${gameState.player.weeklySalary}`;
    elements.totalIncome.textContent = `$${gameState.player.weeklySalary}`;
    elements.netWorth.textContent = `$${netWorth}`;
    
    // Color code net worth
    const netWorthElement = elements.netWorth;
    if (netWorth < 0) {
        netWorthElement.style.color = '#e74c3c';
    } else if (netWorth > 5000) {
        netWorthElement.style.color = '#27ae60';
    } else {
        netWorthElement.style.color = '#f39c12';
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

// Make functions globally available for onclick handlers
window.applyForJob = applyForJob;

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);