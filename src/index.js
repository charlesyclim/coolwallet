import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import walletApp from './frontend/store/reducers';
import thunk from 'redux-thunk';
import App from './frontend/App';

const store = createStore( walletApp, {},
	compose(
		applyMiddleware(thunk),
		window.devToolsExtension ? window.devToolsExtension() : f => f
	)
)

var root = document.getElementById('react');

ReactDOM.render((
	<Provider store={store}>
		<BrowserRouter>
			<App className="container" />
		</BrowserRouter>
	</Provider>), root);
