'use client';

import React, { useState } from "react";
import { Button, TextField, IconButton, InputAdornment, Snackbar, Alert, CircularProgress, InputLabel, MenuItem, Select, FormHelperText, FormControl, SelectChangeEvent } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import logo from '../public/assets/logo.svg';
import Image from "next/image";
import Cookies from 'js-cookie';
import { login } from "@/api/login-endpoint.service";
import { register } from "@/api/user-endpoint.service";
import { Role } from "@/schema/user.model";

const LoginPage = () => {
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

  const handleChange = (event: SelectChangeEvent<Role>) => {
    setRole(event.target.value as Role);
  };

  const handleClickShowPassword = () => setShowPassword((prevState) => !prevState);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prevState) => !prevState);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    // Verifica se as senhas correspondem
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
        role: role
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
      <div className="w-1/2 bg-gradient-to-br from-primary-light to-primary-dark flex justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center">
          <Image src={logo} alt="logo" width={500} height={500} />
        </div>
      </div>

      {!path.includes('cadastro') && (
        <div className="w-1/2 bg-primary flex justify-center items-center relative">
          <div className="bg-primary-50 p-10 rounded-lg shadow-2xl w-full max-w-md absolute">
            <h2 className="text-3xl font-bold mb-6 text-center">Entrar</h2>
            <div className="text-xs text-center pb-4">
              Acompanhe as novidades do seu mundo acadêmico.
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4 mt-4">
                <InputLabel className="block mb-2" htmlFor="email">Email</InputLabel>
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
                <InputLabel className="block mb-2" htmlFor="password">Senha</InputLabel>
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
                <a href="#" className="text-highlight mt-4">Esqueceu sua senha?</a>
              </p>
            </form>
          </div>
        </div>
      )}

      {path.includes('cadastro') && (
        <div className="w-full bg-primary flex justify-center items-center">
          <div className="bg-primary-50 p-10 rounded-lg shadow-2xl w-full max-w-fit absolute">
            <h2 className="text-3xl font-bold mb-6 text-center">Cadastro</h2>
            <div className="text-xs text-center pb-4">
              Inscreva-se e participe do mundo acadêmico.
            </div>

            <form onSubmit={handleRegister}>
              <div className="flex w-full justify-around">
                <div className="mb-4 mt-4">
                  <InputLabel className="block mb-2" htmlFor="name">Nome</InputLabel>
                  <TextField
                    id="name"
                    type="text"
                    variant="outlined"
                    placeholder="Digite seu nome"
                    fullWidth
                    className="mb-4"
                    onChange={(e) => setAuth({ ...auth, name: e.target.value })}
                  />
                </div>
                <div className="mb-4 mt-4">
                  <InputLabel className="block mb-2" htmlFor="email">Email</InputLabel>
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
              </div>

              <div className="flex w-full justify-around items-center">
                <div className="w-2/5 mb-4 mt-4">
                  <InputLabel className="block mb-2" htmlFor="course">Curso</InputLabel>
                  <TextField
                    id="course"
                    type="text"
                    variant="outlined"
                    placeholder="Digite seu curso"
                    fullWidth
                    className="mb-4"
                    onChange={(e) => setAuth({ ...auth, course: e.target.value })}
                  />
                </div>

                <div className="w-2/5 mt-6">
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="role-label">Selecione o cargo</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role-select"
                      label="Selecione o cargo"
                      value={role}
                      onChange={handleChange}
                    >
                      <MenuItem value={Role.STUDENT}>Estudante</MenuItem>
                      <MenuItem value={Role.TEACHER}>Professor</MenuItem>
                      <MenuItem value={Role.COORDINATOR}>Coordenador</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="flex w-full justify-around items-center">
                <div className="mb-4 mt-4 w-2/5">
                  <InputLabel className="block mb-2" htmlFor="password">Senha</InputLabel>
                  <TextField
                    id="password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    placeholder="Digite sua senha"
                    className="mb-4"
                    onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
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

                <div className="mb-4 mt-4 w-2/5">
                  <InputLabel className="block mb-2" htmlFor="confirmPassword">Confirmar Senha</InputLabel>
                  <TextField
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    variant="outlined"
                    placeholder="Confirme sua senha"
                    fullWidth
                    className="mb-4"
                    onChange={(e) => setAuth({ ...auth, confirmPassword: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition"
              >
                {loading ? <CircularProgress size={25} color="secondary" /> : "Cadastrar"}
              </Button>
            </form>
          </div>
        </div>
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
