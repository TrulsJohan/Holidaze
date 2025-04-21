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
            await register(data);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex p-8">
            <div className=" flex flex-col gap-6 w-full">
                <h2 className="text-2xl font-semibold text-gray-900">
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
