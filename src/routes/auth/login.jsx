import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/Forms/LoginForm';
import { login } from '../../hooks/auth/login';

export function RenderLogin() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await login(data);
            console.log('Login success:', result);
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex p-8">
            <div className="flex flex-col gap-6 w-full">
                <h2 className="text-2xl font-semibold text-gray-900">Sign In</h2>
                <LoginForm
                    onSubmit={handleSubmit}
                    error={error}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
