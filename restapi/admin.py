from django.contrib import admin
from restapi.models import MlModel,Factor,Comment,User

# Register your models here.

admin.site.register(MlModel)
admin.site.register(Factor)
admin.site.register(Comment)
admin.site.register(User)
