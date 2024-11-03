import { Visibility, VisibilityOff } from '@mui/icons-material';
import { InputLabel, TextField, InputAdornment, IconButton, Button, CircularProgress } from '@mui/material';
import Image from "next/image";
import logo from '../../public/assets/logo.svg';
import React from 'react';

interface LoginFormProps {
    handleLogin: (e: React.FormEvent) => void;
    setAuth: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
    auth: { email: string; password: string };
    loading: boolean;
    showPassword: boolean;
    handleClickShowPassword: () => void;
    handleMouseDownPassword: (e: React.MouseEvent<HTMLButtonElement>) => void;
    setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginForm({
    handleLogin,
    setAuth,
    auth,
    loading,
    showPassword,
    handleClickShowPassword,
    handleMouseDownPassword,
    setForgotPassword
}: LoginFormProps) {
    return (
        <div className="flex flex-col md:flex-row w-full h-screen">
            {/* Logo Section */}
            <div className="md:w-1/2 w-full bg-gradient-to-br from-primary-light to-primary-dark flex justify-center items-center p-4 md:p-0">
                <div className="w-full flex justify-center items-center">
                    <Image src={logo} alt="logo" width={200} height={200} className="md:w-[500px] md:h-[500px]" />
                </div>
            </div>

            {/* Login Form Section */}
            <div className="md:w-1/2 w-full bg-primary flex justify-center items-center p-4">
                <div className="bg-primary-50 p-6 md:p-10 rounded-lg shadow-2xl w-full max-w-md">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Entrar</h2>
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
                        <p className="font-medium pt-2 text-center" onClick={() => setForgotPassword(true)}>
                            <a href="#" className="text-highlight mt-4">Esqueceu sua senha?</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
