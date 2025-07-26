"""
Game Manager - Coordinates all game systems and state
"""

from .player import Player
from .job import JobMarket

class GameManager:
    def __init__(self):
        self.player = Player("Player", starting_cash=1000)
        self.job_market = JobMarket()
        self.game_started = False
        self.callbacks = []  # For GUI updates
    
    def start_new_game(self, player_name="Player"):
        """Start a new game with given player name"""
        self.player = Player(player_name, starting_cash=1000)
        self.game_started = True
        self.notify_callbacks("game_started")
    
    def add_callback(self, callback):
        """Add callback for game state changes"""
        self.callbacks.append(callback)
    
    def notify_callbacks(self, event_type, data=None):
        """Notify all registered callbacks of game events"""
        for callback in self.callbacks:
            callback(event_type, data)
    
    def advance_turn(self):
        """Process one turn (1 week) of game time"""
        if not self.game_started:
            return None
        
        week_result = self.player.advance_week()
        self.notify_callbacks("week_advanced", week_result)
        return week_result
    
    def apply_for_job(self, job_title):
        """Player applies for a job"""
        job = self.job_market.get_job_by_title(job_title)
        if job:
            success = self.player.apply_for_job(job)
            if success:
                self.notify_callbacks("job_acquired", job)
                return True
        return False
    
    def quit_current_job(self):
        """Player quits their current job"""
        if self.player.current_job:
            old_job = self.player.current_job
            self.player.quit_job()
            self.notify_callbacks("job_quit", old_job)
            return True
        return False
    
    def get_player_status(self):
        """Get current player status"""
        return self.player.get_balance_sheet()
    
    def get_available_jobs(self):
        """Get list of available jobs"""
        return self.job_market.get_available_jobs()
    
    def get_current_week(self):
        """Get current week number"""
        return self.player.week
    
    def is_game_over(self):
        """Check if game is over (player is bankrupt)"""
        return self.player.cash < 0