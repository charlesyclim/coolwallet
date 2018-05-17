export const processTrans = (transType, trans) => {
  return function (dispatch) {
		return new Promise((resolve, reject) => {
    	resolve (dispatch({
    		type: 'PROCESS_TRANS',
        transType,
        trans,
    	}));
    });
  }
};

export const setShowTrans = (walletsToShow) => {
	return {
		type: 'SET_SHOW_TRANS',
		walletsToShow,
	};
};
