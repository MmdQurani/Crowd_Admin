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
          className={`${
            width ? width : 'w-full text-right'
          } h-[45px] rounded border  border-[#465FF1]/30   px-4 text-6 text-dominant direction-ltr   focus:ring-dominant-500 focus:outline-none focus:ring-0 focus:`}
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
