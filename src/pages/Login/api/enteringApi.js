import getBaseUrl from 'getBaseUrl';

// export const createSejamiotp = () => getBaseUrl() + 'Accounts/CreateSejamOtp';

// export const checkIsSejamiApi = (nationalId) =>
//   getBaseUrl() + `Accounts/IsSejami?nationalId=${nationalId} `;

// export const sendRegisterDataApi = () => getBaseUrl() + 'Accounts/Register';

export const SendforgetpasswordOtpApi = () => getBaseUrl() + 'Accounts/CreateSepehrOTP';

export const SendForgetpasswordDataApi = () => getBaseUrl() + 'Accounts/ForgotPassword';
