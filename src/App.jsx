import React, { useEffect } from "react";
import "./App.css";

import Banner from "./components/Banner";

const App = () => {

    return (
        <div className="App min-h-screen flex flex-col">
            <Banner />
            <div className="flex-grow">
            </div>
            <footer className="w-full p-8">
                <p className="text-center text-default-500 text-sm">Northwestern University</p>
                <p className="text-center text-default-500 text-sm">© 2023 Wildcat Deals</p>
            </footer>

        </div>
    );
};

export default App;
