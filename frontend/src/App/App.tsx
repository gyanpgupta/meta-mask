import React, { useEffect, useState } from 'react';
import { Login } from '../Login';
import { Profile } from '../Profile';

import { Auth, IAuthState } from '../Interfaces/index';

import './App.css';

export const App = (): JSX.Element => {
	const [state, setState] = useState<IAuthState>({});

	useEffect(() => {
		/*
	-----------------------------------------------------
		Fetching Stored access token from local storage
	-----------------------------------------------------
		*/
		const ls = window.localStorage.getItem(
			`${process.env.REACT_APP_AUTH_KEY}`
		);
		const auth = ls && JSON.parse(ls);
		setState({ auth });
	}, []);

	/*
	----------------------------------
		Function called after login
	---------------------------------
	*/
	const onHandleLoggedIn = (auth: Auth) => {
		localStorage.setItem(
			`${process.env.REACT_APP_AUTH_KEY}`,
			JSON.stringify(auth)
		);
		setState({ auth });
	};
	/*
	----------------------------------
		Function to manage logout
	---------------------------------
		*/
	const onHandleLoggedOut = () => {
		localStorage.removeItem(`${process.env.REACT_APP_AUTH_KEY}`);
		setState({ auth: undefined });
	};

	const { auth } = state;

	return (
		<div className="App">
			<header className="App-header">
				<h1 className="App-title">MetaMask Auth Wallet</h1>
			</header>
			<div className="App-intro">
				{auth ? (
					<Profile auth={auth} onLoggedOut={onHandleLoggedOut} />
				) : (
					<Login onLoggedIn={onHandleLoggedIn} />
				)}
			</div>
		</div>
	);
};

