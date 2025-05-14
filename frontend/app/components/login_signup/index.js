'use client';
export function InputText({ onChangeEvent, label, name, isValid, value = '' }) {
    return (
        <input
            placeholder={label}
            type="text"
            onChange={onChangeEvent}
            value={value}
            className={`p-3 rounded-md outline-none w-full ${
                !isValid ? 'border-red-500 border-2' : ''
            }`}
            name={name}
        />
    );
}
export function InputPassword({ onChangeEvent, label, name, isValid, value = '' }) {
    return (
        <input
            placeholder={label}
            type="password"
            onChange={onChangeEvent}
            value={value}
            className={`p-3 rounded-md outline-none w-full ${
                !isValid ? 'border-red-500 border-2' : ''
            }`}
            name={name}
        />
    );
}
export function InputDate({ onChangeEvent, label, name, isValid, value = '' }) {
    return (
        <div className="w-full">
            <h2 className="text-white mt-2 mb-1 text-sm">{label}</h2>
            <input
                type="date"
                onChange={onChangeEvent}
                value={value}
                className={`p-3 rounded-md outline-none w-full ${
                    !isValid ? 'border-red-500 border-2' : ''
                }`}
                name={name}
            />
        </div>
    );
}

export function InputRadioButton({
    onChangeEvent,
    label,
    name,
    value,
    isValid,
    checked = false,
}) {
    return (
        <label
            className={`w-1/2 bg-white p-3 rounded-md outline-none relative ${
                !isValid ? 'border-red-500 border-2' : ''
            }`}
        >
            {label}
            <input
                type="radio"
                name={name}
                className="absolute right-2 top-1/2 -translate-y-1/2 "
                onChange={onChangeEvent}
                value={value}
                checked={checked}
            />
        </label>
    );
}

export function InputOTP({ onChangeEvent, label, name, isValid, value = '', onFocus, onComplete }) {
    // Function to handle input changes and auto-submit when 6 digits are entered
    const handleOtpChange = (e) => {
        // Call the original change handler
        onChangeEvent(e);
        
        const inputValue = e.target.value;
        // If we have exactly 6 digits, trigger the complete function
        if (inputValue.length === 6 && onComplete) {
            onComplete(inputValue);
        }
    };
    
    return (
        <div className="w-full">
            <h2 className="text-white mt-2 mb-1 text-sm">{label || 'Enter OTP from your email'}</h2>
            <input
                placeholder="Enter 6-digit OTP code"
                type="text"
                maxLength={6}
                pattern="[0-9]{6}"
                onChange={handleOtpChange}
                onFocus={onFocus}
                value={value}
                className={`p-3 rounded-md outline-none w-full text-center tracking-wider font-mono text-lg ${
                    !isValid ? 'border-red-500 border-2' : ''
                }`}
                name={name || 'otp'}
                autoFocus
            />            <p className="text-white text-xs mt-1">
                Enter the 6-digit code from your email (will submit automatically)
            </p>
        </div>
    );
}

export function InputSubmit({ label, disabled = false }) {
    return (
        <input
            type="submit"
            value={label}
            disabled={disabled}
            className={`p-3 rounded-md ${disabled ? 'bg-orange-200' : 'bg-orange-300'} w-full 
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} outline-none text-white`}
        />
    );
}
