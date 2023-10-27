import React, { useEffect } from "react";
import "./App.css";

import Banner from "./components/Banner";
import DealCard from "./components/DealCard";

const App = () => {
  const deal = {
    "Name": "Living Mindfully Yoga",
    "Discount": "10% off a series of 6 private yoga sessions;15% off first 60-minute Shiatsu session;Free health history",
    "Address": "1310 Chicago Ave.Evanston, IL 60202",
    "Phone": "847-492-0227",
    "Description": "Claudia Braun-Cole started Living Well Now in 1993 out of a desire to offer individuals a better way to take care of themselves. Claudia has combined her Shiatsu training, yoga instruction, and spiritual tools to offer services that treat the whole person. Whether in individual sessions or corporate programs, the intention is to teach people to be present to their true needs and desires by discovering the wisdom of their inner guidance and letting it direct their actions. The more awake we are to ourselves, the more we can be open to the direction our inner self is guiding us to take.",
    "Website": "www.livingmindfullyhealthcoaching.com",
    "Email": "info@livingmindfully.net",
    "Category": "Arts,Crafts, & Hobbies"
  }
  
    return (
        <div className="App min-h-screen flex flex-col">
            <Banner />
            <div className="flex-grow">
            </div>
            <DealCard deal={deal} />
            <footer className="w-full p-8">
                <p className="text-center text-default-500 text-sm">Northwestern University</p>
                <p className="text-center text-default-500 text-sm">© 2023 Wildcat Deals</p>
            </footer>

        </div>
    );
};

export default App;
