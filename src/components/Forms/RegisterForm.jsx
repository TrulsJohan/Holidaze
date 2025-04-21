export function RegisterForm({
    register,
    errors,
    handleSubmit,
    isLoading,
    onSubmit,
    watch,
}) {
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="register-form">
            <label htmlFor="username" className="form-label">
                Username:
                <input
                    id="username"
                    type="text"
                    {...register('username', {
                        required: 'Username is required',
                        minLength: {
                            value: 3,
                            message:
                                'Username must be at least 3 characters long',
                        },
                        pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message:
                                'Username can only contain letters, numbers, and underscores',
                        },
                    })}
                    aria-invalid={errors.username ? 'true' : 'false'}
                    aria-describedby={
                        errors.username ? 'username-error' : undefined
                    }
                    className="form-input"
                />
                {errors.username && (
                    <span id="username-error" className="error-text">
                        {errors.username.message}
                    </span>
                )}
            </label>

            <label htmlFor="email" className="form-label">
                Email:
                <input
                    id="email"
                    type="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Enter a valid email address',
                        },
                    })}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className="form-input"
                />
                {errors.email && (
                    <span id="email-error" className="error-text">
                        {errors.email.message}
                    </span>
                )}
            </label>

            <label htmlFor="password" className="form-label">
                Password:
                <input
                    id="password"
                    type="password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message:
                                'Password must be at least 8 characters long',
                        },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                            message:
                                'Password must include uppercase, lowercase, and a number',
                        },
                    })}
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={
                        errors.password ? 'password-error' : undefined
                    }
                    className="form-input"
                />
                {errors.password && (
                    <span id="password-error" className="error-text">
                        {errors.password.message}
                    </span>
                )}
            </label>

            <label htmlFor="confirmPassword" className="form-label">
                Confirm Password:
                <input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                            value === watch('password') ||
                            'Passwords do not match',
                    })}
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                    aria-describedby={
                        errors.confirmPassword
                            ? 'confirmPassword-error'
                            : undefined
                    }
                    className="form-input"
                />
                {errors.confirmPassword && (
                    <span id="confirmPassword-error" className="error-text">
                        {errors.confirmPassword.message}
                    </span>
                )}
            </label>

            <button
                type="submit"
                disabled={isLoading}
                className="submit-button">
                {isLoading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
}
