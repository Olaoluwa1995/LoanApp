from rest_framework import serializers
from core.models import (
    UserProfile, 
    Product, 
    ProductCategory,
    ProductSubCategory,
    Card,
    Loan,
    Tenure,
    CustomUser,
    CustomAdmin, 
    User
)
from django.http import HttpRequest
from django.contrib.auth import get_user_model, authenticate
from django.core.validators import RegexValidator
from django.utils.translation import ugettext_lazy as _

class StringSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value

class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    superuser_status = serializers.SerializerMethodField()
    # date_joined = fields.DateTimeField(format='YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]')

    class Meta:
        model = UserProfile
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'phone',
            'superuser_status'
        )

    def get_username(self, obj):
        return obj.get_username()

    def get_email(self, obj):
        return obj.get_email()

    def get_first_name(self, obj):
        return obj.get_first_name()

    def get_last_name(self, obj):
        return obj.get_last_name()

    def get_phone(self, obj):
        return obj.get_phone()

    def get_superuser_status(self, obj):
        return obj.get_superuser_status()



class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
           'username',
           'first_name',
           'last_name',
           'email',
           'phone',
        )

class CustomAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomAdmin
        fields = (
            'id',
           'username',
           'first_name',
           'last_name',
           'email',
           'phone',
        )

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            'id',
           'photo',
        )

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ('id', 'category_name', 'icon')

class ProductSubCategorySerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer()
    
    class Meta:
        model = ProductSubCategory
        fields = ('id', 'sub_category_name', 'category','icon')

class ProductSerializer(serializers.ModelSerializer):
    sub_category = ProductSubCategorySerializer()

    class Meta:
        model = Product
        fields = ('id', 'product_name', 'amount', 'sub_category','icon')


class CustomUserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = CustomUser
        fields = '__all__'

    def create(self, validated_data):
        return CustomUser.objects.create_customuser(**validated_data)


class CustomAdminRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = CustomAdmin
        fields = '__all__'

    def create(self, validated_data):
        return CustomAdmin.objects.create_customadmin(**validated_data)



class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        # The `validate` method is where we make sure that the current
        # instance of `LoginSerializer` has "valid". In the case of logging a
        # user in, this means validating that they've provided an email
        # and password and that this combination matches one of the users in
        # our database.
        username = data.get('username', None)
        password = data.get('password', None)

        # The `authenticate` method is provided by Django and handles checking
        # for a user that matches this email/password combination. Notice how
        # we pass `email` as the `username` value since in our User
        # model we set `USERNAME_FIELD` as `email`.
        user = authenticate(username=username, password=password)

        # If no user was found matching this email/password combination then
        # `authenticate` will return `None`. Raise an exception in this case.
        if user is None:
            raise serializers.ValidationError(
                'A user with this username and password is not found.'
            )
        try:
            userObj = CustomUser.objects.get(username=user.username)
        except CustomUser.DoesNotExist:
             raise serializers.ValidationError(
                'User with given username and password does not exists'
             )
        # if userObj is None:
        #     if user.is_superuser is True:
        #             userObj = User.objects.get(username=user.username)
        #     else:
        #         raise serializers.ValidationError(
        #         'User with given username and password does not exists'
        #     )

        # Django provides a flag on our `User` model called `is_active`. The
        # purpose of this flag is to tell us whether the user has been banned
        # or deactivated. This will almost never be the case, but
        # it is worth checking. Raise an exception in this case.
        if not user.is_active:
            raise serializers.ValidationError(
                'This user has been deactivated.'
            )

        # The `validate` method should return a dictionary of validated data.
        # This is the data that is passed to the `create` and `update` methods
        # # that we will see later on.
        # if not user.is_staff:
        #     raise serializers.ValidationError(
        #         'You are not permitted to log in'
        #     )
        return {
            'username': user.username,
            'token': user.token
        }

class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        username = data.get('username', None)
        password = data.get('password', None)

        user = authenticate(username=username, password=password)

        if user is None:
            raise serializers.ValidationError(
                'A user with this username and password is not found.'
            )

        try:
            userObj = CustomAdmin.objects.get(username=user.username)
        except CustomAdmin.DoesNotExist:
            raise serializers.ValidationError(
                'User with given username and password is not an admin'
            )

        if not user.is_active:
            raise serializers.ValidationError(
                'This user has been deactivated.'
            )

        return {
            'username': user.username,
            'token': user.token
        }

class ChangePasswordSerializer(serializers.Serializer):
    model = User

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)





# class RegisterSerializer(serializers.Serializer):
#     # first_name = serializers.CharField(
#     #     required=False, allow_blank=True, max_length=50)
#     # last_name = serializers.CharField(
#     #     required=False, allow_blank=True, max_length=50)
#     # username = serializers.CharField(
#     #     max_length=get_username_max_length(),
#     #     min_length=allauth_settings.USERNAME_MIN_LENGTH,
#     #     required=allauth_settings.USERNAME_REQUIRED
#     # )
#     # phone_regex = RegexValidator(
#     #     regex=r'^\ ?1?\d{9,11}$', message="Phone number must be entered in the format: ' 999999999'. Up to 11 digits allowed.")
#     # phone = serializers.CharField(max_length=11,
#     #                               validators=[phone_regex])
#     # email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
#     # password1 = serializers.CharField(write_only=True)

#     password2 = serializers.CharField(write_only=True)

#     class Meta:
#         model = CustomUser
#         fields = (
#             'id',
#            'username',
#            'first_name',
#            'last_name',
#            'email',
#            'phone',
#            'password1'
#         )

#     def validate_phone(self, phone):
#         phone = get_adapter().clean_phone(phone)
#         return phone

#     def validate_first_name(self, first_name):
#         first_name = get_adapter().clean_first_name(first_name)
#         return first_name

#     def validate_last_name(self, last_name):
#         last_name = get_adapter().clean_last_name(last_name)
#         return last_name

#     def validate_username(self, username):
#         username = get_adapter().clean_username(username)
#         return username

#     def validate_email(self, email):
#         email = get_adapter().clean_email(email)
#         if allauth_settings.UNIQUE_EMAIL:
#             if email and email_address_exists(email):
#                 raise serializers.ValidationError(
#                     _("A user is already registered with this e-mail address."))
#         return email

#     def validate_password1(self, password1):
#         return get_adapter().clean_password(password1)

#     def validate(self, data):
#         if data['password1'] != data['password2']:
#             raise serializers.ValidationError(
#                 _("The two password fields didn't match."))
#         return data

#     def custom_signup(self, request, user):
#         pass

#     def get_cleaned_data(self):
#         return {
#             'username': self.validated_data.get('username', ''),
#             'first_name': self.validated_data.get('first_name', ''),
#             'last_name': self.validated_data.get('last_name', ''),
#             'password1': self.validated_data.get('password1', ''),
#             'email': self.validated_data.get('email', ''),
#             'phone': self.validated_data.get('phone', ''),
#         }

#     def save(self, request):
#         adapter = get_adapter()
#         user = adapter.new_user(request)
#         self.cleaned_data = self.get_cleaned_data()
#         adapter.save_user(request, user, form, self)
#         self.custom_signup(request, user)
#         setup_user_email(request, user, [])
#         return user


class TenureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenure
        fields = ('id', 'duration', 'interest')

class CardSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Card
        fields = (
            'id',
            'user',
            'auth_code',
            'reference',
            'first_name',
            'last_name',
            'email',
            'card_type',
            'card_bin',
            'last_4',
            'expiry_month',
            'expiry_year'
        )

class LoanSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    card = serializers.StringRelatedField()
    product = serializers.StringRelatedField()
    user_profile = ImageSerializer()

    class Meta:
        model = Loan
        fields = (
            'id',
            'user',
            'card',
            'product',
            'tenure',
            'interest',
            'amount',
            'status',
            'due_date',
            'user_profile'
        )


class LoanAdminSerializer(LoanSerializer):
    user = CustomAdminSerializer()