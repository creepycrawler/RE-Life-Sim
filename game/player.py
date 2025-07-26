"""
Player class for managing character state and finances
"""

class Player:
    def __init__(self, name="Player", starting_cash=1000):
        self.name = name
        self.cash = starting_cash
        self.current_job = None
        self.week = 1
        
        # Weekly expenses
        self.weekly_expenses = {
            "rent": 200,
            "food": 100,
            "utilities": 50,
            "transport": 75,
            "other": 25
        }
        
        # Employment history
        self.job_history = []
        
    def get_net_worth(self):
        """Calculate current net worth (cash - no assets for MVP)"""
        return self.cash
    
    def get_total_weekly_expenses(self):
        """Calculate total weekly expenses"""
        return sum(self.weekly_expenses.values())
    
    def get_weekly_income(self):
        """Get weekly income from current job"""
        if self.current_job:
            return self.current_job.weekly_salary
        return 0
    
    def get_net_weekly_cash_flow(self):
        """Calculate net weekly cash flow (income - expenses)"""
        return self.get_weekly_income() - self.get_total_weekly_expenses()
    
    def advance_week(self):
        """Process one week of time passage"""
        # Add income from job
        weekly_income = self.get_weekly_income()
        self.cash += weekly_income
        
        # Subtract expenses
        total_expenses = self.get_total_weekly_expenses()
        self.cash -= total_expenses
        
        # Advance time
        self.week += 1
        
        return {
            "income": weekly_income,
            "expenses": total_expenses,
            "net_change": weekly_income - total_expenses,
            "new_balance": self.cash
        }
    
    def apply_for_job(self, job):
        """Apply for a job and get hired (simplified for MVP)"""
        if self.current_job:
            self.job_history.append(self.current_job)
        
        self.current_job = job
        return True
    
    def quit_job(self):
        """Quit current job"""
        if self.current_job:
            self.job_history.append(self.current_job)
            self.current_job = None
    
    def get_balance_sheet(self):
        """Get formatted balance sheet information"""
        return {
            "cash": self.cash,
            "net_worth": self.get_net_worth(),
            "weekly_income": self.get_weekly_income(),
            "weekly_expenses": self.weekly_expenses.copy(),
            "total_weekly_expenses": self.get_total_weekly_expenses(),
            "net_weekly_cash_flow": self.get_net_weekly_cash_flow(),
            "current_job": self.current_job.title if self.current_job else "Unemployed",
            "week": self.week
        }