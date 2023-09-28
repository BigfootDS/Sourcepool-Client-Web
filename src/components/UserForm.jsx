import { useEffect, useState } from "react"
import { useAuth, useAuthDispatch } from "../contexts/AuthContext";
import { useConnectedServerContext } from "../contexts/ConnectedServerContext";


export const UserForm = (props) => {

	let action = props.action;

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const userAuthData = useAuth();
	const userAuthDispatch = useAuthDispatch();

	const serverConnData = useConnectedServerContext();
	// const serverConnDispatch = useConnectedServerDispatchContext();

	useEffect(() => {
		setUsername(userAuthData.username);
		setPassword(userAuthData.password);
	}, [userAuthData])

	const handleChangeUsername = (event) => {
		// validate and sanitise

		// apply to state
		setUsername(event.target.value);
	}

	const handleChangePassword = (event) => {
		// validate and sanitise

		// apply to state
		setPassword(event.target.value);
	}

	const handleSubmit = async (event) => {
		event.preventDefault();

		switch (action){
			case "register":
				console.log("registering user");
				let apiResponse = await fetch(
					`${serverConnData.address}:${serverConnData.port}/users/`, 
					{
						method:"POST",
						headers: {
							"Content-Type":"application/json"
						},
						body: JSON.stringify({username, password})
					}
					);
				let apiData = await apiResponse.json();
				userAuthDispatch({type:"set", data: apiData.user});
				break;
			case "login":
				console.log("logging in user");
				break;
			default:
				console.warn("Unhandled user form action. Nothing is being done when the form is submitted.");
				break;
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="usernameField">Username</label>
				<input 
					type="text" 
					name="usernameField" 
					id="usernameField" 
					onChange={handleChangeUsername} 
					value={username}
				/>
			</div>

			<div>
				<label htmlFor="passwordField">Password</label>
				<input 
					type="password" 
					name="passwordField" 
					id="passwordField" 
					onChange={handleChangePassword} 
					value={password}
				/>
			</div>

			<button type="submit">
				Submit
			</button>
		</form>
	)
}