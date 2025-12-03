# Password Reset & Account Recovery Guide

## Windows Password Reset

### Windows 10/11 - Local Account

**Method 1: Password Reset Disk (if created beforehand)**

1. On login screen, click "Reset password"
2. Insert password reset USB drive
3. Follow Password Reset Wizard
4. Create new password

**Method 2: Security Questions (Windows 10)**

1. On login screen, click "Reset password"
2. Answer security questions
3. Create new password

**Method 3: Microsoft Account Recovery**

1. On login screen, click "I forgot my password"
2. Follow on-screen prompts
3. Verify identity via email/phone
4. Create new password

**Method 4: Safe Mode with Administrator**

1. Boot into Safe Mode (press F8 during startup)
2. Log in as Administrator (no password by default)
3. Control Panel > User Accounts
4. Select user, click "Change password"

**Method 5: Command Prompt (Advanced)**

1. Boot from Windows installation media
2. Press Shift + F10 for Command Prompt
3. Type: `net user [username] [newpassword]`
4. Restart and login with new password

### Windows - Microsoft Account

1. Go to account.microsoft.com/password/reset
2. Select "I forgot my password"
3. Enter email address
4. Choose verification method (email/SMS/authenticator)
5. Enter verification code
6. Create new password

## Mac Password Reset

### macOS - Apple ID Recovery

1. Restart Mac
2. Hold Command + R for Recovery Mode
3. Click Utilities > Terminal
4. Type: `resetpassword` and press Enter
5. Select user account
6. Click "Reset password using Apple ID"
7. Enter Apple ID credentials
8. Create new password

### macOS - Recovery Mode Reset

1. Restart Mac and hold Command + R
2. Click Utilities > Terminal
3. Type: `resetpassword`
4. Select startup disk and user account
5. Enter new password twice
6. Add password hint
7. Click "Save" and restart

### macOS - FileVault Enabled

If FileVault is enabled:

1. Restart and hold Command + R
2. Enter recovery key when prompted
3. Follow password reset steps above

## iPhone/iPad Password Reset

### Reset Device Passcode

**If you know Apple ID password:**

1. Connect to computer with iTunes/Finder
2. Put device in Recovery Mode:
   - iPhone 8+: Press volume up, down, hold side button
   - iPhone 7: Hold volume down + side button
   - iPhone 6s or earlier: Hold home + top button
3. Choose "Restore" in iTunes/Finder
4. Set up device and restore from backup

**Using Find My iPhone:**

1. Go to icloud.com/find on another device
2. Sign in with Apple ID
3. Select your device
4. Click "Erase iPhone"
5. Set up device again

### Apple ID Password Reset

1. Go to iforgot.apple.com
2. Enter Apple ID email
3. Choose reset method:
   - Answer security questions
   - Email authentication
   - Two-factor authentication
4. Follow prompts to reset password

## Android Password Reset

### Forgot Screen Lock

**Method 1: Find My Device (Android 5.0+)**

1. Go to android.com/find on another device
2. Sign in with Google account
3. Select device
4. Click "Erase Device"
5. Follow prompts (erases all data)

**Method 2: Samsung Find My Mobile**

1. Go to findmymobile.samsung.com
2. Sign in with Samsung account
3. Select device
4. Click "Unlock"
5. Or click "Erase data" to factory reset

**Method 3: Factory Reset (Last Resort)**

1. Turn off device
2. Hold Volume Up + Power button (varies by device)
3. Use volume buttons to navigate Recovery Mode
4. Select "Wipe data/factory reset"
5. Confirm and restart
6. Note: This erases all data

### Google Account Password Reset

1. Go to accounts.google.com/signin/recovery
2. Enter email address
3. Click "Forgot password"
4. Choose verification method:
   - Recovery email
   - Recovery phone
   - Security questions
5. Enter verification code
6. Create new password

## Email Account Password Reset

### Gmail

1. Go to gmail.com, click "Forgot password"
2. Enter last password you remember (or click "Try another way")
3. Verify via phone or recovery email
4. Create new password

### Outlook/Microsoft

1. Go to account.live.com/password/reset
2. Select "I forgot my password"
3. Enter email address
4. Verify identity (email/SMS/authenticator app)
5. Create new password

### Yahoo Mail

1. Go to login.yahoo.com
2. Click "Forgot password"
3. Enter email or phone
4. Verify identity via SMS or recovery email
5. Create new password

### Other Email Providers

1. Go to email provider's login page
2. Click "Forgot password" or similar link
3. Follow provider-specific recovery process
4. Usually requires recovery email or phone

## Social Media Password Reset

### Facebook

1. Go to facebook.com/login/identify
2. Enter email, phone, or username
3. Click "Search"
4. Choose password reset method
5. Enter code sent via email/SMS
6. Create new password

### Instagram

1. On login screen, tap "Forgot password"
2. Enter username or email
3. Tap "Send Login Link" or "Send SMS"
4. Click link or enter code
5. Create new password

### Twitter/X

1. Go to twitter.com, click "Forgot password"
2. Enter email, phone, or username
3. Click "Search"
4. Verify via email or phone
5. Create new password

## Best Practices for Password Management

### Creating Strong Passwords

1. Use 12+ characters
2. Mix uppercase, lowercase, numbers, symbols
3. Avoid dictionary words
4. Don't use personal information
5. Use unique password for each account

### Password Security Tips

1. Enable two-factor authentication (2FA) everywhere possible
2. Use a password manager (LastPass, 1Password, Bitwarden)
3. Never share passwords
4. Change passwords every 3-6 months
5. Don't write passwords down
6. Be cautious of phishing emails

### Set Up Recovery Options NOW

1. Add recovery email to all accounts
2. Add recovery phone number
3. Set up security questions (use fake answers you'll remember)
4. Enable two-factor authentication
5. Create password reset disk for Windows
6. Save recovery codes in safe place

### Two-Factor Authentication (2FA)

**Recommended 2FA Apps:**

- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password

**How to Enable 2FA:**

1. Go to account security settings
2. Look for "Two-factor authentication" or "2FA"
3. Choose method (app/SMS/hardware key)
4. Follow setup instructions
5. Save backup codes

## Emergency Access

### Create Emergency Access Plan

1. Document all accounts in secure location
2. Store password manager master password securely
3. Set up trusted contacts for account recovery
4. Keep backup codes in safe place
5. Document recovery email/phone info

### Digital Legacy

1. Use password manager with emergency access feature
2. Create sealed envelope with critical passwords
3. Store in safe deposit box
4. Inform trusted person of location
5. Document all important accounts

## Common Mistakes to Avoid

1. ❌ Using same password for multiple accounts
2. ❌ Ignoring password reset emails (could be hacker)
3. ❌ Not setting up recovery options
4. ❌ Using public WiFi without VPN for password resets
5. ❌ Clicking suspicious "reset password" emails (phishing)
6. ❌ Using easily guessable passwords
7. ❌ Sharing passwords with others
8. ❌ Storing passwords in plain text files

## Warning Signs of Compromise

Watch for these red flags:

- Unexpected password reset emails
- Unable to login with correct password
- Suspicious account activity
- Friends receiving spam from your account
- Unknown devices logged into your account

**If you suspect compromise:**

1. Reset password immediately
2. Enable 2FA
3. Check recent account activity
4. Review connected apps/devices
5. Scan computer for malware
6. Change passwords on other accounts
