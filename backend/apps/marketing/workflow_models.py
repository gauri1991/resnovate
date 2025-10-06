from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid
import json

User = get_user_model()

class WorkflowTemplate(models.Model):
    """Predefined workflow templates for common marketing scenarios"""
    TEMPLATE_CATEGORIES = [
        ('onboarding', 'User Onboarding'),
        ('nurturing', 'Lead Nurturing'),
        ('retention', 'Customer Retention'),
        ('reactivation', 'Win-Back Campaign'),
        ('upsell', 'Upsell/Cross-sell'),
        ('event', 'Event Marketing'),
        ('product_launch', 'Product Launch'),
        ('seasonal', 'Seasonal Campaign'),
    ]
    
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=TEMPLATE_CATEGORIES)
    description = models.TextField()
    template_structure = models.JSONField(default=dict, help_text="Workflow structure template")
    estimated_duration = models.DurationField(help_text="Expected campaign duration")
    target_audience = models.JSONField(default=list, help_text="Suggested target segments")
    success_metrics = models.JSONField(default=list, help_text="Key metrics to track")
    usage_count = models.IntegerField(default=0)
    avg_performance_score = models.FloatField(default=0.0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', 'name']

class MarketingWorkflow(models.Model):
    """Main workflow orchestrator"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]
    
    TRIGGER_TYPES = [
        ('manual', 'Manual Start'),
        ('scheduled', 'Scheduled'),
        ('behavioral', 'Behavioral Trigger'),
        ('api', 'API Trigger'),
        ('webhook', 'Webhook'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    workflow_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    template = models.ForeignKey(WorkflowTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Configuration
    trigger_type = models.CharField(max_length=50, choices=TRIGGER_TYPES, default='manual')
    trigger_config = models.JSONField(default=dict, help_text="Trigger configuration")
    entry_conditions = models.JSONField(default=dict, help_text="Who can enter this workflow")
    exit_conditions = models.JSONField(default=dict, help_text="Automatic exit conditions")
    
    # Flow structure
    workflow_steps = models.JSONField(default=list, help_text="Ordered list of workflow steps")
    decision_logic = models.JSONField(default=dict, help_text="Branching and decision rules")
    
    # Execution settings
    max_participants = models.IntegerField(null=True, blank=True, help_text="Max concurrent participants")
    execution_window = models.JSONField(default=dict, help_text="Time windows for execution")
    frequency_cap = models.JSONField(default=dict, help_text="Frequency limitations")
    
    # Status and metrics
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_recurring = models.BooleanField(default=False)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    
    # Performance tracking
    total_participants = models.IntegerField(default=0)
    active_participants = models.IntegerField(default=0)
    completed_participants = models.IntegerField(default=0)
    conversion_rate = models.FloatField(default=0.0)
    avg_completion_time = models.DurationField(null=True, blank=True)
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='workflows')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_executed = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']

class WorkflowStep(models.Model):
    """Individual steps within a workflow"""
    STEP_TYPES = [
        ('email', 'Send Email'),
        ('sms', 'Send SMS'),
        ('webhook', 'Webhook Call'),
        ('delay', 'Wait/Delay'),
        ('condition', 'Conditional Branch'),
        ('tag', 'Add/Remove Tag'),
        ('score', 'Update Lead Score'),
        ('task', 'Create Task'),
        ('notification', 'Send Notification'),
        ('api_call', 'External API Call'),
        ('form', 'Display Form'),
        ('redirect', 'Page Redirect'),
        ('personalization', 'Update Personalization'),
    ]
    
    workflow = models.ForeignKey(MarketingWorkflow, on_delete=models.CASCADE, related_name='steps')
    step_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    step_number = models.IntegerField()
    step_type = models.CharField(max_length=50, choices=STEP_TYPES)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Step configuration
    config = models.JSONField(default=dict, help_text="Step-specific configuration")
    conditions = models.JSONField(default=dict, help_text="Execution conditions")
    
    # Flow control
    next_steps = models.JSONField(default=list, help_text="Possible next steps")
    parent_step = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    
    # Execution settings
    delay_before = models.DurationField(null=True, blank=True, help_text="Delay before execution")
    delay_after = models.DurationField(null=True, blank=True, help_text="Delay after execution")
    retry_attempts = models.IntegerField(default=3)
    timeout_duration = models.DurationField(null=True, blank=True)
    
    # Performance metrics
    execution_count = models.IntegerField(default=0)
    success_count = models.IntegerField(default=0)
    failure_count = models.IntegerField(default=0)
    success_rate = models.FloatField(default=0.0)
    avg_execution_time = models.DurationField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['step_number']
        unique_together = ['workflow', 'step_number']

class WorkflowParticipant(models.Model):
    """Tracks individuals going through workflows"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('exited', 'Exited'),
    ]
    
    workflow = models.ForeignKey(MarketingWorkflow, on_delete=models.CASCADE, related_name='participants')
    participant_id = models.CharField(max_length=200, help_text="External participant identifier")
    participant_data = models.JSONField(default=dict, help_text="Participant context data")
    
    # Progress tracking
    current_step = models.ForeignKey(WorkflowStep, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    progress_percentage = models.FloatField(default=0.0)
    
    # Timing
    entered_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    next_execution = models.DateTimeField(null=True, blank=True)
    
    # Journey tracking
    steps_completed = models.JSONField(default=list)
    execution_history = models.JSONField(default=list, help_text="Step execution log")
    conversion_events = models.JSONField(default=list)
    
    class Meta:
        unique_together = ['workflow', 'participant_id']

class WorkflowExecution(models.Model):
    """Individual step executions for tracking and debugging"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('skipped', 'Skipped'),
        ('timeout', 'Timeout'),
    ]
    
    participant = models.ForeignKey(WorkflowParticipant, on_delete=models.CASCADE, related_name='executions')
    step = models.ForeignKey(WorkflowStep, on_delete=models.CASCADE, related_name='executions')
    execution_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    started_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    execution_time = models.DurationField(null=True, blank=True)
    
    # Execution details
    input_data = models.JSONField(default=dict)
    output_data = models.JSONField(default=dict)
    error_message = models.TextField(blank=True)
    retry_count = models.IntegerField(default=0)
    
    # Context
    execution_context = models.JSONField(default=dict)
    triggered_by = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['-started_at']

class WorkflowAnalytics(models.Model):
    """Aggregated analytics for workflows"""
    workflow = models.OneToOneField(MarketingWorkflow, on_delete=models.CASCADE, related_name='analytics')
    
    # Participation metrics
    total_entries = models.IntegerField(default=0)
    unique_participants = models.IntegerField(default=0)
    completion_rate = models.FloatField(default=0.0)
    dropout_rate = models.FloatField(default=0.0)
    
    # Performance metrics
    avg_completion_time = models.DurationField(null=True, blank=True)
    fastest_completion = models.DurationField(null=True, blank=True)
    slowest_completion = models.DurationField(null=True, blank=True)
    
    # Step analysis
    bottleneck_steps = models.JSONField(default=list, help_text="Steps causing delays")
    high_failure_steps = models.JSONField(default=list, help_text="Steps with high failure rates")
    optimization_suggestions = models.JSONField(default=list)
    
    # Conversion tracking
    conversion_goals = models.JSONField(default=dict)
    goal_completion_rates = models.JSONField(default=dict)
    revenue_attribution = models.JSONField(default=dict)
    
    # Time-based metrics
    performance_by_time = models.JSONField(default=dict, help_text="Performance by hour/day/week")
    seasonal_patterns = models.JSONField(default=dict)
    
    last_calculated = models.DateTimeField(auto_now=True)
    
class WorkflowTrigger(models.Model):
    """Advanced trigger configurations"""
    TRIGGER_TYPES = [
        ('event', 'User Event'),
        ('schedule', 'Time-based Schedule'),
        ('condition', 'Condition Met'),
        ('api', 'API Trigger'),
        ('form_submission', 'Form Submission'),
        ('page_visit', 'Page Visit'),
        ('email_interaction', 'Email Interaction'),
        ('score_threshold', 'Lead Score Threshold'),
        ('tag_change', 'Tag Addition/Removal'),
        ('date_field', 'Date Field Trigger'),
    ]
    
    workflow = models.ForeignKey(MarketingWorkflow, on_delete=models.CASCADE, related_name='triggers')
    name = models.CharField(max_length=200)
    trigger_type = models.CharField(max_length=50, choices=TRIGGER_TYPES)
    
    # Trigger configuration
    conditions = models.JSONField(default=dict, help_text="Trigger conditions")
    filters = models.JSONField(default=dict, help_text="Additional filters")
    schedule_config = models.JSONField(default=dict, help_text="Schedule configuration")
    
    # Behavior settings
    is_active = models.BooleanField(default=True)
    max_triggers_per_user = models.IntegerField(null=True, blank=True)
    cooldown_period = models.DurationField(null=True, blank=True)
    
    # Performance tracking
    trigger_count = models.IntegerField(default=0)
    last_triggered = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

class WorkflowAction(models.Model):
    """Reusable action definitions"""
    ACTION_TYPES = [
        ('email_send', 'Send Email'),
        ('sms_send', 'Send SMS'),
        ('webhook_call', 'Call Webhook'),
        ('api_request', 'API Request'),
        ('tag_operation', 'Tag Operation'),
        ('score_update', 'Update Score'),
        ('data_update', 'Update Data'),
        ('notification', 'Send Notification'),
        ('task_creation', 'Create Task'),
        ('integration_sync', 'Sync with Integration'),
    ]
    
    name = models.CharField(max_length=200)
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    description = models.TextField(blank=True)
    
    # Action configuration
    config_template = models.JSONField(default=dict, help_text="Configuration template")
    required_parameters = models.JSONField(default=list)
    optional_parameters = models.JSONField(default=list)
    
    # Execution settings
    is_async = models.BooleanField(default=False)
    timeout_seconds = models.IntegerField(default=30)
    retry_policy = models.JSONField(default=dict)
    
    # Usage tracking
    usage_count = models.IntegerField(default=0)
    success_rate = models.FloatField(default=0.0)
    avg_execution_time = models.DurationField(null=True, blank=True)
    
    # Metadata
    is_system = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']