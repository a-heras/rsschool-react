export type FormType = 'uncontrolled' | 'react-hook-form';

export type FormSubmission = {
    id: string;
    formType: FormType;
    name: string;
    age: number;
    email: string;
    gender: string;
    termsAccepted: boolean;
    imageBase64: string;
    country: string;
    submittedAt: string;
}