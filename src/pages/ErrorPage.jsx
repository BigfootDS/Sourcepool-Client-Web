import { useRouteError } from "react-router";

export default function ErrorPage(){
	const error = useRouteError();
	console.error(error);

	return(
		<div id="error-page">
			<h1>Critical fail on your navigation check.</h1>
			<p>
				{error.statusText || error.message}
			</p>
		</div>
	);
}