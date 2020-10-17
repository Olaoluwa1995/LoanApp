const localhost = "http://127.0.0.1:8000";

const apiURL = "/api";

export const endpoint = `${localhost}${apiURL}`;

export const registerURL = `${localhost}/registration/`;
export const adminRegisterURL = `${localhost}/admin-registration/`;
export const loginURL = `${localhost}/user-login/`;
export const adminLoginURL = `${localhost}/admin-login/`;

export const userIDURL = `${endpoint}/user-id/`;
export const tenureListURL = `${endpoint}/tenure/`;
export const loanURL = `${endpoint}/loan/`;
export const loanUpdateURL = (loanId) => `${endpoint}/loan/${loanId}/update/`;
export const cardPaymentURL = `${endpoint}/card-payment/`;
export const cardDetailURL = `${endpoint}/card/`;
export const profileDetailURL = (profileID) => `${endpoint}/profile/${profileID}/`;
export const profileImageDetailURL = (profileID) => `${endpoint}/image/${profileID}/`;
export const profileUpdateURL = (profileID) => `${endpoint}/profile/${profileID}/update/`;
export const passwordUpdateURL = (profileID) => `${endpoint}/change-password/${profileID}/update/`;
export const imageUpdateURL = (profileID) => `${endpoint}/image/${profileID}/update/`;
export const userLoanListURL = `${endpoint}/user-loans/`;
export const userLoansDetailURL = (loanId) => `${endpoint}/user-loans/${loanId}/`;
export const allLoansDetailURL = (loanId) => `${endpoint}/all-loans/${loanId}/`;
export const allLoanListURL = `${endpoint}/all-loans/`;
export const subscriptionProductListURL = `${endpoint}/subscription-products/`;
export const subscriptionProductCreateURL = `${endpoint}/subscription-products/create/`;
export const subscriptionProductCategoryListURL = `${endpoint}/subscription-products-category/`;
export const subscriptionProductCategoryCreateURL = `${endpoint}/subscription-products-category/create/`;
export const subscriptionProductSubCategoryListURL = `${endpoint}/subscription-products-sub-category/`;
export const subscriptionProductSubCategoryCreateURL = `${endpoint}/subscription-products-sub-category/create/`;