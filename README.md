# Business RPG

A text-based business simulation game inspired by Gear City, where you manage your character's finances and career progression in a turn-based environment.

## Game Overview

In Business RPG, you play as a character starting with $1,000 and weekly living expenses. Your goal is to find employment, manage your finances, and build wealth over time. Each turn represents one week of game time.

## Features

### Current MVP Features
- **Turn-based gameplay**: Click "Advance 1 Week" to progress time
- **Balance Sheet**: Track your cash, net worth, income, and expenses
- **Job Market**: Browse and apply for various jobs with different salaries
- **Financial Management**: Monitor weekly cash flow and projections
- **Game Log**: Keep track of all your activities and progress

### Starting Conditions
- **Starting Cash**: $1,000
- **Weekly Expenses**: $450 total
  - Rent: $200
  - Food: $100
  - Utilities: $50
  - Transport: $75
  - Other: $25

### Available Jobs
The game includes various jobs with different salary levels:
- Entry-level positions: $300-$350/week (Fast Food Worker, Barista, etc.)
- Mid-level positions: $400-$500/week (Office Assistant, Customer Service, etc.)
- Higher-level positions: $550-$650/week (Sales Associate, Junior Accountant, etc.)

## How to Play

1. **Start the Game**: Run `python main.py` to launch the game
2. **Check Your Finances**: Use the "Balance Sheet" tab to see your current financial status
3. **Find a Job**: Go to the "Jobs" tab to browse available positions
4. **Apply for Work**: Select a job and click "Apply for Job" to get employed
5. **Advance Time**: Click "Advance 1 Week" to progress the game and earn your salary
6. **Monitor Progress**: Check the "Game Log" tab to see your activity history

## Game Mechanics

### Turn Progression
- Each turn represents 1 week of game time
- At the end of each week:
  - You receive your weekly salary (if employed)
  - Weekly expenses are automatically deducted
  - Your cash balance is updated

### Employment
- You can only have one job at a time
- Job applications are automatically successful (simplified for MVP)
- You can quit your current job to apply for a better one
- Being unemployed means $0 weekly income but expenses continue

### Financial Projections
- The balance sheet shows 4-week financial projections
- Warning alerts appear if you're heading toward bankruptcy
- Game over occurs if your cash goes negative

## Requirements

- Python 3.6 or higher
- tkinter (included with most Python installations)

## Installation and Running

1. Clone or download the game files
2. Ensure Python 3.6+ is installed on your system
3. Install tkinter (if not already installed):
   ```bash
   # Ubuntu/Debian:
   sudo apt install python3-tk
   
   # Other systems: tkinter usually comes with Python
   ```
4. Test the game components (optional):
   ```bash
   python3 test_game.py
   ```
5. Run the game:
   ```bash
   python3 main.py
   # or
   ./run_game.sh
   ```

## Game Structure

```
business-rpg/
├── main.py              # Game entry point
├── test_game.py         # Component testing script
├── run_game.sh          # Game launcher script
├── README.md            # This file
├── game/               # Game logic
│   ├── __init__.py
│   ├── game_manager.py # Main game coordinator
│   ├── player.py       # Player character and finances
│   └── job.py          # Job system and market
└── gui/                # User interface
    ├── __init__.py
    ├── main_window.py  # Main game window
    ├── balance_sheet_tab.py  # Financial overview
    ├── jobs_tab.py     # Job market interface
    └── game_log_tab.py # Activity history
```

## Future Expansion Ideas

- Business ownership and investment opportunities
- Skill development and career advancement
- Random events and market fluctuations
- Multiple characters or companies to manage
- Save/load game functionality
- More complex economic simulation

## Tips for Success

1. **Get a job quickly** - Your starting $1,000 won't last long with $450/week expenses
2. **Monitor your projections** - The 4-week forecast helps you plan ahead
3. **Upgrade when possible** - Look for higher-paying jobs as you progress
4. **Watch your cash flow** - Negative weekly flow leads to bankruptcy

Enjoy building your business empire!