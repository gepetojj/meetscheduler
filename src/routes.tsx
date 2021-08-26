import { Suspense, lazy } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import LoadingContent from "./components/LoadingContent";
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

export default function Routes() {
	return (
		<HashRouter>
			<Suspense fallback={<LoadingContent />}>
				<Switch>
					<Route exact path="/" component={Landing} />
					<Route path="/dashboard" component={Dashboard} />
				</Switch>
			</Suspense>
		</HashRouter>
	);
}
