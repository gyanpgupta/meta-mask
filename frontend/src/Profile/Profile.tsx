import React, { useState, useEffect } from 'react';
import Blockies from 'react-blockies';
import jwtDecode from 'jwt-decode';

import { IProfileProps, IProfileState, JwtDecoded } from '../Interfaces';
import './Profile.css';


export const Profile = ({ auth, onLoggedOut }: IProfileProps): JSX.Element => {
	const [state, setState] = useState<IProfileState>({
		loading: false,
		user: undefined,
		username: '',
	});

	useEffect(() => {
		const { accessToken } = auth;
		const {
			payload: { id },
		} = jwtDecode<JwtDecoded>(accessToken);

		fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((response) => response.json())
			.then((user) => setState({ ...state, user }))
			.catch(window.alert);
		// eslint-disable-next-line
	}, []);

	/*
	-------------------------------
		Function to manage states
	------------------------------
	*/
	const onHandleInputChange = ({
		target: { value },
	}: React.ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, username: value });
	};

	/*
	-----------------------------------
		Function to manage form submit
	-----------------------------------
	*/
	const onHandleSubmit = () => {
		const { accessToken } = auth;
		const { user, username } = state;
		if (!username) {
			window.alert(
				'Please enter username.'
			);
			return;
		}
		setState({ ...state, loading: true });

		if (!user) {
			window.alert(
				'The user id has not been fetched yet. Please try again in 5 seconds.'
			);
			return;
		}

		fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${user.id}`, {
			body: JSON.stringify({ username }),
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			method: 'PATCH',
		})
			.then((response) => response.json())
			.then((user) => setState({ ...state, loading: false, user }))
			.catch((err) => {
				window.alert(err);
				setState({ ...state, loading: false });
			});
	};

	const { accessToken } = auth;


	const {
		payload: { publicAddress },
	} = jwtDecode<JwtDecoded>(accessToken);

	const { loading, user } = state;

	const username = user && user.username;

	return (
		<div className="Profile">
			<p>
				Logged in as <Blockies seed={publicAddress} />
			</p>
			<div className='mtb-2 username' >
				My username is: {username ? <b>{username}</b> : 'not set.'}{' '}
			</div>
			<div className='mtb-2'>
				My publicAddress is: <b>{publicAddress}</b>
			</div>
			<div className='mtb-2'>
				<form onSubmit={onHandleSubmit}>
					<label htmlFor="username">Change username: </label>
					<input name="username" onChange={onHandleInputChange} />
					<button disabled={loading} type='submit' className="submit-button submit-mm">
						Submit
					</button>
				</form>
			</div>
			<p>
				<button onClick={onLoggedOut} className="logout-button logout-mm">Logout</button>
			</p>
		</div>
	);
};
