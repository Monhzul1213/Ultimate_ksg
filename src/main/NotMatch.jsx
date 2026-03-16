import React from 'react';
import cookie from "react-cookies";
import Dashboard from "@/product/Dashboard.jsx";
import { HashRouter as Router,Route } from "react-router-dom";



class compon extends React.Component{

	constructor(props) {
		super(props);
	
		const cookieUser = cookie.load("LoggedSysuser");
	
		this.state = {
		  cookieUser,
		  loading: false
		};
	  }

	render(){
		console.log(this.state.cookieUser);
		return (
			<div className="Margin">
				{this.state.cookieUser.CompanyID == 'NUBIA' ? <Route component={Dashboard} /> : "Not found" }


				{/* <Route component={Dashboard} />  */}
			</div>
		);
	}
}
export default compon;