export default function Buttons({ btnText, className, ...props }) {
    let buttonClass = `custom-button ${className ? className : ''}`;
  return (
    <button className={buttonClass} {...props}>
      {btnText}
    </button>
  );
}