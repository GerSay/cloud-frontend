import {useState} from 'react';
import {TextField, Button, Typography, Box} from '@mui/material';
import "../components/SignForm.css"

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            console.log('Попытка регистрации:', { username, email });

            const response = await fetch('http://localhost:8080/api/auth/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            if (!response.ok) {
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
            setError(`Ошибка при регистрации: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box className="sign-page">
            <form onSubmit={handleSubmit} className="sign-form">
                <Typography variant="h4" gutterBottom className="form-header">Регистрация</Typography>

                <div className="form-group">
                    <TextField
                        variant="standard"
                        fullWidth
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
                        variant="standard"
                        fullWidth
                        id="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        type="email"
                        required
                        className="input"
                    />
                </div>

                <div className="form-group">
                    <TextField
                        variant="standard"
                        fullWidth
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

                <div className="form-group">
                    <TextField
                        variant="standard"
                        fullWidth
                        id="confirmPassword"
                        label="Подтвердите пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        name="confirmPassword"
                        type="password"
                        required
                        className="input"
                    />
                </div>

                {error && (
                    <Typography className={"error-message"}>{error}</Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="inherit"
                    fullWidth
                    className="submit"
                >
                    {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                </Button>
            </form>
        </Box>
    );
};

export default Signup;