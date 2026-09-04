## Existing Indian Visa Application workflow

```graphql
type User @table {
  email: String!
  passwordHash: String!
  name: String
  phone: String
}

type Applicant @table {
  user: User!
  surname: String!
  givenName: String!
  fullName: String!
  email: String
  mobile: String
  dateOfBirth: Date
  nationality: String
  gender: String
  photoPath: String
  passportNumber: String!
  passportIssueDate: Date
  passportExpiryDate: Date
  nidNumber: String!
  status: String!
}

type AutomationAccount @table {
  applicant: Applicant!
  email: String!
  mobile: String!
  ivacPassword: String
  emailVerifiedAt: Timestamp
  mobileVerifiedAt: Timestamp
  lastLoginAt: Timestamp
  lastLogoutAt: Timestamp
  accountStatus: String!
}

type IVACApplication @table {
  applicant: Applicant!
  mission: String
  ivacCenter: String
  status: String!
  appointmentBookingAvailableAt: Timestamp
  missionConfirmedAt: Timestamp
  completedAt: Timestamp
  errorMessage: String
}

type Webfile @table {
  ivacApplication: IVACApplication!
  webfileNumber: String!
  type: String!
  filePath: String
  originalName: String
  status: String!
  uploadedAt: Timestamp
  confirmedAt: Timestamp
  errorMessage: String
}

type Appointment @table {
  ivacApplication: IVACApplication!
  appointmentType: String
  appointmentDate: Date
  appointmentTime: String
  confirmedAt: Timestamp
  errorMessage: String
  status: String!
}

type AppointmentAttempt @table {
  ivacApplication: IVACApplication!
  ivacCenter: String
  appointmentDate: Date
  appointmentTime: String
  status: String!
  failureReason: String
  responseData: String
  attemptedAt: Timestamp
}

type Payment @table {
  ivacApplication: IVACApplication!
  appointment: Appointment
  gateway: String!
  transactionId: String
  paymentMethod: String
  amount: Float
  currency: String!
  status: String!
  paidAt: Timestamp
  gatewayResponse: String
}

type Invoice @table {
  ivacApplication: IVACApplication!
  payment: Payment
  invoiceNumber: String
  filePath: String
  originalName: String
  downloadedAt: Timestamp
}

type AutomationRun @table {
  automationAccount: AutomationAccount
  ivacApplication: IVACApplication
  type: String!
  status: String!
  startedAt: Timestamp
  completedAt: Timestamp
  errorMessage: String
}

type AutomationLog @table {
  automationRun: AutomationRun!
  stepOrder: Int!
  step: String!
  status: String!
  message: String
  error: String
  metadata: String
  startedAt: Timestamp
  completedAt: Timestamp
}
```

Functions build: npm run build --prefix functions
Extension type check: npm run type-check

getByRole('button', { name: 'Close notice' })
getByRole('button', { name: 'Close popup' })

getByRole('button', { name: 'Sign In' })
getByRole('link', { name: 'Sign Up' })
getByRole('textbox', { name: 'sample@gmail.com' })
getByRole('button', { name: 'Send OTP' })
getByRole('button', { name: 'Next Step' })

getByRole('textbox', { name: '01......' })
getByRole('textbox', { name: 'Enter your password' })
getByRole('button', { name: 'Sign In Now' })

## Close Popups

1. close first notice popup.
2. close second popup.

## Sign Up Process

1. enter email.
2. send otp click button.
3. enter otp from email.
4. verify otp click ->
5. enter contact number.
6. send otp click button.
7. enter otp from mobile.
8. click next step button.
9. enter date of birth.
10. enter Passport Number.
11. enter nid number.
12. enter Surname (as passport).
13. enter given name (as passport).
14. click sign up button.
15. Enter password.
16. enter Confirm Password.
17. click sign up button.
18. click first consent check box.
19. click second consent check box.
20. click third consent check box.
21. click sign up button.

## Sign In Process

1. enter email.
2. enter password.
3. human input for - i am not robot check.
4. click sign in now
5. enter otp from mobile

## Upload Webfile and Confirm Mission & Indian Visa Application Center Process

1. click take your appointment button.
2. click next step button.
3. Upload primary applicant's Webfile.
4. Upload other Webfile (if have any).
5. click all the information is correct button.
6. form confirm dialog click save & continue button.
7. Select a mission (Dhaka).
8. Select you Indian Visa Application center (Indian Visa Application, Dhaka (JFP)).
9. click Confirm Mission & Indian Visa Application Center.

Please login again at 6:00PM to book your appointment

Sign In Again After 6

## Book Appointment & Payment Process

1. click take your appointment button.
2. click next step button
3. Select Appointment Date
4. Select Appointment Time
5. I'm not robot verification
6. click Continue Booking
7. Click Pay With SSL Commerz
8. Click Continue Payment button

For Card
-> Enter Card Number
-> Enter MM/YY
-> Enter CVC/CVV
-> Enter Card Holder Name
For Mobile Banking
-> Select bKash
-> follow any process
-> continue
-> click download invoice button

## Sign Out Process

1.
2.

```

```
