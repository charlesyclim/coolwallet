/**
 The state data structure is as follows:
 	 state['merged'][<col>][<source>][target]=<walletInfo>
 	 		where	<col> could be either 0, 1 and 2 (0=Receipt, 1=Own, 2=Payment)
		 				<source> is the name of the source wallet
						<target> is the name of the target wallet
						<walletInfo> is an object containing the flow info, which has this structure:
								{	transIds: contains array of the transIds that have merged when the target are the same
									amount: accumulated ammount,
									minAmt: sum of all the minimum amount,
									maxAmt: sum of all the max amount,
								}
	It will also have this side structure, valid for column 1 only:
		state['show'] = array of the wallets to show (string array)
 And also in term of transIds
 		state['byTransId'][transId] = {
																		transId: unique id for each transaction
																		transType: can be either 'Receipt' or 'Payment'
																		source: name of the source wallet
																		target: name of the target wallet
																		amount: accumulated ammount,
																		minAmt: sum of all the minimum amount,
																		maxAmt: sum of all the max amount,
																	}
*/
const walletTransactions = (state = {}, action) => {

	let newstate = {};

	switch (action.type) {
	case 'PROCESS_TRANS':
	/**
	* Called everytime there is a transaction executed
	*/
		// action = {transType,trans={transId,transType,source,target,amount,minAmt,maxAmt}}
		// shallow clone
		newstate = Object.assign({}, state);

		let sourceCol, targetCol, showHide;
		let {trans} = action;
		let {transId,transType,source,target,amount,minAmt,maxAmt} = trans;
		amount = (typeof amount === 'string')? parseInt(amount): amount;
		minAmt = (typeof minAmt === 'string')? parseInt(minAmt): minAmt;
		maxAmt = (typeof maxAmt === 'string')? parseInt(maxAmt): maxAmt;
		//------------------------------
		// update the state['byTransId']
		//------------------------------
		if (!newstate['byTransId']) newstate['byTransId'] = {};
		// clone 'byTransId'
		newstate['byTransId'] = Object.assign({},newstate['byTransId']);
		newstate['byTransId'][transId] = trans;

		//------------------------------
		// update the state['merged']
		//------------------------------
		if (!newstate['merged']) newstate['merged'] = {};
		// clone 'merged'
		newstate['merged'] = Object.assign({},newstate['merged']);
		if (transType === 'Receipt') {
			sourceCol = 0;
			targetCol = 1;
			showHide = target;
		} else {
			sourceCol = 1;
			targetCol = 2;
			showHide = source;
		}
		// since first dimension is array, require to ensure all are defined
		for (let i=0; i<3; i++) {
			if (!newstate.merged[i]) newstate.merged[i] = {};
		}

		//--------------------------------------------------------------------------
		// update the state['merged'] - for source
		//--------------------------------------------------------------------------
		if (!newstate.merged[sourceCol][source]) newstate.merged[sourceCol][source] = {};

		// create walletInfo
		let walletInfo = {transIds:[transId], amount, minAmt, maxAmt}
		// set walletInfo to state
		if (!newstate.merged[sourceCol][source][target]) {
			newstate.merged[sourceCol][source][target] = walletInfo;
		} else {
			// combine
			walletInfo = newstate.merged[sourceCol][source][target];
			walletInfo['transIds'].push(transId);
			walletInfo['amount'] += amount;
			walletInfo['minAmt'] += minAmt;
			walletInfo['maxAmt'] += maxAmt;
		}

    return newstate;
	case 'SET_SHOW_TRANS':
	/**
	* Called everytime user changes the ownWallet to display
	*/
	// stat[1] store the own wallets
		newstate = Object.assign({},state);
		newstate['show'] = action['walletsToShow'];

		return newstate;

  default:
		return state;
	}
};
export default walletTransactions;
