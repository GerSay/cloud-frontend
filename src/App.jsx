import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HeaderForm from "./components/Header/HeaderForm.jsx";
import { Box } from "@mui/material";
import SignUpForm from "./pages/SignUpForm.jsx";
import SignInForm from "./pages/SignInForm.jsx";
import HomeForm from "./pages/HomeForm.jsx";
// import FilesForm from "./pages/FilesForm.jsx";
import { Helmet } from "react-helmet";
import StorageForm from "./components/FilesExplorer/StorageForm.jsx";
import './App.css'

function App() {
  return (
    <div className="App">
      <Helmet>
        <link rel="icon" type="image/png" sizes="32x32" href="../public/cloud.png" />
      </Helmet>
      <Router>
        <HeaderForm />
        <Box m={0}>
          <Routes>
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/signin" element={<SignInForm />} />
          </Routes>
        </Box>
        {/*<Box m={0}>*/}
          <Routes>
            <Route path="/files" element={<StorageForm />} />
            <Route path="/" element={<HomeForm />} />
          </Routes>
        {/*</Box>*/}
      </Router>
    </div>
  );
}

export default App;
