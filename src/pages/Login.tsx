import { useNavigate } from "react-router";
import "./Login.css";
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [confirmedPass, setConfirmedPass] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
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

    const [register, setregister] = useState(false);

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
                        onClick={() => setregister(false)}
                    >
                        LOGGA IN
                    </button>
                    <button
                        disabled={register}
                        className="tab-button"
                        onClick={() => setregister(true)}
                    >
                        REGISTRERA
                    </button>
                </div>
                {!register ? (
                    <div className="login container">
                        <input
                            type="text"
                            placeholder="Användarnamn"
                            value={form.username}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    username: event.target.value,
                                })
                            }
                        />
                        <input
                            type="password"
                            placeholder="Lösenord"
                            value={form.password}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    password: event.target.value,
                                })
                            }
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
                            value={form.username}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    username: event.target.value,
                                })
                            }
                        />
                        <input
                            type="password"
                            placeholder="Lösenord"
                            value={form.password}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    password: event.target.value,
                                })
                            }
                        />
                        <input
                            type="password"
                            placeholder="Lösenord igen"
                            value={confirmedPass}
                            onChange={(event) =>
                                setConfirmedPass(event.target.value)
                            }
                        />
                        <button
                            disabled={form.password !== confirmedPass}
                            onClick={handleRegister}
                        >
                            REGISTRERA DIG
                        </button>
                        <button onClick={() => navigate("/chat")}>
                            Fortsätt som Gäst
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
