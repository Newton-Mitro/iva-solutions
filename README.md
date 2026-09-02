```php
Schema::create('applicants', function (Blueprint $table) {
    $table->id();
    $table->string('surname');
    $table->string('given_name');
    $table->string('full_name');
    $table->string('email')->nullable();
    $table->string('mobile')->nullable();
    $table->string('passport_number')->unique();
    $table->string('nid_number')->unique();
    $table->date('passport_issue_date')->nullable();
    $table->date('passport_expiry_date')->nullable();
    $table->date('date_of_birth')->nullable();
    $table->string('nationality')->nullable();
    $table->string('gender')->nullable();
    $table->text('address')->nullable();
    $table->string('ivac_password')->nullable();
    $table->string('photo_path')->nullable();
    $table->enum('status', ['active', 'inactive',])->default('active');
    $table->timestamps();
});

Schema::create('visa_applications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('applicant_id')->constrained('applicants')->cascadeOnDelete();
    $table->string('mission')->nullable();
    $table->string('web_file_number')->nullable()->index();
    $table->string('ivac_center')->nullable();
    $table->string('visa_type')->nullable();
    $table->string('passport_number');
    $table->string('full_name');
    $table->string('email')->nullable();
    $table->string('mobile')->nullable();
    $table->string('appointment_type')->nullable();
    $table->date('appointment_date')->nullable();
    $table->time('appointment_time')->nullable();
    $table->string('application_number')->nullable()->index();
    $table->decimal('application_fee', 10, 2)->nullable();
    $table->decimal('convenience_fee', 10, 2)->nullable();
    $table->decimal('total_amount', 10, 2)->nullable();
    $table->string('payment_status')->default('unpaid');
    $table->string('transaction_id')->nullable()->index();
    $table->string('status')->default('draft')->index();
    $table->json('metadata')->nullable();
    $table->timestamps();
});

Schema::create('appointment_attempts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('visa_application_id')->constrained('visa_applications')->cascadeOnDelete();
    $table->string('ivac_center')->nullable();
    $table->date('appointment_date')->nullable();
    $table->time('appointment_time')->nullable();
    $table->string('status')->default('attempted');
    $table->string('failure_reason')->nullable();
    $table->json('response_data')->nullable();
    $table->timestamp('attempted_at')->nullable();
    $table->timestamps();
    $table->index(['visa_application_id', 'status']);
});

Schema::create('payment_transactions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('visa_application_id')->constrained('visa_applications')->cascadeOnDelete();
    $table->string('transaction_id')->nullable()->index();
    $table->decimal('application_fee', 10, 2)->nullable();
    $table->decimal('convenience_fee', 10, 2)->nullable();
    $table->decimal('total_amount', 10, 2)->nullable();
    $table->string('payment_method')->nullable();
    $table->string('status')->default('pending')->index();
    $table->timestamp('initiated_at')->nullable();
    $table->timestamp('completed_at')->nullable();
    $table->json('gateway_response')->nullable();
    $table->text('failure_reason')->nullable();
    $table->timestamps();
});

Schema::create('applicant_documents', function (Blueprint $table) {
    $table->id();
    $table->foreignId('applicant_id')->constrained('applicants')->cascadeOnDelete();
    $table->string('document_type');
    $table->string('original_name');
    $table->string('file_path');
    $table->string('disk')->default('public');
    $table->string('mime_type')->nullable();
    $table->unsignedBigInteger('file_size')->nullable();
    $table->string('status')->default('pending');
    $table->json('metadata')->nullable();
    $table->text('notes')->nullable();
    $table->timestamps();
    $table->index(['applicant_id', 'document_type',]);
});
```

## Close Popups

## Sign Up Process

enter email -> send otp click -> enter otp from email
-> verify otp click -> enter contact number -> send otp click
-> enter otp from mobile -> click next step button
-> enter date of birth -> enter Passport Number
-> enter nid number -> enter Surname (as passport)
-> enter given name (as passport) -> click sign up button
-> Enter password -> enter Confirm Password -> click sign up button
-> click all consent check box (3) -> click sign up button

## Sign In Process

enter email -> enter password -> i am not robot check -> click sign in now
-> enter otp from mobile

## Appointment Process (After Sign In)

click take your appointment button -> click next step button
-> Upload primary applicant's Webfile
-> Upload other applicant's Webfile (if have any)
-> click all the information is correct button
-> form confirm dialog click save & continue button
-> Select a mission (Dhaka)
-> Select you IVAC center (IVAC, Dhaka (JFP))
-> click Confirm Mission & IVAC Center

Please login again at 6:00PM to book your appointment

Sign In Again After 6

## Appointment Application Process

click take your appointment button -> click next step button
-> Select Appointment Date -> Select Appointment Time
-> I'm not robot verification -> click Continue Booking
-> Click Pay With SSL Commerz -> Click Continue Payment button
For Card
-> Enter Card Number -> Enter MM/YY -> Enter CVC/CVV
-> Enter Card Holder Name
For Mobile Banking
-> Select bKash
-> follow any process
-> continue
-> click download invoice button

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

## Sign Up Process

## Sign In Process

## Submit Application Process

## Sign In Process

## Book Appointment Process
