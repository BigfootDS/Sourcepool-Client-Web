import { useNavigate } from "react-router";
import { UserForm } from "../components/UserForm";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";


export default function UserSelectionPage(props){

	const authContextData = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (authContextData._id){
			navigate("/landing");
		} 
	}, [authContextData, navigate])

	return (
		<div>
			<h1>Create a new user</h1>
			<UserForm action={props.action} />
		</div>
	)
	
}