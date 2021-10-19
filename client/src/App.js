import React, { Component } from "react";
import "./App.css";
import Main from "./pages/Main";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

//App Component
export default class App extends Component {
	render() {
		return (
			//Use Browser Router to route to different pages
			<BrowserRouter>
				<div>
					{/* App Component Has a Child Component called Main*/}
					<Main />
				</div>
			</BrowserRouter>
		);
	}
}
