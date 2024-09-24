from django.urls import path
from api import views

image_analysis = views.MoodDetectViewSet.as_view({
    'post': 'image_analysis'
})

signup = views.MoodDetectViewSet.as_view({
    'post': 'signup'
})

login = views.MoodDetectViewSet.as_view({
    'post': 'login'
})

view_users = views.MoodDetectViewSet.as_view({
    'post': 'view_users'
})

view_followers = views.MoodDetectViewSet.as_view({
    'post': 'view_followers'
})

view_following = views.MoodDetectViewSet.as_view({
    'post': 'view_following'
})

follow_user = views.MoodDetectViewSet.as_view({
    'post': 'follow_user'
})
get_songs_by_mood = views.MoodDetectViewSet.as_view({
    'post': 'get_songs_by_mood'
})
urlpatterns = [
    path("post-image/", image_analysis),
    path("signup/", signup),
    path("login/", login),
    path("view-users/", view_users),
    path("view-followers/", view_followers),
    path("view-following/", view_following),
    path("follow-user/", follow_user),
    path('get-songs-by-mood/', get_songs_by_mood)
]
