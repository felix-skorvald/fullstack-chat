import { useNavigate } from "react-router";
import "./Login.css";
import { useEffect, useState, type KeyboardEvent } from "react";
import { setUserFromToken } from "../data/login";

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
        if (!validate()) {
            return;
        }
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                }),
                headers: {
                    "Content-type": "application/json",
                },
            });
            const data = await res.json();
            if (data.success) {
                setMessage("Lyckades LOGGA IN användare");
                if (data.token) {
                    localStorage.setItem("userToken", data.token);
                    //Kanske använda token?
                    console.log(data.token);
                    navigate("/chat");
                }
            }
        } catch (err) {
            console.error("Fel vid inloggning", err);
        }
    };

    const handleRegister = async () => {
        if (!validate()) {
            return;
        }
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                }),
                headers: {
                    "Content-type": "application/json",
                },
            });
            const data = await res.json();
            if (data.success) {
                setMessage("Lyckades Regga användare");
                if (data.token) {
                    localStorage.setItem("userToken", data.token);
                    //Kanske använda token?
                    console.log(data.token);
                    navigate("/chat");
                }
            }
        } catch (err) {
            console.error("Fel vid inloggning", err);
        }
    };

    const validate = () => {
        if (form.username.length < 1 && form.password.length < 1) {
            setMessage("⚠️ Du måste fylla i din uppgifter");
            setErrors({
                username: "error",
                password: "error",
                confirmedPass: "",
            });
            return false;
        }

        if (form.username.length < 1) {
            setMessage("⚠️ Du måste fylla i användarnamn");
            setErrors({ username: "error", password: "", confirmedPass: "" });
            return false;
        }
        if (form.password.length < 1) {
            setMessage("⚠️ Du måste fylla i lösenord");
            setErrors({ username: "", password: "error", confirmedPass: "" });
            return false;
        }
        if (
            (register && confirmedPass.length < 1) ||
            (register && form.password !== confirmedPass)
        ) {
            setMessage("⚠️ Var snäll upprepa lösenordet");
            setErrors({ username: "", password: "", confirmedPass: "error" });
            return false;
        }
        setMessage("");
        setErrors({ username: "", password: "", confirmedPass: "" });
        return true;
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
    }, [token, navigate]);

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
                        <p>{message}</p>
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
                                validate();
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
                        <p>{message}</p>
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
