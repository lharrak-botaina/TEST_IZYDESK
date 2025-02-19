import React from "react"
import { Navigate } from "react-router-dom"


// Dashboard
import Dashboard from "../pages/Dashboard/index"

//Tables
import BasicTables from "../pages/BasicTables"

// Forms


const userRoutes = [
  { path: "/dashboard", component: <Dashboard /> },


  { path: "/tables-basic", component: <BasicTables /> },
 

  
  // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
]


export { userRoutes }