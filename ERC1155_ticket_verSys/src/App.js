import {React, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Mint from './Mint';
import Verify from './Verify';
import MerkleProof from './MerkleProof';
import QRScan from './QRScan';

const App = () => {
  const [accounts, setAccounts] = useState([]);

  return(
    <Router>
      <div className="App">
        <Navbar accounts={accounts} setAccounts={setAccounts} />
        <div className="content">
          <Switch>
            <Route exact path="/">
              { <Home /> }
            </Route>
            <Route path="/Mint/Audience">
              { <Mint accounts={accounts}/> }
            </Route> 
            
            <Route>
              { <Verify exact path="/Verify" accounts={accounts}/> }
            </Route>
                        <Route>
              { <MerkleProof exact path="/MerkleProof" accounts={accounts}/> }
            </Route>
            <Route>
              { <QRScan path="/QRScan"/> }
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App;