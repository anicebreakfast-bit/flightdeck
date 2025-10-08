export default function Dropdown({ children, label, type, name, value, onChange, placeholder, className, ...props }) {
    let dropdownClass = `custom-input ${className ? className : ''}`;
    return (
        <div className={dropdownClass}>
            {label && <label htmlFor={name}>{label}</label>}
            <select  
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder || ''}
                {...props}
            >
            { children }
            </select>
        </div>
    );
}   