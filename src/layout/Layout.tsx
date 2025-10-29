import { Outlet } from "react-router";
import Header from "../components/Header";
import "./Layout.css";

export default function Layout() {
    return (
        <div className="layout">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
