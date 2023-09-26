import { useNavigate } from "react-router";
import { ServerConnectionForm } from "../components/ServerConnectionForm";
import { useConnectedServerContext } from '../contexts/ConnectedServerContext';
import { useEffect } from "react";


export default function ServerSelectionPage(props){

	const serverConnectionData = useConnectedServerContext();

	const navigate = useNavigate();

	useEffect(() => {
		// trigger a re-render when content updates

		if (serverConnectionData.connected){
			if (serverConnectionData.adminCount === 0){
				navigate("/users/register");
			} else {
				navigate("/users/login");
			}
		} 
	}, [navigate, serverConnectionData]);


	return (
		<ServerConnectionForm />
	)
	
}