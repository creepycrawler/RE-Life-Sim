#!/usr/bin/env python3
"""
Business RPG - A text-based business simulation game
Main entry point for the game
"""

import tkinter as tk
from tkinter import ttk
from game.game_manager import GameManager
from gui.main_window import MainWindow

def main():
    # Initialize the main window
    root = tk.Tk()
    root.title("Business RPG")
    root.geometry("800x600")
    root.resizable(True, True)
    
    # Initialize game manager
    game_manager = GameManager()
    
    # Initialize and show the main window
    main_window = MainWindow(root, game_manager)
    
    # Start the game loop
    root.mainloop()

if __name__ == "__main__":
    main()