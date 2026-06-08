import './FormFieldError.css'

type FormFieldErrorProps = {
    message?: string;
};

export function FormFieldError({ message }: FormFieldErrorProps) {
    if (!message) {
        return <div className="form-field-error" aria-hidden="true" />;
    }

    return (
        <div className="form-field-error" role="alert">
            {message}
        </div>
    );
}