'use client';

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { login } from "@/api/login-endpoint.service";
import { register } from "@/api/user-endpoint.service";
import { Role } from "@/schema/user.model";
import LoginForm from "./Login/LoginForm";
import RegisterForm from "./Login/RegisterForm";
import ForgotPassword from "./Login/ForgotPassword";
import { useSnackbar } from "@/context/SnackBarContext";
import { SelectChangeEvent } from "@mui/material";
interface LoginProps {
  token?: string;
}

const LoginPage = ({ token }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [auth, setAuth] = useState({
    email: '',
    password: '',
  });
  const [registerAuth,] = useState({ 
    password: '',
    name: '',
    course: '',
    confirmPassword: ''
  });
  const [, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [role, setRole] = useState<Role | null>(null);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [authPassword, setAuthPassword] = useState({ 
    token:'',
    email: '', 
    newPassword: '', 
    confirmPassword: ''
  });
  const { showError } = useSnackbar();

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
        router.push("/privado/home");
      } else {
        showError("Usuário ou senha incorretos.");
      }
    } catch (e: unknown) {
      if (e instanceof Error) { 
        showError(e.message || "Erro ao realizar o login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<Element>): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (registerAuth.password !== registerAuth.confirmPassword) {
      showError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    console.log(token);

    try {
      const registerObj = {
        name: registerAuth.name,
        course: registerAuth.course,
        password: registerAuth.password,
        token: token
      }
      const response = await register(registerObj);
      if (response) {
        await login(auth.email, auth.password);
        router.push("/privado/home");
      } else {
        showError("Erro ao realizar o cadastro.");
      }
    } catch (e: unknown) {
      if (e instanceof Error) { 
        showError(e.message || "Erro ao realizar o cadastro.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendToken = async () => { 
    setErrorMessage("");
    setLoading(true);
    try {
        setForgotPassword(false);
        showError("Token enviado com sucesso.");
      } catch (e: unknown) {
        if (e instanceof Error) { 
          showError(e.message || "Erro ao enviar o token.");
        }
    } finally {
      setLoading(false)
  }
}


  return (
    <div className="flex h-screen">
      {!path.includes('cadastro') && !forgotPassword && (
        <LoginForm 
        handleLogin={handleLogin} 
        setAuth={setAuth} 
        auth={auth} 
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
        handleMouseDownPassword={handleMouseDownPassword} 
        authPassword={authPassword} 
        handleSendToken={handleSendToken}
        setAuthPassword={setAuthPassword}/>
      )}

      {path.includes('cadastro') && (
        <RegisterForm
        handleRegister={handleRegister}
        setAuth={(auth) => setAuth((prevAuth) => ({ ...prevAuth, ...auth }))}
        auth={registerAuth}
        role={role as Role}
        handleChange={handleChange}
        loading={loading}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        handleClickShowPassword={handleClickShowPassword}
        handleClickShowConfirmPassword={handleClickShowConfirmPassword}
        handleMouseDownPassword={handleMouseDownPassword}
      />      
      )}
    </div>
  );
};

export default LoginPage;
