document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("settingsForm");
    
    // Inputs
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    
    // Error spans
    const fullNameError = document.getElementById("fullNameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    
    const successMessage = document.getElementById("successMessage");

    // Validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Helper to show error
    function showError(input, errorElement, message) {
        input.classList.add("invalid");
        input.classList.remove("valid");
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }

    // Helper to show success
    function showSuccess(input, errorElement) {
        input.classList.add("valid");
        input.classList.remove("invalid");
        errorElement.style.display = "none";
    }

    // Validate Full Name
    function validateFullName() {
        if (fullName.value.trim() === "") {
            showError(fullName, fullNameError, "Full Name is required.");
            return false;
        } else if (fullName.value.trim().length < 3) {
            showError(fullName, fullNameError, "Full Name must be at least 3 characters.");
            return false;
        } else {
            showSuccess(fullName, fullNameError);
            return true;
        }
    }

    // Validate Email
    function validateEmail() {
        if (email.value.trim() === "") {
            showError(email, emailError, "Email Address is required.");
            return false;
        } else if (!emailPattern.test(email.value.trim())) {
            showError(email, emailError, "Please enter a valid email address.");
            return false;
        } else {
            showSuccess(email, emailError);
            return true;
        }
    }

    // Validate Password
    function validatePassword() {
        if (password.value.trim() !== "" && password.value.trim().length < 8) {
            showError(password, passwordError, "Password must be at least 8 characters.");
            return false;
        } else {
            // Password is optional for settings, but if provided must be valid
            if (password.value.trim() === "") {
                password.classList.remove("invalid", "valid");
                passwordError.style.display = "none";
            } else {
                showSuccess(password, passwordError);
            }
            // Trigger confirm password validation if there's any value in confirm password
            if (confirmPassword.value.trim() !== "") {
                validateConfirmPassword();
            }
            return true;
        }
    }

    // Validate Confirm Password
    function validateConfirmPassword() {
        if (password.value.trim() !== "" && confirmPassword.value.trim() === "") {
            showError(confirmPassword, confirmPasswordError, "Please confirm your password.");
            return false;
        } else if (password.value.trim() !== confirmPassword.value.trim()) {
            showError(confirmPassword, confirmPasswordError, "Passwords do not match.");
            return false;
        } else {
            if (password.value.trim() === "" && confirmPassword.value.trim() === "") {
                confirmPassword.classList.remove("invalid", "valid");
                confirmPasswordError.style.display = "none";
            } else {
                showSuccess(confirmPassword, confirmPasswordError);
            }
            return true;
        }
    }

    // Real-time validation listeners
    fullName.addEventListener("input", validateFullName);
    email.addEventListener("input", validateEmail);
    password.addEventListener("input", validatePassword);
    confirmPassword.addEventListener("input", validateConfirmPassword);

    // Form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const isFullNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        if (isFullNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            // Hide success message before showing again
            successMessage.style.display = "none";
            
            // Simulate saving settings (e.g., API call)
            setTimeout(() => {
                successMessage.style.display = "block";
                
                // Hide message after 3 seconds
                setTimeout(() => {
                    successMessage.style.display = "none";
                }, 3000);
            }, 500);
            
            // You can also gather the form data here
            /*
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            console.log("Form Data Submitted:", data);
            */
        }
    });
});

