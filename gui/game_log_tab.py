"""
Game Log Tab - Shows history of game events and activities
"""

import tkinter as tk
from tkinter import ttk

class GameLogTab:
    def __init__(self, parent, game_manager):
        self.parent = parent
        self.game_manager = game_manager
        
        # Create main frame
        self.frame = ttk.Frame(parent)
        self.setup_ui()
    
    def setup_ui(self):
        """Set up the game log interface"""
        # Main container with padding
        main_container = ttk.Frame(self.frame)
        main_container.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Title
        title_label = ttk.Label(main_container, text="Game Log", font=("Arial", 14, "bold"))
        title_label.pack(pady=(0, 10))
        
        # Instructions
        instructions = ttk.Label(
            main_container, 
            text="This log shows your game activities and progress over time.",
            font=("Arial", 10)
        )
        instructions.pack(pady=(0, 20))
        
        # Create frame for log display
        log_frame = ttk.LabelFrame(main_container, text="Activity History", padding=10)
        log_frame.pack(fill=tk.BOTH, expand=True)
        
        # Create text widget with scrollbar
        text_frame = ttk.Frame(log_frame)
        text_frame.pack(fill=tk.BOTH, expand=True)
        
        # Text widget for log display
        self.log_text = tk.Text(
            text_frame, 
            wrap=tk.WORD, 
            state=tk.DISABLED,
            font=("Courier", 10),
            bg="white",
            fg="black"
        )
        
        # Scrollbar for text widget
        scrollbar = ttk.Scrollbar(text_frame, orient=tk.VERTICAL, command=self.log_text.yview)
        self.log_text.configure(yscrollcommand=scrollbar.set)
        
        # Pack text widget and scrollbar
        self.log_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Control buttons frame
        controls_frame = ttk.Frame(main_container)
        controls_frame.pack(fill=tk.X, pady=(10, 0))
        
        # Clear log button
        clear_btn = ttk.Button(
            controls_frame, 
            text="Clear Log", 
            command=self.clear_log
        )
        clear_btn.pack(side=tk.LEFT)
        
        # Auto-scroll checkbox
        self.auto_scroll_var = tk.BooleanVar(value=True)
        auto_scroll_cb = ttk.Checkbutton(
            controls_frame,
            text="Auto-scroll to bottom",
            variable=self.auto_scroll_var
        )
        auto_scroll_cb.pack(side=tk.RIGHT)
        
        # Initialize with starting message
        self.add_initial_message()
    
    def add_initial_message(self):
        """Add initial welcome message to the log"""
        welcome_msg = [
            "=== Welcome to Business RPG ===",
            "You start with $1,000 and weekly expenses of $450.",
            "Find a job to earn income and manage your finances!",
            "Use the 'Jobs' tab to find employment.",
            "Use the 'Balance Sheet' tab to track your finances.",
            "Click 'Advance 1 Week' to progress time.",
            "=" * 40
        ]
        
        self.log_text.config(state=tk.NORMAL)
        for line in welcome_msg:
            self.log_text.insert(tk.END, line + "\n")
        self.log_text.config(state=tk.DISABLED)
        
        if self.auto_scroll_var.get():
            self.log_text.see(tk.END)
    
    def update(self):
        """Update the game log display"""
        # Get log entries from main window
        main_window = None
        for widget in self.parent.winfo_children():
            if hasattr(widget, 'master') and hasattr(widget.master, 'game_log'):
                main_window = widget.master
                break
        
        # Find the main window through the widget hierarchy
        current = self.parent
        while current and not hasattr(current, 'game_log'):
            current = current.master
        
        if current and hasattr(current, 'game_log'):
            self.display_log(current.game_log)
    
    def display_log(self, log_entries):
        """Display log entries in the text widget"""
        # Store current position
        current_pos = self.log_text.yview()
        was_at_bottom = current_pos[1] == 1.0
        
        # Get current content
        self.log_text.config(state=tk.NORMAL)
        current_content = self.log_text.get("1.0", tk.END).strip()
        
        # Build expected content from log entries
        expected_lines = []
        
        # Add initial welcome message lines
        if not current_content or "Welcome to Business RPG" not in current_content:
            welcome_msg = [
                "=== Welcome to Business RPG ===",
                "You start with $1,000 and weekly expenses of $450.",
                "Find a job to earn income and manage your finances!",
                "Use the 'Jobs' tab to find employment.",
                "Use the 'Balance Sheet' tab to track your finances.",
                "Click 'Advance 1 Week' to progress time.",
                "=" * 40
            ]
            expected_lines.extend(welcome_msg)
        
        # Add log entries
        expected_lines.extend(log_entries)
        
        expected_content = "\n".join(expected_lines)
        
        # Only update if content has changed
        if current_content != expected_content.strip():
            self.log_text.delete("1.0", tk.END)
            self.log_text.insert("1.0", expected_content + "\n")
        
        self.log_text.config(state=tk.DISABLED)
        
        # Auto-scroll to bottom if enabled and user was at bottom
        if self.auto_scroll_var.get() and (was_at_bottom or not current_content):
            self.log_text.see(tk.END)
    
    def clear_log(self):
        """Clear the game log"""
        self.log_text.config(state=tk.NORMAL)
        self.log_text.delete("1.0", tk.END)
        self.log_text.config(state=tk.DISABLED)
        
        # Clear the log in main window too
        current = self.parent
        while current and not hasattr(current, 'game_log'):
            current = current.master
        
        if current and hasattr(current, 'game_log'):
            current.game_log.clear()
        
        # Re-add initial message
        self.add_initial_message()
    
    def add_log_entry(self, message):
        """Add a new entry to the log"""
        self.log_text.config(state=tk.NORMAL)
        self.log_text.insert(tk.END, message + "\n")
        self.log_text.config(state=tk.DISABLED)
        
        if self.auto_scroll_var.get():
            self.log_text.see(tk.END)