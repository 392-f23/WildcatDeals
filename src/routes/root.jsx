import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./root.css";
import useDealsStore from "../utilities/stores";
import { getDbData } from "../utilities/firebase";
import { useLocation } from 'react-router-dom';
import Banner from "../components/Banner";

const Root = () => {
    const setBusiness = useDealsStore((state) => state.setBusiness);
    const business = useDealsStore((state) => state.business);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);


    useEffect(() => {
        getDbData("/businesses").then((data) => {
            setBusiness(data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <div className="App min-h-screen flex flex-col">
            {pathname !== '/login' &&
                <Banner />
            }
            <div className="flex-grow">
                {business ? (
                    <Outlet />
                ) : (
                    <div className="text-center mt-8">
                        <p className="text-lg font-bold text-white">Loading...Paws for a moment</p>
                    </div>
                )}
            </div>
            {pathname !== '/map' && pathname !== '/login' &&
                <footer className="w-full p-8">
                    <p className="text-center text-default-500 text-sm">Northwestern University</p>
                    <p className="text-center text-default-500 text-sm">© {new Date().getFullYear()} Wildcat Deals</p>
                </footer>
            }
        </div>
    );
};

export default Root;
