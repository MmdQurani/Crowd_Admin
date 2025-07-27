export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export const httpStartAction = (type) => ({ type });
export const httpFailAction = (type, error) => ({ type, error });

export const httpStart = (state) => updateObject(state, { error: null, loading: true });
export const httpFail = (state, action) =>
  updateObject(state, { error: action.error, loading: false });
