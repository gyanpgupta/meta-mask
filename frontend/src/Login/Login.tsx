
import React, { useState } from 'react';
import Web3 from 'web3';

import { ILoginProps } from '../Interfaces';

import './Login.css';

let web3: Web3 | undefined = undefined;

export const Login = ({ onLoggedIn }: ILoginProps): JSX.Element => {
	const [loading, setLoading] = useState(false); // Loading button state

	/*
	------------------------------------
		Function to authenticate token
	------------------------------------
	*/
	const onHandleAuthenticate = ({
		publicAddress,
		signature,
	}: {
		publicAddress: string;
		signature: string;
	}) =>
		fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
			body: JSON.stringify({ publicAddress, signature }),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}).then((response) => response.json());

	/*
	------------------------------
		Function to sign message
	------------------------------
	*/
	const handleSignMessage = async ({
		publicAddress,
		nonce,
	}: {
		publicAddress: string;
		nonce: string;
	}) => {
		try {
			// eslint-ignore
			const signature = await web3!.eth.personal.sign(
				`Hey,I am signing my first nonce: ${nonce}`,
				publicAddress,
				''
			);

			return { publicAddress, signature };
		} catch (err) {
			throw new Error(
				'You need to sign the message to be able to log in.'
			);
		}
	};

	/*
	----------------------------
		Function to create user
	----------------------------
	*/
	const onHandleSignUp = (publicAddress: string) =>
		fetch(`${process.env.REACT_APP_BACKEND_URL}/user`, {
			body: JSON.stringify({ publicAddress }),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}).then((response) => response.json());
	/*
	-------------------------------
		Function to manage login 
	-------------------------------
	*/
	const onHandleLogin = async () => {
		/*
		--------------------------------------
			 Check if MetaMask is installed
		--------------------------------------
		*/
		if (!(window as any).ethereum) {
			window.alert('Please install MetaMask first.');
			return;
		}

		if (!web3) {
			try {
				/*
				------------------------------------------
					 Request account access if needed
				------------------------------------------
				*/

				await (window as any).ethereum.enable();

				web3 = new Web3((window as any).ethereum);
			} catch (error) {
				window.alert('Please allow MetaMask.');
				return;
			}
		}

		const coinbase = await web3.eth.getCoinbase();
		if (!coinbase) {
			window.alert('Please activate MetaMask first.');
			return;
		}

		const publicAddress = coinbase.toLowerCase();
		setLoading(true);

		/*
		---------------------------------------------------------------------
			Authenticate if user with current publicAddress is already exist
		---------------------------------------------------------------------
		*/
		fetch(
			`${process.env.REACT_APP_BACKEND_URL}/user?publicAddress=${publicAddress}`
		)
			.then((response) => response.json())
			/*
			----------------------------------------------------------------
				Check if exist then retrieve it. otherwise first create it.
			----------------------------------------------------------------
			*/
			.then((users) =>
				users.length ? users[0] : onHandleSignUp(publicAddress)
			)
			/* 
			------------------------------------------------------
				Popup MetaMask confirmation modal to sign message
			------------------------------------------------------
			*/
			.then(handleSignMessage)
			/*
			---------------------------------------
				 Validate signature with backend
			---------------------------------------
			*/
			.then(onHandleAuthenticate)
			/*
			------------------------------------------------------------------------------
				Pass accessToken back to parent component (to save it in localStorage)
			-----------------------------------------------------------------------------
			*/
			.then(onLoggedIn)
			.catch((err) => {
				window.alert(err);
				setLoading(false);
			});
	};

	return (
		<div>
			<button className="login-button login-mm" onClick={onHandleLogin}>
				{loading ? 'Loading...' : 'Login with MetaMask'}
			</button>
		</div>
	);
};
