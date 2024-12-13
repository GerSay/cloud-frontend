import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import {Link} from 'react-router-dom';
import "./HeaderForm.css"
import {useEffect, useState} from "react";

const HeaderForm = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const clearStorageAndRefresh = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.reload();
    };

    const handleLogout = () => {
        clearStorageAndRefresh();
        window.location.href = '/signin';
    };

    return (
        <AppBar className="header">
            <Toolbar className="header-page">
                <Typography variant="h3" component="div" className={"header-form"}>
                    GS
                </Typography>

                <Button variant="h3" component={Link} to="/" className={"header-button"}>
                    Начало работы
                </Button>
                <Button variant="h3" component={Link} to="/files" className={"header-button"}>
                    Мои файлы
                </Button>

                {isLoggedIn ? (
                    <Button variant="h3" onClickCapture={handleLogout} className={"header-button"}>
                        Выйти
                    </Button>
                ) : (
                    <Button variant="h3" component={Link} to="/signin" className={"header-button"}>
                        Войти
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default HeaderForm;