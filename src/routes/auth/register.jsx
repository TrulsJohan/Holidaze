import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../../components/Forms/RegisterForm';
import { register } from '../../hooks/auth/register';

export function RenderRegister() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await register(data);
            console.log('Registration success:', result);
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex p-4 sm:p-6 lg:p-8 w-full min-w-[320px] max-w-full">
            <title>Holidaze | Sign Up</title>
            <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-md sm:max-w-md lg:max-w-md mx-auto sm:mt-10">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                    Sign Up
                </h2>
                <RegisterForm
                    onSubmit={handleSubmit}
                    error={error}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
