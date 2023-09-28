import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "react-use";
import useAsyncReducer from "../utils/useAsyncReducer";

let defaultServerConnection = {
	address:'localhost',
	port:'7474',
	name:'Sourcepool Server',
	adminCount: 0,
	connected: false
};

export const ConnectedServerContext = createContext(null);
export const ConnectedServerDispatchContext = createContext(null);

export function useConnectedServerContext() {
	return useContext(ConnectedServerContext);
}

export function useConnectedServerDispatchContext(){
	return useContext(ConnectedServerDispatchContext);
}

async function serverReducer(currentConnectionState, action){
	let connectionStateEditable = {...currentConnectionState};

	if (action.data?.address && !action.data?.address?.startsWith("http://")){
		action.data.address = "http://" + action.data.address;
	}

	try {
		switch(action.type){
			case 'boot':
				// applies given connection data to state and then returns that state
				connectionStateEditable = {...action.data};
				return connectionStateEditable;
			case 'set':
				// applies given connection data to state and tests the connection
				// returning state contains connection data plus a handshake response from the server
				if (!connectionStateEditable.address && !connectionStateEditable.port){
					console.log("Invalid server connection data provided, resetting to defaults.");
					connectionStateEditable = defaultServerConnection;
				}
				let apiResult = await fetch(`${connectionStateEditable.address}:${connectionStateEditable.port}/api/server/clientHandshake`);
				console.log(apiResult);
				let apiData = await apiResult.json();
				console.log(apiData);
				connectionStateEditable = {...action.data, ...apiData};
				connectionStateEditable.connected = true;
				return connectionStateEditable;
			default:
				console.warn("Invalid action type passed to the server connection reducer, so no data has been changed in the ConnectedServer Context.");
				return connectionStateEditable;
		}
	} catch (error) {
		console.warn("Error in the server connection reducer. Data currently stored within the client regarding server connections has not been modified due to this error. Please let the server admin know!\n" + error);
		return connectionStateEditable;
	}
}


export function ServerConnectionProvider({children}){
	const [serverLocalStorage, setServerLocalStorage] = useLocalStorage('spl-server', defaultServerConnection);

	function reducerInitializer () {
		return serverLocalStorage || defaultServerConnection;
	}

	const [serverConnection, dispatch] = useAsyncReducer(serverReducer, reducerInitializer);

	// On app boot, retrieve any local storage server connection data and apply it to state
	useEffect(() => {
		if (serverLocalStorage.address && serverLocalStorage.port){
			dispatch({
				type:'boot',
				data: serverLocalStorage
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Whenever serverConnection data changes, update the localstorage data to match it.
	useEffect(() => {
		setServerLocalStorage(serverConnection);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [serverConnection]);

	return (
		<ConnectedServerContext.Provider value={serverConnection}>
			<ConnectedServerDispatchContext.Provider value={dispatch}>
				{children}
			</ConnectedServerDispatchContext.Provider>
		</ConnectedServerContext.Provider>
	);
}