import { Box, Container, Typography } from '@mui/material';
import "../components/FooterForm.css"

const FooterForm = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box component="footer" className={'footer'}>
            <Container maxWidth="lg" className={'footer-form'}>
                <Typography variant="body2" align="center" className={'footer-text'}>
                    © {currentYear} Your Company Name. All rights reserved.
                </Typography>

                <Box mt={2}>
                    <Typography variant="caption" display="block" gutterBottom>
                        Made with love by Your Name
                    </Typography>
                </Box>

                <Box display="flex" justifyContent="center" gap={2}>
                    <Typography variant="caption">Terms of Service</Typography>
                    <Typography variant="caption">Privacy Policy</Typography>
                    <Typography variant="caption">Contact Us</Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default FooterForm;