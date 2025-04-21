import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { RegisterForm } from '../../components/Forms/RegisterForm';

export function RenderRegister() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();

    const [apiError, setApiError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setApiError(null);
        setSuccess(null);
        setIsLoading(true);
        try {
            const trimmedData = {
                username: data.username.trim(),
                email: data.email.trim(),
                password: data.password,
            };
            const response = await register(trimmedData);
            setSuccess('Registration successful! Redirecting to login...');
            reset();
            console.log('API response:', response);
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (err) {
            setApiError(
                err.message || 'Something went wrong during registration.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <title>Holidaze | Register</title>
            <h1>Register</h1>
            <RegisterForm
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                onSubmit={onSubmit}
                watch={watch}
            />
            {apiError && (
                <p role="alert" className="error-text">
                    {apiError}
                </p>
            )}
            {success && (
                <p role="alert" className="success-text">
                    {success}
                </p>
            )}
        </>
    );
}
