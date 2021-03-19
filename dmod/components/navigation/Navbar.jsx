import React from 'react';
import Link from 'next/link';

function Navbar() {

    let navbarLinks = [
        {
            name: "Apply",
            link: "/apply"
        },
        {
            name: "Listings",
            link: "/listings"
        },
        {
            name: "Discord", 
            link: "/discord"
        }
    ];

    return (
        <div>
          <header>
            <Link href="/"><img className="logo" src={"/logo.png"} alt="dmod.gg logo"></img></Link>
            <nav>
                <ul className="nav__links">
                    {navbarLinks.map((link) => {
                        return <li><Link href={link.link}><a>{link.name}</a></Link></li>
                    })}
                </ul>
            </nav>
            <Link className="lgn" href="http://localhost:4000/login"><button className="primary-button">Login</button></Link>
          </header>
        </div>
    )
}

export default Navbar;