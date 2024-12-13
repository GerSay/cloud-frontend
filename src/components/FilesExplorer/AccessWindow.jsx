import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    ListItemIcon,
} from '@mui/material';

function AccessWindow({ open, onClose, users, file, onGrantAccess }) {
    const [selectedUsers, setSelectedUsers] = useState([]);

    // Метод для заполнения selectedUsers
    const initializeSelectedUsers = () => {
        const usersWithRole = users
            // eslint-disable-next-line react/prop-types
            .filter((user) => user.role != null) // Фильтруем пользователей с ролью
            .map((user) => user.id); // Извлекаем только user.id

        setSelectedUsers(usersWithRole); // Устанавливаем состояние
    };

    // Используем useEffect для инициализации
    useEffect(() => {
        if (users && users.length > 0) {
            initializeSelectedUsers();
        }
    }, [users]); // Выполняется при изменении списка пользователей

    const handleToggle = async (userId) => {
        const isSelected = selectedUsers.includes(userId);
        const newSelectedUsers = isSelected
            ? selectedUsers.filter((id) => id !== userId)  // Если снимаем чекбокс
            : [...selectedUsers, userId];                  // Если устанавливаем чекбокс

        setSelectedUsers(newSelectedUsers);
        const token = localStorage.getItem('token');

        try {
            const nameFile = file.isFile ? "files" : "folders";
            if (isSelected) {
                await fetch(`http://localhost:8080/api/${nameFile}/${file.id}/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log(`Пользователь ${userId} удален из редакторов`);
            } else {
                await fetch(`http://localhost:8080/api/${nameFile}/${file.id}/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log(`Пользователь ${userId} добавлен в редакторы`);
            }
        } catch (error) {
            console.error('Ошибка обновления доступа:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Доступ к файлу</DialogTitle>
            <DialogContent>
                <List>
                    {users.map((user) => (
                        <ListItem key={user.id} button onClick={() => handleToggle(user.id)}>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={selectedUsers.includes(user.id)}
                                    tabIndex={-1}
                                    disableRipple
                                    onChange={() => handleToggle(user.id)}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={user.username}
                                secondary={user.email}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default AccessWindow;
