import "./App.css";
import { RouterProvider } from "react-router";
import { createHashRouter } from "react-router";
import Login from "./pages/Login";
import Layout from "./layout/Layout";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";

const router = createHashRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        element: <Layout />,
        children: [
            { path: "/chat", element: <Chat /> },
            { path: "/chat/:type/:id", element: <Chat /> },
            { path: "/profile/:id", element: <Profile /> },
        ],
    },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
