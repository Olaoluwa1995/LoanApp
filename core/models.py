from django.db.models.signals import post_save
from django.conf import settings
from django.utils import timezone
from django.core.validators import RegexValidator
import json
from django.core import serializers
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager, Group
from datetime import datetime, timedelta
import jwt
import time

STATUS_CHOICES = (
    ('Pending', 'Pending'),
    ('Active', 'Active'),
    ('Cancelled', 'Cancelled'),
    ('Completed', 'Completed'),
    ('Defaulting', 'Defaulting'),
    ('Rejected', 'Rejected'),
)

# class CustomUser(AbstractUser):
#     phone_regex = RegexValidator(
#         regex=r'^\ ?1?\d{9,11}$', message="Phone number must be entered in the format: ' 999999999'. Up to 11 digits allowed.")
#     phone = models.CharField(max_length=11,
#                              validators=[phone_regex], blank=True, null=True)
    
#     def __str__(self):
#         return self.username

# class CustomAdmin(models.Model):
#     user = models.OneToOneField(
#         CustomUser, on_delete=models.CASCADE)
#     permissions = models.ManyToManyField(
#          'Permission', related_name="permissions")

#     class Meta:
#         verbose_name = 'Admin'
#         verbose_name_plural = 'Admins'

#     def __str__(self):
#         return self.user.username

#     def get_username(self):
#         return self.user.username

#     def get_email(self):
#         return self.user.email

#     def get_first_name(self):
#         return self.user.first_name
        
#     def get_last_name(self):
#         return self.user.last_name

#     def get_phone(self):
#         return self.user.phone

#     def get_password(self):
#         return self.user.password

class Permission(models.Model):
    can_accept_loan = models.BooleanField(default=True)
    can_reject_loan = models.BooleanField(default=True)
    can_view_loans = models.BooleanField(default=True)
    can_create_product = models.BooleanField(default=True)
    can_delete_product = models.BooleanField(default=True)
    can_edit_product = models.BooleanField(default=True)
    can_view_products = models.BooleanField(default=True)
    can_view_all_users = models.BooleanField(default=True)


class UserManager(BaseUserManager):

    def get_by_natural_key(self, username):
        return self.get(username=username)

    def create_superuser(self, username, password):
        """
        Creates and saves a superuser with the given username and password.
        """
        user = User(username=username,)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save()
        return user


class CustomUserManager(BaseUserManager):

    def create_customuser(self, username, first_name, last_name, email, phone, password=None):
        if username is None:
            raise TypeError('Users must have a username.')
        customuser = CustomUser(username=username, first_name=first_name, last_name=last_name,
                          email=self.normalize_email(email),
                          phone=phone)
        customuser.set_password(password)
        customuser.is_active = True
        customuser.save()
        # customuser.groups.add(Group.objects.get(name="Student"))
        return customuser


class CustomAdminManager(BaseUserManager):

    def create_customadmin(self, username, first_name, last_name, email, phone, password=None):
        if username is None:
            raise TypeError('Users must have a username.')
        customadmin = CustomAdmin(username=username, first_name=first_name, last_name=last_name,
                            email=self.normalize_email(email),
                            phone=phone)
        customadmin.set_password(password)
        customadmin.is_active = True
        customadmin.save()
        # customadmin.groups.add(Group.objects.get(name="Employee"))
        return customadmin

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=100, db_index=True, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(db_index=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    phone_regex = RegexValidator(
         regex=r'^\ ?1?\d{9,11}$', message="Phone number must be entered in the format: ' 999999999'. Up to 11 digits allowed.")
    phone = models.CharField(max_length=11,
                              validators=[phone_regex], blank=True, null=True)

    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'username'
    # REQUIRED_FIELDS = ['first_name', 'last_name', ]

    objects = UserManager()

    @property
    def token(self):
        dt = datetime.now() + timedelta(days=15)
        token = jwt.encode({
            'id': self.pk,
            'exp': int(time.mktime(dt.timetuple()))
        }, settings.SECRET_KEY, algorithm='HS256')
        return token.decode('utf-8')

    def get_full_name(self):
        return (self.first_name + ' ' + self.last_name)

    def get_short_name(self):
        return self.first_name

    def natural_key(self):
        return (self.first_name, self.last_name)

    def __str__(self):
        return self.username

REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'phone']
class CustomUser(User, PermissionsMixin):

    class Meta:
        ordering = ('-created_at', '-updated_at')
        verbose_name_plural = 'Customers'

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = REQUIRED_FIELDS

    objects = CustomUserManager()

    def __str__(self):
        return self.username



class CustomAdmin(User, PermissionsMixin):

    class Meta:
        ordering = ('-created_at', '-updated_at')
        verbose_name_plural = 'Admins'

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = REQUIRED_FIELDS

    objects = CustomAdminManager()

    def __str__(self):
        return self.username



# class CustomAdmin(models.Model):
#     permissions = models.ManyToManyField(
#         'Permission', related_name="permissions")
#     username = models.CharField(
#          max_length=50,
#          unique=True,
#      )
#     first_name = models.CharField(max_length=50)
#     last_name = models.CharField(max_length=50)
#     phone_regex = RegexValidator(
#          regex=r'^\ ?1?\d{9,11}$', message="Phone number must be entered in the format: ' 999999999'. Up to 11 digits allowed.")
#     phone = models.CharField(max_length=11,
#                                    validators=[phone_regex])
#     email = models.EmailField(max_length=200)
#     password = models.CharField(max_length=200)
#     publish = models.DateTimeField(default=timezone.now)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)



#     def __str__(self):
#         return self.username

#     class Meta:
#         ordering = ('-publish','-updated_at')
#         verbose_name = 'Admin'
#         verbose_name_plural = 'Admins'

class UserProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='users/%Y/%m/%d/', null=True,
                              blank=True)

    def __str__(self):
        return self.user.username

    def get_username(self):
        return self.user.username

    def get_email(self):
        return self.user.email

    def get_first_name(self):
        return self.user.first_name
        
    def get_last_name(self):
        return self.user.last_name

    def get_phone(self):
        return self.user.phone

    def get_superuser_status(self):
        return self.user.is_superuser

class AbstractCategory(models.Model):
    description = models.TextField(null=True,blank=True)
    icon = models.ImageField(upload_to='icons/%Y/%m/%d/', blank=True, null=True)
    publish = models.DateTimeField(default=timezone.now)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class ProductCategory(AbstractCategory):
    category_name = models.CharField(max_length=100)

    class Meta:
        ordering = ('-publish','-updated')
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.category_name


class ProductSubCategory(AbstractCategory):
    category = models.ForeignKey(
        'ProductCategory', on_delete=models.CASCADE)
    sub_category_name = models.CharField(max_length=100)
    
    class Meta:
        ordering = ('-publish','-updated')
        verbose_name_plural = 'Sub Categories'

    def __str__(self):
        return self.sub_category_name

class Product(AbstractCategory):
    sub_category = models.ForeignKey(
        'ProductSubCategory', on_delete=models.CASCADE)
    product_name = models.CharField(max_length=100)
    amount = models.CharField(max_length=50)

    class Meta:
        ordering = ('-publish','-updated')
        verbose_name_plural = 'Products'

    def __str__(self):
        return self.product_name


class ObjectCreateAndUpdateTimes(models.Model):
    publish = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class Card(ObjectCreateAndUpdateTimes):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE)
    auth_code = models.CharField(max_length=100)
    reference = models.CharField(max_length=100)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    card_type = models.CharField(max_length=30)
    card_bin = models.CharField(max_length=200)
    last_4 = models.CharField(max_length=10)
    expiry_month = models.CharField(max_length=20)
    expiry_year = models.CharField(max_length=20)
    bank = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = 'Cards'
        ordering = ('-publish', )

    def __str__(self):
        return f"{self.user.username} {self.bank} {self.card_type}"

class Tenure(ObjectCreateAndUpdateTimes):
    duration = models.IntegerField()
    interest = models.CharField(max_length=10)

    class Meta:
        verbose_name_plural = 'Tenures'

    def __str__(self):
        return f"{self.duration} days"

class Loan(ObjectCreateAndUpdateTimes):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE)
    card = models.ForeignKey(Card,
                             on_delete=models.CASCADE)
    product = models.ForeignKey(Product,
                             on_delete=models.CASCADE)
    user_profile = models.ForeignKey(UserProfile,
                             on_delete=models.CASCADE)
    tenure = models.IntegerField()
    interest = models.CharField(max_length=10)
    amount = models.CharField(max_length=50)
    repayment = models.CharField(max_length=50)
    repayment_plus_default = models.CharField(max_length=50)
    amount_debited = models.CharField(max_length=50,default=0)
    due_date = models.DateField()
    default_date = models.DateField()
    date_disbursed = models.DateTimeField(blank=True, null=True)
    date_completed = models.DateTimeField(blank=True, null=True)
    repayment_reference = models.CharField(max_length=100, blank=True, null=True)
    defaulted = models.BooleanField(default=False)
    status = models.CharField(choices=STATUS_CHOICES, max_length=100, default="Pending")

    class Meta:
        verbose_name_plural = 'Loans'
        ordering = ('-updated_at', '-publish', )

    def __str__(self):
        return f"{self.product.product_name} by {self.user.username}"

    # def get_user_photo(self):
    #     photo = UserProfile.objects.get(pk=1).photo
    #     print(photo)
    #     return photo.

def userprofile_receiver(sender, instance, created, *args, **kwargs):
    if created:
        userprofile = UserProfile.objects.create(user=instance)


post_save.connect(userprofile_receiver, sender=CustomUser)
post_save.connect(userprofile_receiver, sender=CustomAdmin)
