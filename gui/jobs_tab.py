"""
Jobs Tab - Job market and employment management
"""

import tkinter as tk
from tkinter import ttk, messagebox

class JobsTab:
    def __init__(self, parent, game_manager):
        self.parent = parent
        self.game_manager = game_manager
        
        # Create main frame
        self.frame = ttk.Frame(parent)
        self.setup_ui()
    
    def setup_ui(self):
        """Set up the jobs interface"""
        # Main container with padding
        main_container = ttk.Frame(self.frame)
        main_container.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Title
        title_label = ttk.Label(main_container, text="Job Market", font=("Arial", 14, "bold"))
        title_label.pack(pady=(0, 20))
        
        # Current job section
        current_job_frame = ttk.LabelFrame(main_container, text="Current Employment", padding=15)
        current_job_frame.pack(fill=tk.X, pady=(0, 20))
        
        self.current_job_label = ttk.Label(current_job_frame, text="Status: Unemployed", font=("Arial", 11))
        self.current_job_label.pack(anchor=tk.W, pady=2)
        
        self.current_salary_label = ttk.Label(current_job_frame, text="", font=("Arial", 11))
        self.current_salary_label.pack(anchor=tk.W, pady=2)
        
        # Quit job button
        self.quit_job_btn = ttk.Button(
            current_job_frame, 
            text="Quit Job", 
            command=self.quit_job,
            state=tk.DISABLED
        )
        self.quit_job_btn.pack(anchor=tk.W, pady=(10, 0))
        
        # Available jobs section
        jobs_frame = ttk.LabelFrame(main_container, text="Available Jobs", padding=15)
        jobs_frame.pack(fill=tk.BOTH, expand=True)
        
        # Create treeview for job listings
        columns = ("Title", "Salary", "Description")
        self.jobs_tree = ttk.Treeview(jobs_frame, columns=columns, show="headings", height=10)
        
        # Configure columns
        self.jobs_tree.heading("Title", text="Job Title")
        self.jobs_tree.heading("Salary", text="Weekly Salary")
        self.jobs_tree.heading("Description", text="Description")
        
        self.jobs_tree.column("Title", width=200, minwidth=150)
        self.jobs_tree.column("Salary", width=120, minwidth=100)
        self.jobs_tree.column("Description", width=350, minwidth=250)
        
        # Scrollbar for treeview
        scrollbar = ttk.Scrollbar(jobs_frame, orient=tk.VERTICAL, command=self.jobs_tree.yview)
        self.jobs_tree.configure(yscrollcommand=scrollbar.set)
        
        # Pack treeview and scrollbar
        self.jobs_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Job details and apply section
        details_frame = ttk.Frame(main_container)
        details_frame.pack(fill=tk.X, pady=(10, 0))
        
        self.job_details_label = ttk.Label(details_frame, text="Select a job to view details", font=("Arial", 10))
        self.job_details_label.pack(anchor=tk.W, pady=(0, 10))
        
        # Apply button
        self.apply_btn = ttk.Button(
            details_frame, 
            text="Apply for Job", 
            command=self.apply_for_job,
            state=tk.DISABLED
        )
        self.apply_btn.pack(anchor=tk.W)
        
        # Bind treeview selection
        self.jobs_tree.bind("<<TreeviewSelect>>", self.on_job_select)
        
        # Populate initial job listings
        self.populate_jobs()
    
    def populate_jobs(self):
        """Populate the job listings"""
        # Clear existing items
        for item in self.jobs_tree.get_children():
            self.jobs_tree.delete(item)
        
        # Get available jobs
        jobs = self.game_manager.get_available_jobs()
        
        # Add jobs to treeview
        for job in jobs:
            self.jobs_tree.insert("", tk.END, values=(
                job.title,
                f"${job.weekly_salary}/week",
                job.description
            ))
    
    def on_job_select(self, event):
        """Handle job selection in treeview"""
        selection = self.jobs_tree.selection()
        if selection:
            item = self.jobs_tree.item(selection[0])
            job_title = item['values'][0]
            
            # Find the job object
            jobs = self.game_manager.get_available_jobs()
            selected_job = None
            for job in jobs:
                if job.title == job_title:
                    selected_job = job
                    break
            
            if selected_job:
                # Update job details
                details_text = f"Job: {selected_job.title}\n"
                details_text += f"Weekly Salary: ${selected_job.weekly_salary}\n"
                details_text += f"Description: {selected_job.description}\n"
                
                if selected_job.requirements:
                    details_text += f"Requirements: {', '.join(selected_job.requirements)}"
                else:
                    details_text += "Requirements: None"
                
                self.job_details_label.config(text=details_text)
                self.apply_btn.config(state=tk.NORMAL)
        else:
            self.job_details_label.config(text="Select a job to view details")
            self.apply_btn.config(state=tk.DISABLED)
    
    def apply_for_job(self):
        """Apply for the selected job"""
        selection = self.jobs_tree.selection()
        if not selection:
            return
        
        item = self.jobs_tree.item(selection[0])
        job_title = item['values'][0]
        
        # Check if player already has this job
        status = self.game_manager.get_player_status()
        if status['current_job'] == job_title:
            messagebox.showinfo("Already Employed", "You already have this job!")
            return
        
        # Apply for the job
        success = self.game_manager.apply_for_job(job_title)
        
        if success:
            messagebox.showinfo("Job Application", f"Congratulations! You got the job as {job_title}!")
            self.update()
        else:
            messagebox.showerror("Job Application", "Sorry, your application was not successful.")
    
    def quit_job(self):
        """Quit the current job"""
        status = self.game_manager.get_player_status()
        if status['current_job'] == "Unemployed":
            return
        
        # Confirm quitting
        result = messagebox.askyesno(
            "Quit Job", 
            f"Are you sure you want to quit your job as {status['current_job']}?"
        )
        
        if result:
            success = self.game_manager.quit_current_job()
            if success:
                messagebox.showinfo("Job Quit", "You have quit your job.")
                self.update()
    
    def update(self):
        """Update the jobs tab display"""
        status = self.game_manager.get_player_status()
        
        # Update current job section
        current_job = status['current_job']
        if current_job != "Unemployed":
            self.current_job_label.config(text=f"Status: Employed as {current_job}")
            self.current_salary_label.config(text=f"Weekly Salary: ${status['weekly_income']:.2f}")
            self.quit_job_btn.config(state=tk.NORMAL)
        else:
            self.current_job_label.config(text="Status: Unemployed")
            self.current_salary_label.config(text="Weekly Salary: $0.00")
            self.quit_job_btn.config(state=tk.DISABLED)
        
        # Refresh job listings (in case anything changed)
        self.populate_jobs()