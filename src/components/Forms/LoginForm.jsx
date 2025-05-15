import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { MdOutlineEmail } from 'react-icons/md';
import { TbLockPassword } from 'react-icons/tb';

export function LoginForm({ onSubmit, error, isLoading }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const emailValue = watch('email') || '';
    const passwordValue = watch('password') || '';

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 rounded-lg w-full">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-3 w-full p-3 rounded-lg bg-gray-100 border border-gray-700 focus:outline-none focus:border-gray-900">
                        <MdOutlineEmail className="text-2xl text-gray-500" />
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
                                maxLength: {
                                    value: 254,
                                    message:
                                        'Email cannot exceed 254 characters',
                                },
                            })}
                            className="w-full text-gray-900 bg-transparent focus:outline-none"
                            placeholder="first.last@stud.noroff.no"
                        />
                    </div>
                    <div className="flex justify-between text-gray-900 text-xs mt-1">
                        <span>Enter your email...</span>
                        <span>{emailValue.length}/254</span>
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-3 w-full p-3 rounded-lg bg-gray-100 border border-gray-700 focus:outline-none focus:border-gray-900">
                        <TbLockPassword className="text-2xl text-gray-500" />
                        <input
                            id="password"
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message:
                                        'Password must be at least 8 characters',
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                    message:
                                        'Password must include uppercase, lowercase, and a number',
                                },
                                maxLength: {
                                    value: 128,
                                    message:
                                        'Password cannot exceed 128 characters',
                                },
                            })}
                            className="w-full text-gray-900 bg-transparent focus:outline-none"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="flex justify-between text-gray-900 text-xs mt-1">
                        <span>Enter your password...</span>
                        <span>{passwordValue.length}/128</span>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 bg-gray-900 text-gray-50 rounded-lg hover:bg-gray-700 disabled:bg-gray-500">
                    {isLoading ? 'Logging In...' : 'Log In'}
                </button>
            </form>
            <p className="text-center w-full">
                Not registered? Sign up{' '}
                <span className='font-semibold underline'>
                    <Link to={'/register'}>Here</Link>
                </span>
            </p>
        </>
    );
}
