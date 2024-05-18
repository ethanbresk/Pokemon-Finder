import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MuiLink from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import background from "../background.gif";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import axios from "axios";
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {

  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    setAuthError(false)
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    axios.get('http://localhost:8000/login/', { params: { username: data.get('username'), password: data.get('password') }})
    .then(res => {
      if (res.data.success) {
        localStorage.setItem('user', res.data.username)
        localStorage.setItem('token', res.data.token)
        navigate('/')
      }
      else {
        setAuthError(true)
      }
    })
  };

  return (
    <div className="App" style={{ 
      backgroundImage: `url(${background})`,
      //backgroundPosition: 'center',
      backgroundSize: 'cover',  
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100vw'
    }}>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: '100vh' }}
        >
        <Grid item>
          <Box
            sx={{
              paddingTop: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              padding: '20px',
              borderRadius: '10px',
            }}
          >
            {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar> */}
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                inputProps={{ maxLength: 16 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                inputProps={{ maxLength: 16 }}
              />
              { authError ? <Typography variant="subtitle1" sx={{
                textAlign: "center", 
                color: "red",
                paddingTop: "5px"
              }}
                >Username and password combination do not exist. Please try again.</Typography> : <></>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Grid container>
                <Grid item xs>
                  <MuiLink component={Link} to="/" variant="body2">
                    Back to home
                  </MuiLink>
                </Grid>
                <Grid item>
                  <MuiLink component={Link} to="/register" variant="body2">
                    {"Don't have an account? Register"}
                  </MuiLink>
                </Grid>
              </Grid>
            </Box>
          </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
    </div>
  );
}
