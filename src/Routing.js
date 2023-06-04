import React from 'react'
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom';
const Routing = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Login</Link>
                        </li>
                        <li>
                            <Link to="/new">Add Contact</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/new">
                        <ContactForm />
                    </Route>
                    <Route path="/edit/:id">
                        <ContactForm />
                    </Route>
                    <Route path="/">
                        <Contacts />
                    </Route>
                </Routes>
            </div>
        </Router>
    )
}

export default Routing
