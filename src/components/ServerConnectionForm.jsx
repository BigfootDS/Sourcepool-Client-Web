import { useEffect, useState } from "react"
import { useConnectedServerContext, useConnectedServerDispatchContext } from "../contexts/ConnectedServerContext";


export const ServerConnectionForm = (props) => {

	const connectedServerData = useConnectedServerContext();
	const connectedServerDispatch = useConnectedServerDispatchContext();
	const [address, setAddress] = useState('');
	const [port, setPort] = useState('');

	useEffect(() => {

		setAddress(connectedServerData?.address);
		setPort(connectedServerData?.port);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [connectedServerData]);

	const handleChangeAddress = (event) => {
		// validate and sanitise

		// apply to state
		setAddress(event.target.value);
	}

	const handleChangePassword = (event) => {
		// validate and sanitise

		// apply to state
		setPort(event.target.value);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		
		connectedServerDispatch({
			type:'set',
			data: {
				address, port
			}
		})
	}

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="addressField">Server Address</label>
				<input 
					type="text" 
					name="addressField" 
					id="addressField" 
					onChange={handleChangeAddress} 
					value={address}
				/>
			</div>

			<div>
				<label htmlFor="portField">Server Port</label>
				<input 
					type="number" 
					name="portField" 
					id="portField" 
					onChange={handleChangePassword} 
					value={port}
				/>
			</div>

			<button type="submit">
				Submit
			</button>
		</form>
	)
}