import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "react-use";
import useAsyncReducer from "../utils/useAsyncReducer";

let defaultAuthValues = {
	_id:'',
	username:'',
	password:''
};

export const AuthContext = createContext(null);
export const AuthDispatchContext = createContext(null);

export function useAuth() {
	return useContext(AuthContext);
}

export function useAuthDispatch(){
	return useContext(AuthDispatchContext);
}

async function authReducer(currentAuthState, action){
	let authStateEditable = {...currentAuthState};
	switch(action.type){
		case 'set':
			// let apiResult = await fetch()
			authStateEditable = action.data;
			return authStateEditable;
		default:
			console.warn("Invalid action type passed to the auth reducer, so no data has been changed in the Auth Context.");
			return authStateEditable;
	}
}


export function AuthProvider({children}){
	const [authLocalStorage, setAuthLocalStorage] = useLocalStorage('spl-auth', defaultAuthValues);

	function reducerInitializer () {
		return authLocalStorage || defaultAuthValues;
	}

	const [auth, dispatch] = useAsyncReducer(authReducer, reducerInitializer);

	// On app boot, retrieve any local storage auth data and apply it to state
	useEffect(() => {
		if (authLocalStorage.username && authLocalStorage._id && authLocalStorage.password){
			console.log("User login found on this device, reconfirming it now.");
			dispatch({
				type:'set',
				data: authLocalStorage
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Whenever auth data changes, update the localstorage data to match it.
	useEffect(() => {
		setAuthLocalStorage(auth);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth]);

	return (
		<AuthContext.Provider value={auth}>
			<AuthDispatchContext.Provider value={dispatch}>
				{children}
			</AuthDispatchContext.Provider>
		</AuthContext.Provider>
	);
}