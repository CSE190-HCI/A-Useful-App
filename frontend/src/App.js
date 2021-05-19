import "./App.css";
import Home from "./components/Home"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RedirectPage from "./components/RedirectPage";
import Dashboard from "./components/Dashboard";


function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/" component={Home} exact={true}/>
                    <Route path="/redirect" component={RedirectPage}/>
                    <Route path="/dashboard" component={Dashboard} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
