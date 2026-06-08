export function validateEmail(email: string): boolean {
    const parts = email.split('@');

    if (parts.length !== 2) {
        return false;
    }

    const [localPart, domain] = parts;

    if (localPart.length === 0) {
        return false;
    }

    if (!domain.includes('.')) {
        return false;
    }

    const domainParts = domain.split('.');
    const hasEmptyDomainPart = domainParts.some((part) => part.length === 0);

    if (hasEmptyDomainPart) {
        return false;
    }

    return true;
}