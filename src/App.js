import React, {useEffect} from "react";
import "./App.css";
import "antd/dist/antd.css";
import "./assets/bootstrap.min.css";
import "./assets/Montserrat.css";
import Header from "./components/Header";
import Main from "./containers/Main";
import {createMuiTheme, CssBaseline} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import CookieBanner from "./components/CookieBanner";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#007bff"
    },
    secondary: {
      main: "#aa288c"
    },
    success: {
      main: "#4caf50"
    }
  },
  typography: {
    fontFamily: "Montserrat",
    fontSize: 12
  }
});


function App() {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const cookies = JSON.parse(localStorage.getItem('cookies'));
    if (!cookies) {
      setOpen(true);
    }
  }, []);

  function toggleCookies() {
    setOpen(false);
    localStorage.setItem('cookies', 'true');
  }

  return (
    <div className="App">
      <CssBaseline/>
      <Header/>
      <ThemeProvider theme={theme}>
        <Main/>
      </ThemeProvider>
      {open ? <CookieBanner toggle={toggleCookies}/> : null}
    </div>
  );
}

export default App;
