const Button = ({ name, type, func, disable, width, bg }) => {
  return (
    <button
      disabled={!disable}
      className={`${width ? width : 'w-full'}  h-[42px] rounded-md ${
        bg ? `${bg}` : ' bg-gray-500 border border-white '
      } text-white text-base font-normal  ${disable ? '' : 'opacity-70 cursor-default'}`}
      type={type && type}
      onClick={func && (() => func())}>
      {name}
    </button>
  );
};

export default Button;
