import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Survey from './pages/Survey';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';

function getLibrary(provider) {
  return new Web3(provider);
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route path="/survey" component={Survey} onEnter={() => console.log('Entered survey')} />
          {/* </Route> */}
        </Switch>
      </Router>
    </Web3ReactProvider>
    
  );
}

export default App;
