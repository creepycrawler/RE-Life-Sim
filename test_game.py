#!/usr/bin/env python3
"""
Test script for Business RPG to validate all components work
"""

import sys
import traceback

def test_imports():
    """Test that all modules can be imported"""
    print("Testing imports...")
    
    try:
        import tkinter as tk
        print("✓ tkinter imported successfully")
    except ImportError as e:
        print("✗ tkinter import failed:", e)
        return False
    
    try:
        from game.game_manager import GameManager
        print("✓ GameManager imported successfully")
    except ImportError as e:
        print("✗ GameManager import failed:", e)
        return False
        
    try:
        from game.player import Player
        print("✓ Player imported successfully")
    except ImportError as e:
        print("✗ Player import failed:", e)
        return False
        
    try:
        from game.job import Job, JobMarket
        print("✓ Job classes imported successfully")
    except ImportError as e:
        print("✗ Job classes import failed:", e)
        return False
        
    try:
        from gui.main_window import MainWindow
        print("✓ MainWindow imported successfully")
    except ImportError as e:
        print("✗ MainWindow import failed:", e)
        return False
    
    return True

def test_game_logic():
    """Test basic game logic"""
    print("\nTesting game logic...")
    
    try:
        from game.player import Player
        from game.job import Job
        
        # Test player creation
        player = Player("Test Player", 1000)
        print(f"✓ Player created: {player.name} with ${player.cash}")
        
        # Test job creation
        job = Job("Test Job", 500, "A test job")
        print(f"✓ Job created: {job.title} paying ${job.weekly_salary}/week")
        
        # Test applying for job
        player.apply_for_job(job)
        print(f"✓ Player applied for job: {player.current_job.title}")
        
        # Test advancing time
        initial_cash = player.cash
        result = player.advance_week()
        print(f"✓ Week advanced. Cash changed from ${initial_cash} to ${player.cash}")
        print(f"  Income: ${result['income']}, Expenses: ${result['expenses']}")
        
        # Test balance sheet
        balance = player.get_balance_sheet()
        print(f"✓ Balance sheet generated. Net worth: ${balance['net_worth']}")
        
        return True
        
    except Exception as e:
        print("✗ Game logic test failed:", e)
        traceback.print_exc()
        return False

def test_job_market():
    """Test job market functionality"""
    print("\nTesting job market...")
    
    try:
        from game.job import JobMarket
        
        market = JobMarket()
        jobs = market.get_available_jobs()
        print(f"✓ Job market created with {len(jobs)} jobs")
        
        for i, job in enumerate(jobs[:3]):  # Show first 3 jobs
            print(f"  {i+1}. {job.title} - ${job.weekly_salary}/week")
        
        # Test finding job by title
        first_job = jobs[0]
        found_job = market.get_job_by_title(first_job.title)
        if found_job and found_job.title == first_job.title:
            print("✓ Job lookup by title works")
        else:
            print("✗ Job lookup by title failed")
            return False
            
        return True
        
    except Exception as e:
        print("✗ Job market test failed:", e)
        traceback.print_exc()
        return False

def main():
    print("Business RPG - Component Testing")
    print("=" * 40)
    
    all_passed = True
    
    # Run tests
    all_passed &= test_imports()
    all_passed &= test_game_logic() 
    all_passed &= test_job_market()
    
    print("\n" + "=" * 40)
    if all_passed:
        print("✓ All tests passed! The game should work correctly.")
        print("\nTo start the game:")
        print("  python3 main.py")
        print("  or")
        print("  ./run_game.sh")
    else:
        print("✗ Some tests failed. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()