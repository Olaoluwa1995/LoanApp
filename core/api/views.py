from django_countries import countries
from django.db.models import Q
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404, HttpResponse
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.views.decorators.debug import sensitive_post_parameters
from django.utils.translation import ugettext_lazy as _
from django.utils.decorators import method_decorator

from rest_framework.renderers import JSONRenderer
from rest_framework.generics import (
    ListAPIView, 
    RetrieveAPIView, 
    CreateAPIView,
    UpdateAPIView, 
    DestroyAPIView,
)
from rest_framework import permissions
from rest_framework.status import (
    HTTP_200_OK, 
    HTTP_400_BAD_REQUEST, 
    HTTP_201_CREATED, 
    HTTP_401_UNAUTHORIZED, 
    HTTP_404_NOT_FOUND, 
    HTTP_405_METHOD_NOT_ALLOWED, 
    HTTP_204_NO_CONTENT
)
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import (AllowAny,
                                        IsAuthenticated)
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import (
    ProfileSerializer,
    ProductSerializer, 
    ProductCategorySerializer, 
    ProductSubCategorySerializer,
    TenureSerializer, 
    ImageSerializer,
    CustomUserSerializer,
    CustomUserRegistrationSerializer,
    LoanSerializer,
    CustomAdminRegistrationSerializer, 
    UserLoginSerializer,
    AdminLoginSerializer,
    CardSerializer,
    ChangePasswordSerializer,
    LoanAdminSerializer
)


from core.models import (
    UserProfile,
    Product,
    ProductCategory,
    ProductSubCategory,
    CustomUser,
    Card,
    Tenure,
    Loan,
    CustomAdmin,
    User
)

import pdb
import datetime

from paystackapi.paystack import Paystack
from paystackapi.transaction import Transaction

paystack_secret_key = settings.PAYSTACK_SECRET_KEY
paystack = Paystack(secret_key=paystack_secret_key)

class UserIDView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({'userID': request.user.id}, status=HTTP_200_OK)


class CardView(RetrieveAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = CardSerializer

    def get_object(self):
        try:
            card = Card.objects.get(user=self.request.user)
            return card
        except ObjectDoesNotExist:
            raise Http404("You do not have a registered card")

class ProfileDetailView(RetrieveAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = ProfileSerializer

    def get_object(self):
        try:
            profile = UserProfile.objects.get(user=self.request.user)
            return profile
        except ObjectDoesNotExist:
            raise Http404("You do not have a profile")

class ProfileImageDetailView(RetrieveAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = ImageSerializer

    def get_object(self):
        try:
            profile = UserProfile.objects.get(user=self.request.user)
            return profile
        except ObjectDoesNotExist:
            raise Http404("You do not have a profile image")

class ProfileUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = CustomUserSerializer
    queryset = User.objects.all()

class ProfileImageUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = ImageSerializer
    queryset = UserProfile.objects.all()

class ProductListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

class ProductCreateView(CreateAPIView):
    def post(self, request, *args, **kwargs):
        subCategoryId = request.data.get('subCategoryId',None)
        product_name = request.data.get('product_name',None)
        amount = request.data.get('amount',None)
        print(subCategoryId, product_name, amount)

        sub_category = ProductSubCategory.objects.get(pk=subCategoryId)
        product = Product(sub_category=sub_category,product_name=product_name, amount=amount)
        product.save()
        return Response(status=HTTP_201_CREATED)

class ProductCategoryListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = ProductCategorySerializer
    queryset = ProductCategory.objects.all()

class ProductCategoryCreateView(CreateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = ProductCategorySerializer
    queryset = ProductCategory.objects.all()
    
class ProductSubCategoryListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = ProductSubCategorySerializer
    queryset = ProductSubCategory.objects.all()

class ProductSubCategoryCreateView(APIView):
   def post(self, request, *args, **kwargs):
        categoryId = request.data.get('categoryId',None)
        sub_category_name = request.data.get('sub_category_name',None)
        print(categoryId, sub_category_name)

        category = ProductCategory.objects.get(pk=categoryId)
        sub_category = ProductSubCategory(category=category,sub_category_name=sub_category_name)

        sub_category.save()
        return Response(status=HTTP_201_CREATED)

class UserRegistrationView(APIView):
    permission_classes = (AllowAny,)
    renderer_classes = [JSONRenderer]
    serializer_class = CustomUserRegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminRegistrationView(APIView):
    permission_classes = (AllowAny,)
    renderer_classes = [JSONRenderer]
    serializer_class = CustomAdminRegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    permission_classes = (AllowAny,)
    renderer_classes = [JSONRenderer]
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminLoginView(APIView):
    permission_classes = (AllowAny,)
    renderer_classes = [JSONRenderer]
    serializer_class = AdminLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ChangePasswordView(UpdateAPIView):
        """
        An endpoint for changing password.
        """
        serializer_class = ChangePasswordSerializer
        model = User
        permission_classes = (IsAuthenticated,)

        def get_object(self, queryset=None):
            obj = self.request.user
            return obj

        def update(self, request, *args, **kwargs):
            self.object = self.get_object()
            serializer = self.get_serializer(data=request.data)

            if serializer.is_valid():
                # Check old password
                if not self.object.check_password(serializer.data.get("old_password")):
                    return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
                # set_password also hashes the password that the user will get
                self.object.set_password(serializer.data.get("new_password"))
                self.object.save()
                print(self.object)
                return Response({"message": "Password updated successfully"}, status=HTTP_200_OK)
            return Response({"message": "Password updated successfully"}, status=HTTP_200_OK)

class CardPaymentView(APIView):
    def post(self, request, *args, **kwargs):
        response = request.data.get('response',None)
        userID = request.data.get('userID', None)

        reference = response["reference"]
        status = response["status"]

        if reference is not None and status == "success":
            verify_response = Transaction.verify(reference=f"{reference}")
            
            user = User.objects.get(pk=userID)
            reference = verify_response["data"]["reference"]
            auth_code = verify_response["data"]["authorization"]["authorization_code"]
            card_bin = verify_response["data"]["authorization"]["bin"]
            last_4 = verify_response["data"]["authorization"]["last4"]
            expiry_month = verify_response["data"]["authorization"]["exp_month"]
            expiry_year = verify_response["data"]["authorization"]["exp_year"]
            card_type = verify_response["data"]["authorization"]["card_type"]
            bank = verify_response["data"]["authorization"]["bank"]
            first_name = verify_response["data"]["customer"]["first_name"]
            last_name = verify_response["data"]["customer"]["last_name"]
            email = verify_response["data"]["customer"]["email"]
            
            card = Card(
                user = user, 
                reference = reference, 
                auth_code = auth_code, 
                card_bin = card_bin, 
                last_4 = last_4,
                expiry_month = expiry_month,
                expiry_year = expiry_year,
                card_type = card_type,
                bank = bank,
                first_name = first_name,
                last_name = last_name,
                email = email
            )

            card_qs = Card.objects.filter(user = user)
            
            if card_qs.exists():
                return Response({"message": "You already have a registered card"}, status=HTTP_400_BAD_REQUEST)
            else:
                card.save()
                return Response(status=HTTP_201_CREATED)

        return Response(status=HTTP_200_OK)

class TenureListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = TenureSerializer
    queryset = Tenure.objects.all()

class LoanView(APIView):
    def post(self, request, *args, **kwargs):
        TenureId = request.data.get('TenureId',None)
        productId = request.data.get('ProductId',None)
        userID = request.data.get('userID', None)

        user = User.objects.get(pk=userID)
        product = Product.objects.get(pk=productId)
        tenure = Tenure.objects.get(pk=TenureId)
        user_profile = UserProfile.objects.get(user=user)
        
        card = Card.objects.get(user=user)
        amount = product.amount

        if tenure.duration == 15:
            tenure = 15
            due_date = timezone.now().date() + datetime.timedelta(days=15)
            interest = "5"
            interestAmount = (int(interest)/100) * int(amount)

        else:
            tenure = 30
            due_date = timezone.now().date() + datetime.timedelta(days=30)
            interest = "7.5"
            interestAmount = (float(interest)/100) * int(amount)
            
        repayment = (int(amount) + int(interestAmount))
        repayment_plus_default = repayment
        default_date = due_date + datetime.timedelta(days=3)

        loan = Loan(
                user = user, 
                product = product,
                tenure = tenure,
                user_profile = user_profile,
                interest = interest,
                card = card,
                amount = amount,
                due_date = due_date,
                default_date = default_date,
                repayment = repayment,
                repayment_plus_default = repayment_plus_default
            )

        print(loan.status)
        loan_qs = Loan.objects.filter(user = user)
        active_loan_qs = loan_qs.filter(status = "Active")
        print(active_loan_qs)
            
        if active_loan_qs.exists(): 
            return Response({"message": "You have an active loan"}, status=HTTP_400_BAD_REQUEST)
        else:
            loan.save()
            return Response(status=HTTP_201_CREATED)

        pdb.set_trace()
        return Response(status=HTTP_200_OK)

class LoanUpdateView(APIView):
    def put(self, request, *args, **kwargs):
        uncancel = request.data.get('uncancel',None)
        cancel = request.data.get('cancel',None)
        approve = request.data.get('approve',None)
        reject = request.data.get('reject',None)
        loanId = request.data.get('loanId',None)

        print(uncancel)
        print(cancel)
        print(loanId)
        print(reject)

        loan = Loan.objects.get(pk=loanId)
        if cancel == True:
            loan.status = "Cancelled"
            loan.save()
            print(loan.status)
            return Response({"message": "Your loan has been successfully cancelled"}, status=HTTP_200_OK)


        if approve == True:
            loan.status = "Active"
            loan.save()
            print(loan.status)
            return Response({"message": "Loan successfully accepted"}, status=HTTP_200_OK)
        
        if reject == True:
            loan.status = "Rejected"
            loan.save()
            print(loan.status)
            return Response({"message": "Loan successfully rejected"}, status=HTTP_200_OK)


        pdb.set_trace()
        return Response(status=HTTP_200_OK)

class UserLoanListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = LoanSerializer

    def get_queryset(self):
        return Loan.objects.filter(user=self.request.user)


class UserLoanDetailView(RetrieveAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = LoanSerializer
    
    def get_queryset(self):
        return Loan.objects.filter(user=self.request.user)

class AdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        admin = CustomAdmin.objects.all()
        if request.user in admin:
            return request.user and request.user.is_active
        else:
            return Response({"message": "You are not permitted to view"}, status=HTTP_400_BAD_REQUEST)


class AllLoanListView(ListAPIView):
    permission_classes = (AdminPermission, )
    serializer_class = LoanAdminSerializer
    queryset = Loan.objects.all()

class AllLoanDetailView(RetrieveAPIView):
    permission_classes = (AdminPermission, )
    serializer_class = LoanSerializer
    queryset = Loan.objects.all()

