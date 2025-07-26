"""
Main Window - Primary GUI interface for the Business RPG
"""

import tkinter as tk
from tkinter import ttk, messagebox
from .balance_sheet_tab import BalanceSheetTab
from .jobs_tab import JobsTab
from .game_log_tab import GameLogTab

class MainWindow:
    def __init__(self, root, game_manager):
        self.root = root
        self.game_manager = game_manager
        self.game_log = []
        
        # Set up the main window
        self.setup_window()
        
        # Register for game callbacks
        self.game_manager.add_callback(self.on_game_event)
        
        # Start the game automatically
        self.game_manager.start_new_game("Player")
    
    def setup_window(self):
        """Set up the main window layout"""
        # Create main frame
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Game title
        title_label = ttk.Label(main_frame, text="Business RPG", font=("Arial", 16, "bold"))
        title_label.pack(pady=(0, 10))
        
        # Turn controls frame
        turn_frame = ttk.Frame(main_frame)
        turn_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Week display
        self.week_label = ttk.Label(turn_frame, text="Week 1", font=("Arial", 12, "bold"))
        self.week_label.pack(side=tk.LEFT)
        
        # Advance turn button
        self.advance_turn_btn = ttk.Button(
            turn_frame, 
            text="Advance 1 Week", 
            command=self.advance_turn,
            style="Accent.TButton"
        )
        self.advance_turn_btn.pack(side=tk.RIGHT)
        
        # Create notebook for tabs
        self.notebook = ttk.Notebook(main_frame)
        self.notebook.pack(fill=tk.BOTH, expand=True)
        
        # Create tabs
        self.balance_sheet_tab = BalanceSheetTab(self.notebook, self.game_manager)
        self.jobs_tab = JobsTab(self.notebook, self.game_manager)
        self.game_log_tab = GameLogTab(self.notebook, self.game_manager)
        
        # Add tabs to notebook
        self.notebook.add(self.balance_sheet_tab.frame, text="Balance Sheet")
        self.notebook.add(self.jobs_tab.frame, text="Jobs")
        self.notebook.add(self.game_log_tab.frame, text="Game Log")
        
        # Initial update
        self.update_display()
    
    def advance_turn(self):
        """Handle turn advancement"""
        if self.game_manager.is_game_over():
            messagebox.showwarning("Game Over", "You are bankrupt! Game Over.")
            return
        
        result = self.game_manager.advance_turn()
        if result:
            self.update_display()
            
            # Show turn summary
            income = result['income']
            expenses = result['expenses']
            net_change = result['net_change']
            new_balance = result['new_balance']
            
            message = f"Week {self.game_manager.get_current_week() - 1} Summary:\n"
            message += f"Income: ${income:,.2f}\n"
            message += f"Expenses: ${expenses:,.2f}\n"
            message += f"Net Change: ${net_change:+,.2f}\n"
            message += f"New Balance: ${new_balance:,.2f}"
            
            messagebox.showinfo("Week Complete", message)
            
            # Check for bankruptcy
            if self.game_manager.is_game_over():
                messagebox.showerror("Game Over", "You are bankrupt! The game is over.")
    
    def update_display(self):
        """Update all display elements"""
        # Update week label
        week = self.game_manager.get_current_week()
        self.week_label.config(text=f"Week {week}")
        
        # Update all tabs
        self.balance_sheet_tab.update()
        self.jobs_tab.update()
        self.game_log_tab.update()
    
    def on_game_event(self, event_type, data=None):
        """Handle game events"""
        if event_type == "week_advanced":
            self.log_event(f"Week {self.game_manager.get_current_week() - 1} completed")
            if data:
                income = data['income']
                expenses = data['expenses']
                net_change = data['net_change']
                self.log_event(f"Income: ${income:.2f}, Expenses: ${expenses:.2f}, Net: ${net_change:+.2f}")
        
        elif event_type == "job_acquired":
            if data:
                self.log_event(f"Got job: {data.title} (${data.weekly_salary}/week)")
        
        elif event_type == "job_quit":
            if data:
                self.log_event(f"Quit job: {data.title}")
        
        # Update display after any event
        self.update_display()
    
    def log_event(self, message):
        """Add an event to the game log"""
        week = self.game_manager.get_current_week()
        log_entry = f"Week {week}: {message}"
        self.game_log.append(log_entry)
        
        # Keep only last 50 entries
        if len(self.game_log) > 50:
            self.game_log = self.game_log[-50:]