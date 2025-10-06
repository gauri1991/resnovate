from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Lead, NewsletterSubscriber
from .serializers import LeadSerializer, NewsletterSubscriberSerializer


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        # Temporarily allow anonymous access for testing admin integration
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def quick_contact(self, request):
        """Quick contact form endpoint"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(source='website')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def subscribe(self, request):
        """Newsletter subscription endpoint"""
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=email,
            defaults={'active': True}
        )
        
        if not created and not subscriber.active:
            subscriber.active = True
            subscriber.save()
        
        serializer = self.get_serializer(subscriber)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
