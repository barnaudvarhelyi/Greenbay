import { useEffect } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"

export default function Navbar(props){

    let loggedIn = localStorage.getItem("username")

    const location = useLocation()

    /* Checks if the user is on the Home Page, if not, hides the navbar */
    useEffect(() => {
        if(location.pathname !== '/'){
            document.querySelector('.search-bar').style.display = 'none'
        } else {
            document.querySelector('.search-bar').style.display = 'block'
        }
    }, [location])
 
    return (
        <section className="navbar">

        <nav>
            <div className="container">
                <Link to="/"><h1>Greenbay</h1></Link>               
                <input type="text" className="search-bar" placeholder="Start typing..." onChange={props.search}/>
                <Link to={loggedIn ? "/profile" : "/login"}>{loggedIn ? loggedIn : "Login"}</Link>
            </div>
        </nav>
        <Outlet />

        </section>

    )
}