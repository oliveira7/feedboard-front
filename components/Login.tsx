'use client';

import React, { useState } from "react";
import { Button, TextField, IconButton, InputAdornment, Snackbar, Alert, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "@/api/login-endpoint.service";
import { useRouter } from "next/navigation";
import logo from '../public/assets/logo.svg'
import Image from "next/image";
import Cookies from 'js-cookie';


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [auth, setAuth] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClickShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await login(auth.email, auth.password);
      console.log(response);
      if (response && response.access_token) {  
        Cookies.set('token', response.access_token, { expires: 7, secure: true }); 
        router.push("/home");
      } else {
        setErrorMessage("Usuário ou senha incorretos.");
        setOpenSnackbar(true);
      }
    } catch (e) {
      setErrorMessage("Usuário ou senha incorretos.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gradient-to-br from-primary-light to-primary-dark flex justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center">
          <Image src={logo} alt="logo" width={500} height={500} />
        </div>
      </div>

      <div className="w-1/2 bg-white flex justify-center items-center relative">
        <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md absolute">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Entrar</h2>
          <div className="text-gray-500 text-sm pb-4  ">
            Acompanhe as novidades do seu mundo profissional.
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4 mt-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <TextField
                id="email"
                type="email"
                variant="outlined"
                placeholder="Digite seu email"
                fullWidth
                className="mb-4"
                onChange={(e) => setAuth({ ...auth, email: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Senha
              </label>
              <TextField
                id="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                placeholder="Digite sua senha"
                fullWidth
                className="mb-4"
                onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition"
            >
              {loading ? <CircularProgress size={25} color="secondary" /> : "Entrar"}
            </Button>
            <p className="font-medium pt-2">
              <a href="#" className="text-primary mt-4">Esqueceu sua senha?</a>
            </p>
          </form>
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
