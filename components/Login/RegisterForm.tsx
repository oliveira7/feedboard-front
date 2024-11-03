import React from 'react';
import { Role } from '@/schema/user.model';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { InputLabel, TextField, InputAdornment, IconButton, Button, CircularProgress, SelectChangeEvent } from '@mui/material';

interface RegisterFormProps {
    handleRegister: (e: React.FormEvent) => void;
    setAuth: React.Dispatch<React.SetStateAction<{
        name: string;
        course: string;
        password: string;
        confirmPassword: string;
    }>>;
    auth: {
        name: string;
        course: string;
        password: string;
        confirmPassword: string;
    };
    role: Role;
    handleChange: (event: SelectChangeEvent<Role>, child: React.ReactNode) => void;
    loading: boolean;
    showPassword: boolean;
    showConfirmPassword: boolean;
    handleClickShowPassword: () => void;
    handleClickShowConfirmPassword: () => void;
    handleMouseDownPassword: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function RegisterForm({
    handleRegister,
    setAuth,
    auth,
    loading,
    showPassword,
    showConfirmPassword,
    handleClickShowPassword,
    handleClickShowConfirmPassword,
    handleMouseDownPassword
}: RegisterFormProps) {
    return (
        <div className="flex flex-col justify-center items-center w-full min-h-screen bg-gradient-to-br from-primary-light to-primary-dark p-4">
            <div className="bg-primary-50 p-6 md:p-10 rounded-lg shadow-2xl w-full max-w-md md:max-w-lg">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Cadastro</h2>
                <div className="text-xs text-center pb-2">
                    Inscreva-se e participe do nosso mundo acadêmico.
                </div>

                <form onSubmit={handleRegister}>
                    <div className="flex flex-col md:flex-row w-full md:justify-around">
                        <div className="mb-4 mt-4 md:w-2/5 w-full">
                            <InputLabel className="block mb-2" htmlFor="name">Nome</InputLabel>
                            <TextField
                                id="name"
                                type="text"
                                variant="outlined"
                                placeholder="Digite seu nome"
                                fullWidth
                                value={auth.name}
                                className="mb-4"
                                onChange={(e) => setAuth({ ...auth, name: e.target.value })}
                            />
                        </div>

                        <div className="mb-4 mt-4 md:w-2/5 w-full">
                            <InputLabel className="block mb-2" htmlFor="course">Curso</InputLabel>
                            <TextField
                                id="course"
                                type="text"
                                variant="outlined"
                                placeholder="Digite seu curso"
                                fullWidth
                                value={auth.course}
                                className="mb-4"
                                onChange={(e) => setAuth({ ...auth, course: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row w-full md:justify-around items-center">
                        <div className="mb-4 mt-4 md:w-2/5 w-full">
                            <InputLabel className="block mb-2" htmlFor="password">Senha</InputLabel>
                            <TextField
                                id="password"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                fullWidth
                                placeholder="Digite sua senha"
                                value={auth.password}
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

                        <div className="mb-4 mt-4 md:w-2/5 w-full">
                            <InputLabel className="block mb-2" htmlFor="confirmPassword">Confirmar Senha</InputLabel>
                            <TextField
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                variant="outlined"
                                placeholder="Confirme sua senha"
                                fullWidth
                                value={auth.confirmPassword}
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

                    <div className="flex justify-center mt-6">
                        <Button
                            type="submit"
                            variant="contained"
                            className="w-full md:w-48 bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition"
                        >
                            {loading ? <CircularProgress size={25} color="secondary" /> : "Cadastrar"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
