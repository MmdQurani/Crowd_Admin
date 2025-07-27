import DataContext from 'comon/context/MainContext';
import { useContext, useEffect } from 'react';

const Timer = ({ func }) => {
  const { timer, setTimer } = useContext(DataContext);
  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1000);
      }, 1000);
    }
  }, [timer]);

  const getFormattedTime = (ms) => {
    let total_sec = parseInt(Math.floor(ms / 1000));
    let total_min = parseInt(Math.floor(total_sec / 60));

    let sec = parseInt(total_sec % 60);
    let min = parseInt(total_min % 60);

    return `${sec} : ${min}`;
  };
  return (
    <div>
      {timer > 0 ? (
        getFormattedTime(timer)
      ) : (
        <p
          className="text-base cursor-pointer bg-accent-0 rounded px-2 text-white"
          onClick={(e) => func(e)}>
          ارسال مجدد
        </p>
      )}
    </div>
  );
};

export default Timer;
