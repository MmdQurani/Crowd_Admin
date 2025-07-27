/* eslint-disable no-unused-vars */
export const incrementCounter = (counter, setCounter) => {
  setCounter(counter + 1);
};

export const decrementCounter = (counter, setCounter) => {
  if (counter !== 0) {
    setCounter(counter - 1);
  }
};
