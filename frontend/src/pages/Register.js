import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import MuiLink from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import background from "../background.gif";
import CircularProgress from '@mui/material/CircularProgress';
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import axios from "axios";
import {useState, useEffect} from 'react';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Register() {
  const [registerError, setRegisterError] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleSubmit = (event) => {
    setRegisterError(false)
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setRegisterLoading(true)
    axios.get('http://localhost:8000/register/', { params: { username: data.get('username'), password: data.get('password') }})
    .then(res => {
      console.log(res.data)
      if (res.data.success) {
        setRegisterSuccess(true)
        setRegisterLoading(false)
      }
      else {
        setRegisterError(true)
      }
    })
  };

  if (registerSuccess) {
    return (<Navigate to="/login"/>)
  }
  else {
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
                  marginTop: 0,
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
                  Register
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
                  { registerError ? <Typography variant="subtitle1" sx={{
                    textAlign: "center", 
                    color: "red",
                    paddingTop: "5px"
                  }}
                  >A user with that username already exists. If you have an account, please try <Link to="/login" style={{ color: "red" }}>logging in</Link>.</Typography>
                  : registerLoading ? <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '15px'}}><CircularProgress color="primary" /></Box>
                  : <></>}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Register
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <MuiLink component={Link} to="/" variant="body2">
                        Back to home
                      </MuiLink>
                    </Grid>
                    <Grid item>
                      <MuiLink component={Link} to="/login" variant="body2">
                        {"Already have an account? Login"}
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
}
