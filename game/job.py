"""
Job class for representing employment opportunities
"""

class Job:
    def __init__(self, title, weekly_salary, description="", requirements=None):
        self.title = title
        self.weekly_salary = weekly_salary
        self.description = description
        self.requirements = requirements or []
    
    def __str__(self):
        return f"{self.title} - ${self.weekly_salary}/week"
    
    def get_details(self):
        """Get detailed job information"""
        return {
            "title": self.title,
            "weekly_salary": self.weekly_salary,
            "description": self.description,
            "requirements": self.requirements
        }

class JobMarket:
    """Manages available jobs in the game"""
    
    def __init__(self):
        self.available_jobs = [
            Job("Fast Food Worker", 300, "Entry-level position at a fast food restaurant"),
            Job("Retail Associate", 350, "Customer service and sales at a retail store"),
            Job("Coffee Shop Barista", 320, "Make coffee and serve customers"),
            Job("Office Assistant", 450, "Basic administrative tasks and filing"),
            Job("Data Entry Clerk", 400, "Input data into computer systems"),
            Job("Customer Service Rep", 500, "Handle customer inquiries by phone"),
            Job("Warehouse Worker", 480, "Package and ship products in a warehouse"),
            Job("Junior Accountant", 650, "Basic accounting and bookkeeping tasks", ["Some accounting knowledge"]),
            Job("Marketing Assistant", 600, "Help with marketing campaigns and social media", ["Communication skills"]),
            Job("Sales Associate", 550, "Sell products and meet sales targets", ["Sales experience preferred"]),
        ]
    
    def get_available_jobs(self):
        """Get list of all available jobs"""
        return self.available_jobs.copy()
    
    def get_job_by_title(self, title):
        """Find a job by its title"""
        for job in self.available_jobs:
            if job.title == title:
                return job
        return None