type PasswordStrength = {
    hasNumber: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasSpecialChar: boolean;
};

export function getPasswordStrength(password: string): PasswordStrength {
    return {
        hasNumber: /\d/.test(password),
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    };
}