export const validate = (
    setMessage: (msg: string) => void,
    setErrors: (errors: { username: string; password: string; confirmedPass: string }) => void,
    form: { username: string; password: string },
    confirmedPass: string,
    register: boolean
): boolean => {
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
    if (!register && form.password.length < 1) {
        setMessage("⚠️ Du måste fylla i lösenord");
        setErrors({ username: "", password: "error", confirmedPass: "" });
        return false;
    }
    if (register && form.password.length < 8) {
        setMessage("⚠️ Lösenordet måste vara minst 8 tecken");
        setErrors({
            username: "",
            password: "error",
            confirmedPass: "",
        });
        return false;
    }
    if (
        (form.password.length >= 1 &&
            register &&
            confirmedPass.length < 1) ||
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