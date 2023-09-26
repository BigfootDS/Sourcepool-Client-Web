import { Outlet, useLocation, useNavigate } from 'react-router';
import './App.css';
import LandingPage from './pages/LandingPage';
import { useConnectedServerContext } from './contexts/ConnectedServerContext';
import { useEffect } from 'react';

function App() {

  let location = useLocation();
  const navigate = useNavigate();

  const serverConnectionData = useConnectedServerContext();

  useEffect(() => {
    // trigger re-render on data update
	if (!serverConnectionData.port || !serverConnectionData.address || !serverConnectionData.connected){
		navigate("/servers/select")
	  } else if (serverConnectionData.adminCount === 0) {
		navigate("/users/register");
	  }
  }, [navigate, serverConnectionData])



  if (location.pathname === "/") {
    return(
      <div className='App'>
        <LandingPage />
      </div>
    )
  } else {
    return (
      <div className="App">
        <Outlet />
      </div>
    );
  }


}

export default App;
