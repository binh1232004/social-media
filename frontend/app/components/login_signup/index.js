'use client';
export function InputText({ onChangeEvent, label, name, isValid }) {
    return (
        <input
            placeholder={label}
            type="text"
            onChange={onChangeEvent}
            className={`p-3 rounded-md outline-none w-full ${
                !isValid ? 'border-red-500 border-2' : ''
            }`}
            name={name}
        />
    );
}
export function InputPassword({ onChangeEvent, label, name, isValid }) {
    return (
        <input
            placeholder={label}
            type="password"
            onChange={onChangeEvent}
            className={`p-3 rounded-md outline-none w-full ${
                !isValid ? 'border-red-500 border-2' : ''
            }`}
            name={name}
        />
    );
}
export function InputDate({ onChangeEvent, label, name, isValid }) {
    return (
        <div className="w-full">
            <h2 className="text-white mt-2 mb-1 text-sm">{label}</h2>
            <input
                type="date"
                onChange={onChangeEvent}
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
            />
        </label>
    );
}

export function InputSubmit({ label }) {
    return (
        <input
            type="submit"
            value={label}
            className="p-3 rounded-md bg-orange-300 w-full cursor-pointer outline-none text-white"
        />
    );
}
