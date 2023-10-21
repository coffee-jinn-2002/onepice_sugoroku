from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameStateViewSet, index
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'gamestate', GameStateViewSet)

urlpatterns = [
    path('api/', include(router.urls)),  # API関連のエンドポイント
    path('', index, name='index'),  # Vue.jsアプリのエンドポイント
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
