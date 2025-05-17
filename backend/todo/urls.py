from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet

router = DefaultRouter()
router.register(r'todos', TodoViewSet, basename='todo')
urlpatterns = [
    # other auth urls from dj-rest-auth
    path('api/', include(router.urls)),
]
