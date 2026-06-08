import './PasswordStrength.css'

import { getPasswordStrength } from '../../utils/passwordStrength';

type PasswordStrengthProps = {
    password: string;
};

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const strength = getPasswordStrength(password);

    return (
        <ul className="password-strength">
            <li className={strength.hasNumber ? 'ok' : ''}>1 number</li>
            <li className={strength.hasUppercase ? 'ok' : ''}>1 uppercase</li>
            <li className={strength.hasLowercase ? 'ok' : ''}>1 lowercase</li>
            <li className={strength.hasSpecialChar ? 'ok' : ''}>1 special character</li>
        </ul>
    );
}