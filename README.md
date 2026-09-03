```php
Schema::create('applicants', function (Blueprint $table) {
    $table->id();
    $table->string('surname');
    $table->string('given_name');
    $table->string('full_name');
    $table->string('email')->nullable();
    $table->string('mobile')->nullable();
    $table->date('date_of_birth')->nullable();
    $table->string('nationality')->nullable();
    $table->string('gender')->nullable();
    $table->string('photo_path')->nullable();

    $table->string('passport_number')->unique();
    $table->date('passport_issue_date')->nullable();
    $table->date('passport_expiry_date')->nullable();
    $table->string('nid_number')->unique();

    $table->enum('status', ['active', 'inactive',])->default('active');
    $table->timestamps();
});

Schema::create('automation_accounts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('applicant_id')->constrained('applicants')->cascadeOnDelete();
    $table->string('email')->unique();
    $table->string('mobile')->unique();
    $table->string('ivac_password')->nullable();
    $table->timestamp('email_verified_at')->nullable();
    $table->timestamp('mobile_verified_at')->nullable();
    $table->timestamp('last_login_at')->nullable();
    $table->timestamp('last_logout_at')->nullable();
    $table->enum('account_status', ['pending', 'email_verified',
    'mobile_verified', 'active', 'locked', 'disabled'])->default('pending')->index();
    $table->timestamps();
});

Schema::create('ivac_applications', function (Blueprint $table) {
    $table->id();
    $table->foreignId('applicant_id')->constrained('applicants')->cascadeOnDelete();
    $table->string('mission')->nullable();
    $table->string('ivac_center')->nullable();
    $table->enum('status', [
        'draft',

        // Signup
        'signup_pending',
        'signup_completed',

        // Webfile
        'webfile_pending',
        'webfile_uploaded',

        // Mission
        'mission_pending',
        'mission_confirmed',

        // Appointment
        'waiting_for_appointment',
        'appointment_booking',
        'appointment_selected',

        // Payment
        'payment_pending',
        'payment_processing',
        'payment_completed',

        'completed',
        'failed',
        'cancelled',
    ])->default('draft');
    $table->timestamp('appointment_booking_available_at')->nullable();
    $table->timestamp('mission_confirmed_at')->nullable();
    $table->timestamp('completed_at')->nullable();
    $table->text('error_message')->nullable();
    $table->timestamps();
});

Schema::create('webfiles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('ivac_application_id')->constrained()->cascadeOnDelete();
    $table->string('webfile_number');
    $table->enum('type', ['primary', 'other'])->default('other');
    $table->string('file_path')->nullable();
    $table->string('original_name')->nullable();
    $table->enum('status', [ 'pending', 'uploaded', 'confirmed', 'failed'])->default('pending');
    $table->timestamp('uploaded_at')->nullable();
    $table->timestamp('confirmed_at')->nullable();
    $table->text('error_message')->nullable();
    $table->timestamps();
});

Schema::create('appointments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('ivac_application_id')->constrained()->cascadeOnDelete();
    $table->string('appointment_type')->nullable();
    $table->date('appointment_date')->nullable();
    $table->time('appointment_time')->nullable();
    $table->timestamp('confirmed_at')->nullable();
    $table->text('error_message')->nullable();
    $table->enum('status', [ 'pending', 'selected', 'booking', 'confirmed', 'cancelled', 'failed'])->default('pending');
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

Schema::create('payments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('ivac_application_id')->constrained()->cascadeOnDelete();
    $table->foreignId('appointment_id')->nullable()->constrained()->nullOnDelete();
    $table->string('gateway')->default('sslcommerz');
    $table->string('transaction_id')->nullable()->unique();
    $table->string('payment_method')->nullable();
    $table->decimal('amount', 12, 2)->nullable();
    $table->string('currency', 10)->default('BDT');
    $table->enum('status', [
        'pending',
        'processing',
        'successful',
        'failed',
        'cancelled',
    ])->default('pending');

    $table->timestamp('paid_at')->nullable();
    $table->json('gateway_response')->nullable();
    $table->timestamps();
});

Schema::create('invoices', function (Blueprint $table) {
    $table->id();
    $table->foreignId('ivac_application_id')->constrained()->cascadeOnDelete();
    $table->foreignId('payment_id')->nullable()->constrained()->nullOnDelete();
    $table->string('invoice_number')->nullable();
    $table->string('file_path')->nullable();
    $table->string('original_name')->nullable();
    $table->timestamp('downloaded_at')->nullable();
    $table->timestamps();
});

Schema::create('automation_runs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('automation_account_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('ivac_application_id')->nullable()->constrained()->nullOnDelete();

    $table->enum('type', [
        'signup',
        'signin',
        'webfile_upload',
        'mission_confirmation',
        'appointment_booking',
        'payment',
        'signout',
        'full_process',
    ]);

    $table->enum('status', [
        'pending',
        'running',
        'waiting',
        'completed',
        'failed',
        'cancelled',
    ])->default('pending');

    $table->timestamp('started_at')->nullable();
    $table->timestamp('completed_at')->nullable();
    $table->text('error_message')->nullable();
    $table->timestamps();
});

Schema::create('automation_logs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('automation_run_id')->constrained()->cascadeOnDelete();
    $table->unsignedInteger('step_order');
    $table->string('step');

    $table->enum('status', [
        'pending',
        'running',
        'completed',
        'failed',
        'waiting',
        'skipped',
    ])->default('pending');

    $table->text('message')->nullable();
    $table->text('error')->nullable();
    $table->json('metadata')->nullable();
    $table->timestamp('started_at')->nullable();
    $table->timestamp('completed_at')->nullable();
    $table->timestamps();
});
```

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

## Upload Webfile and Confirm Mission & IVAC Center Process

1. click take your appointment button.
2. click next step button.
3. Upload primary applicant's Webfile.
4. Upload other Webfile (if have any).
5. click all the information is correct button.
6. form confirm dialog click save & continue button.
7. Select a mission (Dhaka).
8. Select you IVAC center (IVAC, Dhaka (JFP)).
9. click Confirm Mission & IVAC Center.

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
