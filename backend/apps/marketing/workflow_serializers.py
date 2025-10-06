from rest_framework import serializers
from .workflow_models import (
    WorkflowTemplate,
    MarketingWorkflow,
    WorkflowStep,
    WorkflowParticipant,
    WorkflowExecution,
    WorkflowAnalytics,
    WorkflowTrigger,
    WorkflowAction
)

class WorkflowTemplateSerializer(serializers.ModelSerializer):
    usage_count = serializers.IntegerField(read_only=True)
    avg_performance_score = serializers.FloatField(read_only=True)
    
    class Meta:
        model = WorkflowTemplate
        fields = [
            'id', 'name', 'category', 'description', 'template_structure',
            'estimated_duration', 'target_audience', 'success_metrics',
            'usage_count', 'avg_performance_score', 'is_featured',
            'created_at', 'updated_at'
        ]

class WorkflowStepSerializer(serializers.ModelSerializer):
    success_rate = serializers.FloatField(read_only=True)
    
    class Meta:
        model = WorkflowStep
        fields = [
            'id', 'step_id', 'step_number', 'step_type', 'name', 'description',
            'config', 'conditions', 'next_steps', 'parent_step',
            'delay_before', 'delay_after', 'retry_attempts', 'timeout_duration',
            'execution_count', 'success_count', 'failure_count', 'success_rate',
            'avg_execution_time', 'created_at', 'updated_at'
        ]

class WorkflowTriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowTrigger
        fields = [
            'id', 'name', 'trigger_type', 'conditions', 'filters',
            'schedule_config', 'is_active', 'max_triggers_per_user',
            'cooldown_period', 'trigger_count', 'last_triggered',
            'created_at', 'updated_at'
        ]

class MarketingWorkflowSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True)
    steps_count = serializers.SerializerMethodField()
    triggers_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MarketingWorkflow
        fields = [
            'id', 'name', 'description', 'workflow_id', 'template', 'template_name',
            'trigger_type', 'trigger_config', 'entry_conditions', 'exit_conditions',
            'workflow_steps', 'decision_logic', 'max_participants', 'execution_window',
            'frequency_cap', 'status', 'is_recurring', 'start_date', 'end_date',
            'total_participants', 'active_participants', 'completed_participants',
            'conversion_rate', 'avg_completion_time', 'created_by', 'created_by_name',
            'created_at', 'updated_at', 'last_executed', 'steps_count', 'triggers_count'
        ]
    
    def get_steps_count(self, obj):
        return obj.steps.count()
    
    def get_triggers_count(self, obj):
        return obj.triggers.count()

class WorkflowDetailSerializer(MarketingWorkflowSerializer):
    steps = WorkflowStepSerializer(many=True, read_only=True)
    triggers = WorkflowTriggerSerializer(many=True, read_only=True)
    
    class Meta(MarketingWorkflowSerializer.Meta):
        fields = MarketingWorkflowSerializer.Meta.fields + ['steps', 'triggers']

class WorkflowParticipantSerializer(serializers.ModelSerializer):
    workflow_name = serializers.CharField(source='workflow.name', read_only=True)
    current_step_name = serializers.CharField(source='current_step.name', read_only=True)
    
    class Meta:
        model = WorkflowParticipant
        fields = [
            'id', 'workflow', 'workflow_name', 'participant_id', 'participant_data',
            'current_step', 'current_step_name', 'status', 'progress_percentage',
            'entered_at', 'last_activity', 'completed_at', 'next_execution',
            'steps_completed', 'execution_history', 'conversion_events'
        ]

class WorkflowExecutionSerializer(serializers.ModelSerializer):
    participant_id = serializers.CharField(source='participant.participant_id', read_only=True)
    step_name = serializers.CharField(source='step.name', read_only=True)
    
    class Meta:
        model = WorkflowExecution
        fields = [
            'id', 'execution_id', 'participant', 'participant_id', 'step', 'step_name',
            'status', 'started_at', 'completed_at', 'execution_time',
            'input_data', 'output_data', 'error_message', 'retry_count',
            'execution_context', 'triggered_by'
        ]

class WorkflowAnalyticsSerializer(serializers.ModelSerializer):
    workflow_name = serializers.CharField(source='workflow.name', read_only=True)
    
    class Meta:
        model = WorkflowAnalytics
        fields = [
            'workflow', 'workflow_name', 'total_entries', 'unique_participants',
            'completion_rate', 'dropout_rate', 'avg_completion_time',
            'fastest_completion', 'slowest_completion', 'bottleneck_steps',
            'high_failure_steps', 'optimization_suggestions', 'conversion_goals',
            'goal_completion_rates', 'revenue_attribution', 'performance_by_time',
            'seasonal_patterns', 'last_calculated'
        ]

class WorkflowActionSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = WorkflowAction
        fields = [
            'id', 'name', 'action_type', 'description', 'config_template',
            'required_parameters', 'optional_parameters', 'is_async',
            'timeout_seconds', 'retry_policy', 'usage_count', 'success_rate',
            'avg_execution_time', 'is_system', 'is_active', 'created_by',
            'created_by_name', 'created_at', 'updated_at'
        ]

# Summary serializers for dashboards
class WorkflowSummarySerializer(serializers.Serializer):
    total_workflows = serializers.IntegerField()
    active_workflows = serializers.IntegerField()
    paused_workflows = serializers.IntegerField()
    total_participants = serializers.IntegerField()
    active_participants = serializers.IntegerField()
    avg_conversion_rate = serializers.FloatField()
    total_executions_today = serializers.IntegerField()
    successful_executions_today = serializers.IntegerField()
    failed_executions_today = serializers.IntegerField()

class WorkflowPerformanceSerializer(serializers.Serializer):
    workflow_id = serializers.IntegerField()
    workflow_name = serializers.CharField()
    participants = serializers.IntegerField()
    completion_rate = serializers.FloatField()
    conversion_rate = serializers.FloatField()
    avg_completion_time = serializers.DurationField()
    last_7_days_trend = serializers.DictField()

class WorkflowTemplateStatsSerializer(serializers.Serializer):
    template_id = serializers.IntegerField()
    template_name = serializers.CharField()
    category = serializers.CharField()
    usage_count = serializers.IntegerField()
    avg_performance = serializers.FloatField()
    success_rate = serializers.FloatField()