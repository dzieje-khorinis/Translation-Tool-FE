import React from "react";
import {Redirect, Route} from "react-router-dom";
import {reactPathLogin} from "../../common/routes";


function AuthRoute(props) {
    const {type, location, loggedIn} = props;

    if (type === "guest" && loggedIn) {
        const searchParams = new URLSearchParams(location.search);
        const nextPath = searchParams.get("next") || "/"
        return <Redirect to={nextPath}/>;
    } else if (type === "private" && !loggedIn) {
        return <Redirect to={reactPathLogin}/>;
    }
    return <Route {...props} />;
}

export default AuthRoute;
