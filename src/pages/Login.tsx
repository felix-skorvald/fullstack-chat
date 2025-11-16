import { useNavigate } from "react-router";
import "./Login.css";
import { useEffect, useState, type KeyboardEvent } from "react";
import { authFetch, setUserFromToken } from "../data/login";
import { validate } from "../data/validate";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        username: "",
        password: "",
        confirmedPass: "",
    });
    const [confirmedPass, setConfirmedPass] = useState("");
    const [message, setMessage] = useState("");
    const [register, setregister] = useState(false);
    const token = localStorage.getItem("userToken");

    const handleLogin = async () => {
        if (!validate(setMessage, setErrors, form, confirmedPass, register)) {
            return;
        }

        try {
            const data = await authFetch("login", form.username, form.password);

            if (data.success && data.token) {
                setMessage("Lyckades logga in användare");
                localStorage.setItem("userToken", data.token);
                navigate("/chat");
            } else {
                setMessage("Fel användarnamn eller lösenord");
            }
        } catch (err) {
            setMessage("Fel användarnamn eller lösenord");
            console.error("Fel vid inloggning:", err);
        }
    };

    const handleRegister = async () => {
        if (!validate(setMessage, setErrors, form, confirmedPass, register)) {
            return;
        }

        try {
            const data = await authFetch("register", form.username, form.password);

            if (data.success && data.token) {
                setMessage("Lyckades registrera användare");
                localStorage.setItem("userToken", data.token);
                navigate("/chat");
            } else {
                setMessage(data.message || "Användarnamnet är upptaget");
            }
        } catch (err) {
            setMessage("Fel vid registrering");
            console.error("Fel vid registrering:", err);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            register ? handleRegister() : handleLogin();
        }
    };

    useEffect(() => {
        const run = async () => {
            const shouldNavigate = await setUserFromToken(token);
            if (shouldNavigate) {
                navigate("/chat");
            }
        };
        run();
    }, [navigate]);

    return (
        <div className="login-page">
            <div className="container">
                <div className="title">
                    <h2>C H A P P Y</h2>
                </div>
            </div>
            <div className="container">
                <div className="tabs">
                    <button
                        disabled={!register}
                        className="tab-button"
                        onClick={() => {
                            setregister(false);
                            setMessage("");
                            setErrors({
                                username: "",
                                password: "",
                                confirmedPass: "",
                            });
                        }}
                    >
                        LOGGA IN
                    </button>
                    <button
                        disabled={register}
                        className="tab-button"
                        onClick={() => {
                            setregister(true);
                            setMessage("");
                            setErrors({
                                username: "",
                                password: "",
                                confirmedPass: "",
                            });
                        }}
                    >
                        REGISTRERA
                    </button>
                </div>
                {!register ? (
                    <div className="login container">
                        <input
                            type="text"
                            placeholder="Användarnamn"
                            className={errors.username}
                            value={form.username}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    username: event.target.value,
                                })
                            }
                            onKeyDown={handleKeyDown}
                        />
                        <input
                            type="password"
                            placeholder="Lösenord"
                            className={errors.password}
                            value={form.password}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    password: event.target.value,
                                })
                            }
                            onKeyDown={handleKeyDown}
                        />
                        <p style={{ minHeight: "1.5em" }}>{message}</p>
                        <button onClick={handleLogin}>LOGGA IN</button>
                        <button onClick={() => navigate("/chat")}>
                            Fortsätt som Gäst
                        </button>
                    </div>
                ) : (
                    <div className="login container">
                        <input
                            type="text"
                            placeholder="Användarnamn"
                            className={errors.username}
                            value={form.username}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    username: event.target.value,
                                })
                            }
                            onKeyDown={handleKeyDown}
                        />
                        <input
                            type="password"
                            placeholder="Lösenord"
                            className={errors.password}
                            value={form.password}
                            onChange={(event) => {
                                setForm({
                                    ...form,
                                    password: event.target.value,
                                });
                            }}
                            onKeyDown={handleKeyDown}
                        />
                        <input
                            type="password"
                            placeholder="Lösenord igen"
                            className={errors.confirmedPass}
                            value={confirmedPass}
                            onChange={(event) =>
                                setConfirmedPass(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                        />
                        <p style={{ minHeight: "1.5em" }}>{message}</p>
                        <button onClick={handleRegister}>REGISTRERA DIG</button>
                        <button onClick={() => navigate("/chat")}>
                            Fortsätt som Gäst
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
