export default function Input({ label, type, name, value, onChange, placeholder, className, ...props }) {
    let inputClass = `custom-input ${className ? className : ''}`;
    return (
        <div className={inputClass}>
            {label && <label htmlFor={name}>{label}</label>}
            <input 
                type={type || 'text'}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder || ''}
                {...props}
            />
        </div>
    );
}   