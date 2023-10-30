import React, { useEffect } from "react";
import "./App.css";

import Banner from "./components/Banner";
import DealCard from "./components/DealCard";
import DealList from "./components/DealList"

const App = () => {
  // const deal = {
  //   "Name": "Living Mindfully Yoga",
  //   "Discount": "10% off a series of 6 private yoga sessions;15% off first 60-minute Shiatsu session;Free health history",
  //   "Address": "1310 Chicago Ave.Evanston, IL 60202",
  //   "Phone": "847-492-0227",
  //   "Description": "Claudia Braun-Cole started Living Well Now in 1993 out of a desire to offer individuals a better way to take care of themselves. Claudia has combined her Shiatsu training, yoga instruction, and spiritual tools to offer services that treat the whole person. Whether in individual sessions or corporate programs, the intention is to teach people to be present to their true needs and desires by discovering the wisdom of their inner guidance and letting it direct their actions. The more awake we are to ourselves, the more we can be open to the direction our inner self is guiding us to take.",
  //   "Website": "www.livingmindfullyhealthcoaching.com",
  //   "Email": "info@livingmindfully.net",
  //   "Category": "Arts,Crafts, & Hobbies"
  // }

  const deal1 = [{
    "name": "Jamaica Jerk Chicken",
    "description": "Jamaica Jerk is a restaurant that serves delicious Jamaican and Caribbean cuisine in a wonderful tropical atmosphere. Our food is made from scratch with only\u00c2\u00a0top quality ingredients, including spices, vegetables, and fresh fruits. Whether you are in the mood for jerk chicken or oxtail and beans, our food is sure to make your mouth water for more!",
    "address": "3357 Dempster St.Evanston, IL 60076",
    "phone": "847-933-3304",
    "email": null,
    "website": "http://www.jamaicajerk-il.com",
    "discount_info": "10% off purchases made with WildcardThis discount does not apply to catering orders, and may not be combined with any other offers"
  },
  {
    "name": "Hewn",
    "description": "Hewn is a bakery that specializes in breads and pastries. Everything at Hewn is made in-house, from scratch daily. We source local and seasonal ingredients from small, local farmers when their flavors are at their peak. All of our breads are hand-mixed, hand-shaped, and naturally fermented without commercial yeast. The seasonal sandwiches, salads, and grains adhere to a philosophy of serving food that promotes a healthy body.",
    "address": "810 Dempster St.Evanston, IL 60202",
    "phone": "847-869-HEWN",
    "email": "julie@hewnbread.com",
    "website": "http://www.hewnbread.com",
    "discount_info": "10% off"
  }
]

  
    return (
        <div className="App min-h-screen flex flex-col">
            <Banner />
            <div className="flex-grow">
            </div>
            {deal1.map((deal, index) => <DealCard key={index} deal={deal} />)}
            {deal1.map((deal, index) => <DealList key={index} deal={deal} />)}
            <footer className="w-full p-8">
                <p className="text-center text-default-500 text-sm">Northwestern University</p>
                <p className="text-center text-default-500 text-sm">© 2023 Wildcat Deals</p>
            </footer>

        </div>
    );
};

export default App;
