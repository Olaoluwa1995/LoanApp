from celery import shared_task
from time import sleep
from django.conf import settings
from .models import Loan, CustomUser
from paystackapi.paystack import Paystack
from paystackapi.transaction import Transaction

paystack_secret_key = settings.PAYSTACK_SECRET_KEY
paystack = Paystack(secret_key=paystack_secret_key)

@shared_task
def adding_task(x, y):
    sum = x + y
    print(f"The sum of x and y is {sum}")
    return (sum)

@shared_task
def charge_loans():
    active_loans = Loan.objects.filter(status="Active")
    pending_loans = Loan.objects.filter(status="Pending")

    for loan in active_loans:
        all_loans = [loan for loan in active_loans]
        print(all_loans)
        amount = loan.amount
        email = loan.user.email
        auth_code = loan.card.auth_code
        reference = loan.card.reference

        response = Transaction.charge(reference=f"{reference}", authorization_code=f"{auth_code}", email=f"{email}", amount=f"{amount}")
        loan_response = [response for loan in active_loans]
        print(loan_response)
        return loan_response