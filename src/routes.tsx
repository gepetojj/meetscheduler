import { HashRouter, Switch, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

export default function Routes() {
	return (
		<HashRouter>
			<Switch>
				<Route exact path="/" component={Landing} />
				<Route path="/dashboard" component={Dashboard} />
			</Switch>
		</HashRouter>
	);
};

