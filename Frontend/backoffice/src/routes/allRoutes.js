import React from "react"
import { Navigate } from "react-router-dom"
// import Home from "../pages/Home"


// Home

//Tables
// import BasicTables from "../pages/BasicTables"

// Forms


const userRoutes = [
  // { path: "/home", component: <Home /> },


  // { path: "/tables-basic", component: <BasicTables /> },
 

  
  // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    component: <Navigate to="/Home" />,
  },
]


export { userRoutes }