'use client';

import React, { useState } from "react";
import { Snackbar, Alert, SelectChangeEvent } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { login } from "@/api/login-endpoint.service";
import { register } from "@/api/user-endpoint.service";
import { Role } from "@/schema/user.model";
import LoginForm from "./Login/LoginForm";
import RegisterForm from "./Login/RegisterForm";
import ForgotPassword from "./Login/ForgotPassword";
interface LoginProps {
  token?: string;
}

const LoginPage = ({ token }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [auth, setAuth] = useState({
    email: '',
    password: '',
    name: '',
    course: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [role, setRole] = useState<Role | ''>('');
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [authPassword, setAuthPassword] = useState({ 
    token:'',
    email: '', 
    newPassword: '', 
    confirmPassword: ''
  });

  const handleChange = (event: SelectChangeEvent<Role>) => {
    setRole(event.target.value as Role);
  };

  const handleClickShowPassword = () => setShowPassword((prevState) => !prevState);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prevState) => !prevState);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await login(auth.email, auth.password);
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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (auth.password !== auth.confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      const registerObj = {
        name: auth.name,
        email: auth.email,
        course: auth.course,
        password_hash: auth.password,
        role: role,
        token: token
      }
      const response = await register(registerObj);
      if (response) {
        await login(auth.email, auth.password);
        router.push("/home");
      } else {
        setErrorMessage("Erro ao realizar o cadastro.");
        setOpenSnackbar(true);
      }
    } catch (e) {
      setErrorMessage("Erro ao realizar o cadastro.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <div className="flex h-screen">
      {!path.includes('cadastro') && !forgotPassword && (
        <LoginForm 
        handleLogin={handleLogin} 
        setAuth={setAuth} auth={auth} 
        loading={loading} 
        showPassword={showPassword} 
        handleClickShowPassword={handleClickShowPassword}
        handleMouseDownPassword={handleMouseDownPassword} 
        setForgotPassword={setForgotPassword}/>
      )}

      {!path.includes('cadastro') && forgotPassword && ( 
        <ForgotPassword 
        loading={loading} 
        showPassword={showPassword} 
        handleClickShowPassword={handleClickShowPassword} 
        handleMouseDownPassword={handleMouseDownPassword} authPassword={authPassword} setAuthPassword={setAuthPassword}/>
      )}

      {path.includes('cadastro') && (
        <RegisterForm
        handleRegister={handleRegister}
        setAuth={setAuth}
        auth={auth}
        role={role}
        handleChange={handleChange}
        loading={loading}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        handleClickShowPassword={handleClickShowPassword}
        handleClickShowConfirmPassword={handleClickShowConfirmPassword}
        handleMouseDownPassword={handleMouseDownPassword}
      />      
      )}

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
