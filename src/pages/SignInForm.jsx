import { TextField, Button, Typography, Box } from '@mui/material';
import {useState} from "react";
import {Link} from "react-router-dom";
import "../components/SignForm.css"

const Signin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            console.log('Попытка входа:', { username, password });

            const response = await fetch('http://localhost:8080/api/auth/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (response.status === 403) {
                window.location.href = '/signin';
            } else if (!response.ok) {
                const data = await response.json();
                setError(data.msg || 'Неизвестная ошибка');
            } else {
                console.log('Успешный вход');
                const data = await response.json();
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            }
        } catch (err) {
            console.error(err);
            setError(`Ошибка при входе: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box className="sign-page">
            <form onSubmit={handleSubmit} className="sign-form">
                <Typography variant="h4" gutterBottom className="form-header">Вход</Typography>

                <div className="form-group">
                    <TextField
                        fullWidth
                        variant="standard"
                        id="username"
                        label="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        name="username"
                        required
                        className="input"
                    />
                </div>

                <div className="form-group">
                    <TextField
                        fullWidth
                        variant="standard"
                        id="password"
                        label="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        type="password"
                        required
                        className="input"
                    />
                </div>

                {error && (
                    <Typography color="error">{error}</Typography>
                )}

                <Box display="flex" justifyContent="space-between">
                    <Link to="/signup">
                        <Button variant="text" color="primary">
                            Регистрация
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        variant="contained"
                        color="inherit"
                        className="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : 'Войти'}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default Signin;