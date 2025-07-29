const Input = ({ value, setvalue, label, placeholder, type, width, ...rest }) => {
  return (
    <>
      {' '}
      <div
        className="relative flex w-full  flex-col items-start justify-start gap-y-1 mt-2"
        style={{ direction: 'rtl' }}>
        <label
          htmlFor={label}
          className="text-label font-normal w-full flex justify-start items-start text-xs   bg-light text-dominant-500 px-2"
          style={{ direction: 'rtl' }}>
          {label}
        </label>
        <input
          autoComplete="off"
          id={label}
          className={`${width ? width : 'w-full text-right'
            } w-full px-4 py-2 bg-white border border-gray-200 text-sm text-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`}
          placeholder={placeholder ? placeholder : ''}
          value={value}
          onChange={(e) => setvalue(e.target.value)}
          type={type}
          {...rest}
        />
      </div>
    </>
  );
};

export default Input;
