import {useEffect, useState} from "react";
import {Box, Typography} from "@mui/material";
import {FaFile} from "react-icons/fa";
import "../components/FilesForm.css"

const Files = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0});
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleDragEnter = (e) => {
        e.preventDefault();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles(files);

        const formData = new FormData();
        formData.append('data', files[0]);

        try {
            const response = await fetch('http://localhost:8080/api/files', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Файлы успешно загружены');
            fetchFiles();
        } catch (err) {
            console.error('Error during file upload:', err);
            setError('Ошибка при загрузке файлов');
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users/user/objects', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 403) {
                window.location.href = '/signin';
            } else if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setFiles(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        setShowContextMenu(true);
        setContextMenuPosition({
            x: e.pageX,
            y: e.pageY
        });
    };

    const handleCloseContextMenu = () => {
        setShowContextMenu(false);
    };

    const handleDownload = async (file) => {
        try {
            const response = await fetch(`http://localhost:8080/api/files/data/${file.id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'blob'
            });

            if (response.status === 403) {
                window.location.href = '/signin';
            } else if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let arrayBuffer = await response.arrayBuffer();
            const blob = new Blob([arrayBuffer], {type: 'application/octet-stream'});

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log(`Файл загружен успешно. Размер: ${blob.size} байт`);
        } catch (err) {
            console.error('Error during file download:', err);
            setError('Ошибка при скачивании файла');
        }
    };

    const renderFileItem = (file) => (
        <div className="file-item" onContextMenu={handleContextMenu}>
            <FaFile size={24} style={{marginRight: '10px'}}/>
            <span>{file.name}</span>
            <button onClick={() => handleDownload(file)}>Скачать</button>
        </div>
    );

    return (
        <Box className="files-page">
            <form className="files-form">
                <Typography variant="h2" gutterBottom className="files-header">Твое облако</Typography>
                <div className="files-upload">
                    <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf,.docx,.xlsx,.pptx"
                        onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                    />
                    <button onClick={handleDrop}>Загрузить</button>
                </div>
                <div className="files-group">
                    {files.length > 0 ? (
                        files.map(renderFileItem)
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <Typography>Loading...</Typography>
                    )}
                </div>
                {showContextMenu && (
                    <div className="files-context-menu">
                        <ul>
                            <li onClick={() => handleDownload(files.find(f => f.name === contextMenuPosition.file))}>Скачать</li>
                            <li onClick={handleCloseContextMenu}>Открыть</li>
                            <li onClick={handleCloseContextMenu}>Удалить</li>
                        </ul>
                    </div>
                )}
            </form>
        </Box>
    );
};

export default Files;