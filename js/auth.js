import { supabase } from './config.js';

// DOM Elements
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const userEmail = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');

// Form Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const resetForm = document.getElementById('reset-form');
const authTabs = document.querySelectorAll('.auth-tab');
const forgotPasswordLink = document.getElementById('forgot-password');
const backToLoginLink = document.getElementById('back-to-login');

// Initialize auth form
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing auth form...');
    // Show auth form by default
    showAuth();
    
    // Check for existing session
    checkSession();
    
    // Set up event listeners
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            console.log('Switching to tab:', tabName);
            switchTab(tabName);
        });
    });

    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    resetForm.addEventListener('submit', handlePasswordReset);

    // Links
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('reset');
    });

    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('login');
    });

    // Logout
    logoutBtn.addEventListener('click', handleLogout);
}

// Switch between auth tabs
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    // Update active tab
    authTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Show/hide forms
    loginForm.classList.toggle('hidden', tabName !== 'login');
    signupForm.classList.toggle('hidden', tabName !== 'signup');
    resetForm.classList.toggle('hidden', tabName !== 'reset');
}

// Check for existing session
async function checkSession() {
    try {
        console.log('Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
            console.log('Found existing session:', session.user.email);
            showApp(session.user);
        } else {
            console.log('No existing session found');
        }
    } catch (error) {
        console.error('Error checking session:', error.message);
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    console.log('Handling login...');
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        console.log('Login successful:', data.user.email);
        showApp(data.user);
    } catch (error) {
        console.error('Login error:', error.message);
        showError(error.message);
    }
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();
    console.log('Handling signup...');
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        console.error('Passwords do not match');
        showError('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        console.error('Password too short');
        showError('Password must be at least 6 characters long');
        return;
    }

    try {
        console.log('Attempting to sign up with email:', email);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin
            }
        });

        if (error) throw error;
        console.log('Signup successful, confirmation email sent');
        showMessage('Check your email for the confirmation link!');
        switchTab('login');
    } catch (error) {
        console.error('Signup error:', error.message);
        showError(error.message);
    }
}

// Handle password reset
async function handlePasswordReset(e) {
    e.preventDefault();
    console.log('Handling password reset...');
    const email = document.getElementById('reset-email').value;

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin
        });
        if (error) throw error;
        
        console.log('Password reset email sent');
        showMessage('Password reset instructions sent to your email!');
        switchTab('login');
    } catch (error) {
        console.error('Password reset error:', error.message);
        showError(error.message);
    }
}

// Handle logout
async function handleLogout() {
    try {
        console.log('Handling logout...');
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        console.log('Logout successful');
        showAuth();
    } catch (error) {
        console.error('Logout error:', error.message);
        showError(error.message);
    }
}

// Auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.email);
    if (event === 'SIGNED_IN' && session) {
        showApp(session.user);
    } else if (event === 'SIGNED_OUT') {
        showAuth();
    }
});

// UI Helper Functions
function showAuth() {
    console.log('Showing auth form');
    authSection.classList.remove('hidden');
    appSection.classList.add('hidden');
}

function showApp(user) {
    console.log('Showing app for user:', user.email);
    authSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    userEmail.textContent = user.email;
}

function showError(message) {
    console.error('Showing error:', message);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'auth-error';
    errorDiv.textContent = message;
    
    // Remove any existing error
    const existingError = document.querySelector('.auth-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error to the active form
    const activeForm = document.querySelector('.auth-form-element:not(.hidden)');
    activeForm.insertBefore(errorDiv, activeForm.firstChild);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showMessage(message) {
    console.log('Showing message:', message);
    const messageDiv = document.createElement('div');
    messageDiv.className = 'auth-message';
    messageDiv.textContent = message;
    
    // Remove any existing message
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Add message to the active form
    const activeForm = document.querySelector('.auth-form-element:not(.hidden)');
    activeForm.insertBefore(messageDiv, activeForm.firstChild);
    setTimeout(() => messageDiv.remove(), 5000);
}

// Export necessary functions
export {
    showAuth,
    showApp,
    showError,
    showMessage
}; 