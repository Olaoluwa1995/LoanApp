from django.contrib import admin

from .models import (
    UserProfile, 
    ProductCategory,
    ProductSubCategory,
    Product,
    User,
    CustomUser,
    Loan,
    Tenure,
    Card,
    CustomAdmin
)


# class OrderAdmin(admin.ModelAdmin):
#     list_display = ['user',
#                     'ordered',
#                     'being_delivered',
#                     'received',
#                     'refund_requested',
#                     'refund_granted',
#                     'shipping_address',
#                     'billing_address',
#                     'payment',
#                     'coupon'
#                     ]
#     list_display_links = [
#         'user',
#         'shipping_address',
#         'billing_address',
#         'payment',
#         'coupon'
#     ]
#     list_filter = ['ordered',
#                    'being_delivered',
#                    'received',
#                    'refund_requested',
#                    'refund_granted']
#     search_fields = [
#         'user__username',
#         'ref_code'
#     ]
#   actions = [make_refund_accepted]


admin.site.register(UserProfile)
admin.site.register(ProductCategory)
admin.site.register(ProductSubCategory)
admin.site.register(Product)
admin.site.register(CustomUser)
admin.site.register(Loan)
admin.site.register(Card)
admin.site.register(Tenure)
admin.site.register(CustomAdmin)
admin.site.register(User)

