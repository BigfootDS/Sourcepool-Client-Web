import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "react-use";
import useAsyncReducer from "../utils/useAsyncReducer";

let defaultServerConnection = {
	address:'http://localhost',
	port:'7474'
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
	switch(action.type){
		case 'set':
			if (!connectionStateEditable.address && !connectionStateEditable.port){
				console.log("Invalid server connection data provided, resetting to defaults.");
				connectionStateEditable = defaultServerConnection;
			}
			let apiResult = await fetch(`${connectionStateEditable.address}:${connectionStateEditable.port}/server/clientHandshake`);
			let apiData = await apiResult.json();
			console.log(apiData);
			connectionStateEditable = action.data;
			return connectionStateEditable;
		default:
			console.warn("Invalid action type passed to the server connection reducer, so no data has been changed in the ConnectedServer Context.");
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
			console.log("Server connection found on this device, reconfirming it now.");
			dispatch({
				type:'set',
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