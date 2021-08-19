import React from "react";

import './name-register.scss'
export const NameRegister = () => {


    return <div id="name-register">
        <form action="none">

        <input type="text" placeholder="Enter Your Name" name="name" id="name" />
        <input type="submit" name="summit" value="START" id="submit" />
        </form>
    </div>
}