import {Box, Button, Typography} from "@mui/material";
import "../components/HomeForm.css"

const Home = () => {
    return (
        <Box className="home-page">
            <form className="home-form">
                <div className="home-header">
                    <Typography variant="h2">Начало работы</Typography>
                </div>
                <div className="home-body">
                    <Button
                        variant="outlined"
                        href="http://localhost:8080/openapi/swagger-ui/index.html"
                        target="_blank"
                        className="home-link-button"
                    >
                        Swagger UI
                    </Button>
                    <Button
                        variant="outlined"
                        href="http://localhost:9000"
                        target="_blank"
                        className="home-link-button"
                    >
                        Minio S3 SERVER
                    </Button>
                    <Button
                        variant="outlined"
                        href="http://localhost:9001"
                        target="_blank"
                        className="home-link-button"
                    >
                        Minio S3 CLIENT
                    </Button>
                    <Button
                        variant="outlined"
                        href="http://localhost:5432/storage"
                        target="_blank"
                        className="home-link-button"
                    >
                        PostreSQL
                    </Button>
                </div>
            </form>
        </Box>
    );
};

export default Home;