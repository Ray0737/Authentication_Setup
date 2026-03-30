/**
 * Supabase Authentication & Profile Management
 * Major Web Project
 */

// --- CONFIGURATION ---
// Replace placeholders with your own Supabase credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const profileForm = document.getElementById('profileForm');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const messageDiv = document.getElementById('message');

// Utility for showing messages
const displayMessage = (msg, isError = false) => {
    messageDiv.textContent = msg;
    messageDiv.className = isError ? 'mt-3 small text-center text-danger' : 'mt-3 small text-center text-success';
};

// --- AUTHENTICATION FLOW ---

// 1. Handle Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        displayMessage('Authenticating...');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            displayMessage(error.message, true);
        } else {
            displayMessage('Login successful. Redirecting...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    });
}

// Real-time Password Validation
const regPasswordInput = document.getElementById('reg-password');
const reqLength = document.getElementById('req-length');
const reqUpper = document.getElementById('req-upper');
const reqNumber = document.getElementById('req-number');
const reqSpecial = document.getElementById('req-special');

if (regPasswordInput) {
    regPasswordInput.addEventListener('input', () => {
        const val = regPasswordInput.value;
        const requirements = {
            length: val.length >= 8,
            upper: /[A-Z]/.test(val),
            number: /[0-9]/.test(val),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(val)
        };

        // Update UI
        reqLength.classList.toggle('valid', requirements.length);
        reqUpper.classList.toggle('valid', requirements.upper);
        reqNumber.classList.toggle('valid', requirements.number);
        reqSpecial.classList.toggle('valid', requirements.special);
    });
}

// 2. Handle Registration Step 1 (Auth Signup)
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        const password = regPasswordInput.value;

        // Final validation before submission
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            displayMessage('Password does not meet requirements.', true);
            return;
        }

        displayMessage('Creating account...');

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            displayMessage(error.message, true);
        } else if (data.user) {
            displayMessage('Account created. Please complete your profile.');
            // Move to Step 2
            step1.classList.add('d-none');
            step2.classList.remove('d-none');
            // Pre-fill email in step 2
            document.getElementById('profile-email').value = email;
            // Store user ID for later use
            window.currentUserID = data.user.id;
        }
    });
}

// 3. Handle Registration Step 2 (Profile Data)
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const profileData = {
            id: window.currentUserID, // Linked to the user's Auth ID
            email: document.getElementById('profile-email').value,
            first_name: document.getElementById('first-name').value,
            last_name: document.getElementById('last-name').value,
            nickname: document.getElementById('nickname').value,
            callsign: document.getElementById('callsign').value,
            telephone: document.getElementById('telephone').value,
            birthdate: document.getElementById('birthdate').value,
        };

        displayMessage('Saving profile data...');

        // Upsert into 'profiles' table
        const { error } = await supabase
            .from('profiles')
            .upsert(profileData);

        if (error) {
            displayMessage(error.message, true);
        } else {
            displayMessage('Registration complete. Redirecting to login...');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    });
}

// 4. Session Check for index.html (Redirect to login if not authenticated)
document.addEventListener('DOMContentLoaded', async () => {
    const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    
    if (isMainPage) {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
            window.location.href = 'login.html';
        } else {
            // User is logged in, you can load user specific content here
            console.log('User session active:', session.user.email);
        }
    }
});

export { supabase };
