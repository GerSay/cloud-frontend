import React, {useEffect, useState} from 'react';
import {
    Typography,
    Menu,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import AccessWindow from './AccessWindow.jsx'; // Импортируем компонент
import './StorageForm.css';

function StorageForm() {
    const [folders, setFolders] = useState([]);  // Initial empty folders
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);  // Изменено на объект
    const [isAccessWindowOpen, setIsAccessWindowOpen] = useState(false);
    const [currentFolderId, setCurrentFolderId] = useState(null);  // Состояние для текущего folderId
    const [currentUser, setCurrentUser] = useState(null);
    const [folderStack, setFolderStack] = useState([null]);  // Стек для отслеживания истории папок, начинаем с null
    const [newFolderName, setNewFolderName] = useState('');
    const [openCreateFolderDialog, setOpenCreateFolderDialog] = useState(false);
    const [users, setUsers] = useState([]);

    // Fetch folder data based on folderId
    const fetchFolderData = (folderId) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8080/api/storage${folderId ? `?id=${folderId}` : ''}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setFolders(data); // Set the fetched folders
                setCurrentFolderId(folderId);
            })
            .catch((error) => console.error('Error fetching folder data:', error));
    };

    // Fetch and download file
    const fetchDownloadFile = (file) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8080/api/files/${file.id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();  // Get the file as a blob
            })
            .then((blob) => {
                // Create a temporary URL for the blob file
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = file.name; // Use the file name from the object
                document.body.appendChild(link);
                link.click();  // Trigger the download
                link.remove();  // Clean up the link element
            })
            .catch((error) => console.error('Error downloading file:', error));
    };

    const fetchDeleteFile = (file) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8080/api/files/${file.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                fetchFolderData(file.folderId);
                return response.status;
            })
            .catch((error) => console.error('Error deleting file:', error));
    };

    useEffect(() => {
        handleUserInfo();
        fetchFolderData(null);  // Fetch folder data for initial folderId (null for root)
    }, []);

    const handleContextMenu = (event, file) => {
        event.preventDefault();
        setSelectedFile(file);  // Save the entire file object, not just the ID
        setMenuAnchor(event.currentTarget);
    };

    const handleOpenMenu = () => {
        handleUsers(selectedFile.id);
    }

    const handleCloseMenu = () => {
        setMenuAnchor(null);
    };

    const handleShare = () => {
        setIsAccessWindowOpen(true); // Open access window
        handleCloseMenu();
    };

    const handleGrantAccess = () => {
    }

    // Handle the "Back" button
    const handleGoBack = () => {
        if (folderStack.length > 1) {  // Check if there's more than just the root (null)
            const previousFolderId = folderStack[folderStack.length - 1];  // Get previous folder ID
            setFolderStack(folderStack.slice(0, -1));  // Remove the current folderId from the stack
            fetchFolderData(previousFolderId);  // Fetch previous folder data
        }
    };

    // Handle folder navigation
    const handleNavigateToFolder = (folderId) => {
        setFolderStack([...folderStack, currentFolderId]);  // Add current folder to stack before navigating
        fetchFolderData(folderId);  // Fetch subfolder data
    };

    // Handle file upload
    const handleFileUpload = (event) => {
        const token = localStorage.getItem('token');
        const file = event.target.files[0];  // Get the uploaded file
        if (file) {
            const formData = new FormData();
            formData.append('data', file);
            if (currentFolderId) {
                formData.append('folderId', currentFolderId);
            }
            fetch('http://localhost:8080/api/files', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })
                .then(() => {
                    fetchFolderData(currentFolderId); // Refresh folder after upload
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                });
        }
    };

    // Создание новой папки
    const handleCreateFolder = () => {
        const token = localStorage.getItem('token');
        const body = {
            name: newFolderName,  // Имя новой папки
            parentId: currentFolderId,  // ID родительской папки
        };

        fetch('http://localhost:8080/api/folders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
            .then(() => fetchFolderData(currentFolderId))
            .then((data) => {
                console.log('Folder created:', data);
                setNewFolderName('');  // Очистить поле ввода
                setOpenCreateFolderDialog(false);  // Закрыть диалог
                fetchFolderData(currentFolderId);  // Обновить папки
            })
            .catch((error) => {
                console.error('Error creating folder:', error);
            });
    };

// Открытие диалога создания папки
    const handleOpenCreateFolderDialog = () => {
        setOpenCreateFolderDialog(true);
    };

// Закрытие диалога
    const handleCloseCreateFolderDialog = () => {
        setOpenCreateFolderDialog(false);
    };

    const handleUploadExcel = () => {
        const token = localStorage.getItem('token');

        // Запрос на экспорт файла (например, Excel)
        fetch('http://localhost:8080/api/admin/export/xlsx', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch file');
                }
                return response.blob();  // Получаем ответ в формате Blob
            })
            .then((blob) => {
                // Создаем временную ссылку для скачивания файла
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'database.xlsx'; // Указываем имя файла для скачивания
                document.body.appendChild(link); // Добавляем ссылку в DOM
                link.click();  // Имитируем клик для начала скачивания
                link.remove(); // Убираем ссылку из DOM
            })
            .catch((error) => {
                console.error('Error downloading the file:', error);
            });
    };

    const handleUploadCsv = () => {
        const token = localStorage.getItem('token');

        // Запрос на экспорт файла (например, Excel)
        fetch('http://localhost:8080/api/admin/export/csv', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch file');
                }
                return response.blob();  // Получаем ответ в формате Blob
            })
            .then((blob) => {
                // Создаем временную ссылку для скачивания файла
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'database.csv'; // Указываем имя файла для скачивания
                document.body.appendChild(link); // Добавляем ссылку в DOM
                link.click();  // Имитируем клик для начала скачивания
                link.remove(); // Убираем ссылку из DOM
            })
            .catch((error) => {
                console.error('Error downloading the file:', error);
            });
    };

    const handleUsers = (fileId) => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/api/users/${fileId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Server response was not OK');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched users:', data);

                setUsers(Array.isArray(data) ? data : []);
                if (!Array.isArray(data)) {
                    console.error('Server returned non-array data', data);
                }
            })
            .catch((error) => {
                console.error('Failed to fetch users', error);
            });
    };

    const clearStorageAndRefresh = () => {
        localStorage.removeItem('token');
        window.location.href= "/signin";
    };

    const handleUserInfo = () => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:8080/api/users/user`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (!response.ok) {
                clearStorageAndRefresh();
            }
            return response.json();
        })
            .then(userData => {
                if (!userData) {
                    console.error('Server returned non-array data', userData);
                }
                setCurrentUser(userData);
                console.log(currentUser);
            })
    }

    return (
        <div className="storage-form">
            {/* Верхние кнопки */}
            <div className="storage-actions">
                <div>
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={handleGoBack}
                        disabled={folderStack.length <= 1}  // Disable the button if there are no previous folders (only root in the stack)
                    >
                        Назад
                    </Button>
                </div>
                <div className="right-top-actions">
                    <Button
                        variant="contained"
                        component="label"
                        color="inherit"
                    >
                        Загрузить файл
                        <input type="file" hidden onChange={handleFileUpload}/>
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenCreateFolderDialog}
                    >
                        Создать папку
                    </Button>
                </div>
            </div>

            {/* Контейнер для файлов */}
            <div className="storage-files-container">
                {folders.map((file) => (
                    <div
                        key={file.id}
                        className={`storage-files-item ${
                            selectedFile?.id === file.id ? "selected" : ""
                        }`}
                        onContextMenu={(event) => handleContextMenu(event, file)}
                        onDoubleClick={() => handleNavigateToFolder(file.id)}
                    >
                        <div className="file-logo">
                            {file.isFile ? <DescriptionIcon/> : <FolderIcon/>}
                        </div>
                        <div className="file-name">{file.name}</div>
                    </div>
                ))}
            </div>

            {/* Нижние кнопки */}
            {currentUser?.role === 'ROLE_ADMIN' && (
                <div className="storage-actions">
                    <div className="right-bottom-actions">
                        <Button variant="contained" color="inherit" onClick={handleUploadExcel}>
                            Excel
                        </Button>
                        <Button variant="contained" color="inherit" onClick={handleUploadCsv}>
                            CSV
                        </Button>
                    </div>
                </div>
            )}
            {/* Диалог создания папки */}
            <Dialog open={openCreateFolderDialog} onClose={handleCloseCreateFolderDialog}>
                <DialogTitle>Создать новую папку</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Имя папки"
                        variant="outlined"
                        fullWidth
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateFolderDialog} color="primary">
                        Закрыть
                    </Button>
                    <Button onClick={handleCreateFolder} color="primary">
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Контекстное меню */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClick={handleOpenMenu}
                onClose={handleCloseMenu}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
                transformOrigin={{vertical: "top", horizontal: "left"}}
            >
                {selectedFile?.isFile && (
                    <MenuItem onClick={() => fetchDownloadFile(selectedFile)}>
                        Скачать
                    </MenuItem>
                )}
                {}
                <MenuItem onClick={() => fetchDeleteFile(selectedFile)}>Удалить</MenuItem>
                <MenuItem onClick={handleShare}>Доступ</MenuItem>
            </Menu>

            {/* Окно доступа */}
            <AccessWindow
                open={isAccessWindowOpen}
                onClose={() => setIsAccessWindowOpen(false)}
                users={users}
                file={selectedFile}
                onGrantAccess={handleGrantAccess}
            />
        </div>
    );
}

export default StorageForm;
