"""
Balance Sheet Tab - Shows player financial information
"""

import tkinter as tk
from tkinter import ttk

class BalanceSheetTab:
    def __init__(self, parent, game_manager):
        self.parent = parent
        self.game_manager = game_manager
        
        # Create main frame
        self.frame = ttk.Frame(parent)
        self.setup_ui()
    
    def setup_ui(self):
        """Set up the balance sheet interface"""
        # Main container with padding
        main_container = ttk.Frame(self.frame)
        main_container.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Title
        title_label = ttk.Label(main_container, text="Financial Overview", font=("Arial", 14, "bold"))
        title_label.pack(pady=(0, 20))
        
        # Create two columns
        columns_frame = ttk.Frame(main_container)
        columns_frame.pack(fill=tk.BOTH, expand=True)
        
        # Left column - Current Status
        left_frame = ttk.LabelFrame(columns_frame, text="Current Status", padding=15)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 10))
        
        # Cash and Net Worth
        self.cash_label = ttk.Label(left_frame, text="Cash: $0.00", font=("Arial", 12, "bold"))
        self.cash_label.pack(anchor=tk.W, pady=2)
        
        self.net_worth_label = ttk.Label(left_frame, text="Net Worth: $0.00", font=("Arial", 12, "bold"))
        self.net_worth_label.pack(anchor=tk.W, pady=2)
        
        ttk.Separator(left_frame, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=10)
        
        # Employment status
        self.job_label = ttk.Label(left_frame, text="Current Job: Unemployed", font=("Arial", 11))
        self.job_label.pack(anchor=tk.W, pady=2)
        
        # Right column - Weekly Cash Flow
        right_frame = ttk.LabelFrame(columns_frame, text="Weekly Cash Flow", padding=15)
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=(10, 0))
        
        # Income
        self.income_label = ttk.Label(right_frame, text="Weekly Income: $0.00", font=("Arial", 11, "bold"))
        self.income_label.pack(anchor=tk.W, pady=2)
        
        ttk.Separator(right_frame, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=5)
        
        # Expenses breakdown
        expenses_title = ttk.Label(right_frame, text="Weekly Expenses:", font=("Arial", 11, "bold"))
        expenses_title.pack(anchor=tk.W, pady=(0, 5))
        
        self.expense_labels = {}
        expense_categories = ["rent", "food", "utilities", "transport", "other"]
        for category in expense_categories:
            label = ttk.Label(right_frame, text=f"  {category.title()}: $0.00", font=("Arial", 10))
            label.pack(anchor=tk.W, pady=1)
            self.expense_labels[category] = label
        
        ttk.Separator(right_frame, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=5)
        
        self.total_expenses_label = ttk.Label(right_frame, text="Total Expenses: $0.00", font=("Arial", 11, "bold"))
        self.total_expenses_label.pack(anchor=tk.W, pady=2)
        
        ttk.Separator(right_frame, orient=tk.HORIZONTAL).pack(fill=tk.X, pady=5)
        
        # Net cash flow
        self.net_flow_label = ttk.Label(right_frame, text="Net Weekly Flow: $0.00", font=("Arial", 11, "bold"))
        self.net_flow_label.pack(anchor=tk.W, pady=2)
        
        # Bottom section - Projections
        projections_frame = ttk.LabelFrame(main_container, text="4-Week Projection", padding=15)
        projections_frame.pack(fill=tk.X, pady=(20, 0))
        
        self.projection_label = ttk.Label(projections_frame, text="", font=("Arial", 10))
        self.projection_label.pack(anchor=tk.W)
    
    def update(self):
        """Update the balance sheet display"""
        status = self.game_manager.get_player_status()
        
        # Update current status
        cash = status['cash']
        net_worth = status['net_worth']
        
        # Color code cash based on amount
        cash_color = "green" if cash >= 0 else "red"
        self.cash_label.config(text=f"Cash: ${cash:,.2f}", foreground=cash_color)
        self.net_worth_label.config(text=f"Net Worth: ${net_worth:,.2f}")
        
        # Update job status
        current_job = status['current_job']
        self.job_label.config(text=f"Current Job: {current_job}")
        
        # Update weekly cash flow
        weekly_income = status['weekly_income']
        self.income_label.config(text=f"Weekly Income: ${weekly_income:.2f}")
        
        # Update expenses
        weekly_expenses = status['weekly_expenses']
        for category, amount in weekly_expenses.items():
            if category in self.expense_labels:
                self.expense_labels[category].config(text=f"  {category.title()}: ${amount:.2f}")
        
        total_expenses = status['total_weekly_expenses']
        self.total_expenses_label.config(text=f"Total Expenses: ${total_expenses:.2f}")
        
        # Update net flow
        net_flow = status['net_weekly_cash_flow']
        flow_color = "green" if net_flow >= 0 else "red"
        self.net_flow_label.config(text=f"Net Weekly Flow: ${net_flow:+.2f}", foreground=flow_color)
        
        # Update projections
        self.update_projections(cash, net_flow)
    
    def update_projections(self, current_cash, weekly_net_flow):
        """Update 4-week projection"""
        projections = []
        cash = current_cash
        
        for week in range(1, 5):
            cash += weekly_net_flow
            projections.append(f"Week +{week}: ${cash:,.2f}")
        
        projection_text = "  |  ".join(projections)
        
        if weekly_net_flow < 0 and current_cash + (4 * weekly_net_flow) < 0:
            weeks_until_broke = max(1, int(-current_cash / -weekly_net_flow))
            projection_text += f"\n⚠️ Warning: Bankruptcy in ~{weeks_until_broke} weeks without job!"
            self.projection_label.config(foreground="red")
        else:
            self.projection_label.config(foreground="black")
        
        self.projection_label.config(text=projection_text)