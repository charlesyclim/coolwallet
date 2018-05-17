import { combineReducers } from 'redux';
import walletTransactions from './walletTransactions';

const walletApp = combineReducers({
  walletTransactions,
});

export default walletApp;
