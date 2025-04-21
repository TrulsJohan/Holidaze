import { useForm } from 'react-hook-form';

export function RegisterForm({ onSubmit, error, isLoading }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            venueManager: false,
        },
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-6 rounded-lg max-w-md mx-auto">
            <div>
                <label htmlFor="name" className="block text-white mb-1">
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                    placeholder="Your username"
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block text-white mb-1">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/,
                            message:
                                'Email must be a valid @stud.noroff.no address',
                        },
                    })}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                    placeholder="first.last@stud.noroff.no"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-white mb-1">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                        },
                    })}
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                    placeholder="Enter your password"
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2">
                <input
                    id="venueManager"
                    type="checkbox"
                    {...register('venueManager')}
                    className="h-4 w-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
                />
                <label htmlFor="venueManager" className="text-white">
                    Register as Venue Manager
                </label>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400">
                {isLoading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
}
