import { useRouteError } from "react-router-dom";
import { Button } from "@nextui-org/button";

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div
            id="error-page"
            className="flex flex-col justify-between min-h-screen bg-[#282c34] text-white p-6"
        >
            <div className="text-center space-y-6 self-center mt-auto">
                <span role="img" aria-label="Error" className="text-6xl">⚠️</span>
                <h1 className="text-4xl font-semibold">Oops!</h1>
                <p className="text-lg">Sorry, an unexpected error has occurred.</p>
                <p className="italic text-gray-400">
                    {error.statusText || error.message}
                </p>
                <Button
                    auto
                    onClick={() => window.location.href = "/"}
                    className="text-white bg-[#4e2a84] hover:bg-[#6d28d9]"
                >
                    Return to Home
                </Button>
            </div>

            <footer className="w-full p-8 mt-auto border-gray-600">
                <p className="text-center text-gray-400 text-sm">Northwestern University</p>
                <p className="text-center text-gray-400 text-sm">© {new Date().getFullYear()} Wildcat Deals</p>
            </footer>
        </div>
    );
};

export default ErrorPage;
