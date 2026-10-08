// Tab Navigation
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // Remove active class from all tabs and forms
        tabBtns.forEach(b => b.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        
        // Show corresponding form
        if (targetTab === 'login') {
            document.getElementById('loginForm').classList.add('active');
        } else {
            document.getElementById('signupForm').classList.add('active');
        }
    });
});

// Password Toggle
const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const toggleSignupPassword = document.getElementById('toggleSignupPassword');
const loginPassword = document.getElementById('loginPassword');
const signupPassword = document.getElementById('signupPassword');

toggleLoginPassword.addEventListener('click', () => {
    const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    loginPassword.setAttribute('type', type);
    toggleLoginPassword.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '🙈';
});

toggleSignupPassword.addEventListener('click', () => {
    const type = signupPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    signupPassword.setAttribute('type', type);
    toggleSignupPassword.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '🙈';
});

// Password Strength Checker
const passwordInput = document.getElementById('signupPassword');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);
    
    strengthFill.className = 'strength-fill';
    
    if (strength.score === 0) {
        strengthFill.style.width = '0%';
        strengthText.textContent = 'Password strength';
        strengthText.style.color = 'var(--text-dim)';
    } else if (strength.score <= 2) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Weak password';
        strengthText.style.color = 'var(--danger)';
    } else if (strength.score <= 3) {
        strengthFill.classList.add('medium');
        strengthText.textContent = 'Medium strength';
        strengthText.style.color = 'var(--warning)';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Strong password!';
        strengthText.style.color = 'var(--success)';
    }
});

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (!password) return { score: 0 };
    
    // Length
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Has lowercase
    if (/[a-z]/.test(password)) score++;
    
    // Has uppercase
    if (/[A-Z]/.test(password)) score++;
    
    // Has numbers
    if (/\d/.test(password)) score++;
    
    // Has special characters
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return { score: Math.min(score, 4) };
}

// Login Form Submission
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Show loading state
    const submitBtn = loginForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Logging in...</span>';
    submitBtn.disabled = true;
    
    // REAL DATABASE LOGIN
fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        email: email,
        password: password
    })
})
.then(res => res.json())
.then(result => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

   if (result.message) {

    // 🔐 REQUIRED — THIS WAS MISSING
    localStorage.setItem("loggedIn", "true");

    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = '✓ Login successful! Redirecting...';
    loginForm.insertBefore(successMsg, loginForm.firstChild);

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}
 else {
        showError(loginForm, result.error);
    }
})
.catch(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    showError(loginForm, "Server not running. Start Flask backend.");
});

});

// Signup Form Submission
const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Clear previous error messages
    const oldError = signupForm.querySelector('.error-message');
    if (oldError) oldError.remove();
    
    // Validation
    if (password !== confirmPassword) {
        showError(signupForm, 'Passwords do not match!');
        return;
    }
    
    if (password.length < 8) {
        showError(signupForm, 'Password must be at least 8 characters long!');
        return;
    }
    
    // Show loading state
    const submitBtn = signupForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Creating account...</span>';
    submitBtn.disabled = true;
    
    // Simulate API call
    // REAL DATABASE SIGNUP
fetch("http://127.0.0.1:5000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        name: name,
        email: email,
        password: password
    })
})
.then(res => res.json())
.then(result => {
    if (result.message) {
        localStorage.setItem("loggedIn", "true");
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = '✓ Account created! Redirecting...';

        // ✅ CORRECT LOCATION
        signupForm.insertBefore(successMsg, signupForm.firstChild);

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showError(signupForm, result.error);
    }
})

.catch(() => {
    showError(signupForm, "Server not running. Start Flask backend.");
});

});

function showError(form, message) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = '✗ ' + message;
    form.insertBefore(errorMsg, form.firstChild);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorMsg.remove();
    }, 5000);
}

document.querySelectorAll(".social-btn.google")
.forEach(function(button) {
    button.addEventListener("click", function() {
        window.location.href = "http://127.0.0.1:5000/login/google";
    });
});

// Forgot Password Handler
const forgotLink = document.querySelector('.forgot-link');

forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    const email = prompt('Enter your email address to reset password:');
    
    if (email) {
        if (validateEmail(email)) {
            alert(`Password reset link has been sent to ${email}\n\nIn production, this would send an actual email with reset instructions.`);
        } else {
            alert('Please enter a valid email address.');
        }
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Press Enter on checkbox label to toggle
    if (e.key === 'Enter' && e.target.classList.contains('checkbox-label')) {
        const checkbox = e.target.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
    }
});

// Auto-focus first input on load
window.addEventListener('load', () => {
    const firstInput = document.querySelector('.auth-form.active .form-input');
    if (firstInput) {
        setTimeout(() => {
            firstInput.focus();
        }, 500);
    }
});

// Add floating animation to particles
const particles = document.querySelectorAll('.particle');
particles.forEach((particle, index) => {
    particle.style.animationDelay = `${index * 2}s`;
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
