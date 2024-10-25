import React from 'react'
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
        <div className="w-full flex justify-center items-center bg-gradient-to-br from-primary-light to-primary-dark ">
            <div className="bg-primary-50 p-10 rounded-lg shadow-2xl w-full max-w-screen-lg absolute">
                <h2 className="text-3xl font-bold mb-2 text-center">Cadastro</h2>
                <div className="text-xs text-center pb-2">
                    Inscreva-se e participe do nosso mundo acadêmico.
                </div>

                <form onSubmit={handleRegister}>
                    <div className="flex w-full justify-around">
                        <div className="mb-4 mt-4 w-2/5">
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

                        <div className="w-2/5 mb-4 mt-4">
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

                    <div className="flex w-full justify-around items-center">
                        <div className="mb-4 mt-4 w-2/5">
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

                        <div className="mb-4 mt-4 w-2/5">
                            <InputLabel className="block mb-2" htmlFor="confirmPassword">Confirmar Senha</InputLabel>
                            <TextField
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                variant="outlined"
                                placeholder="Confirme sua senha"
                                fullWidth
                                value={auth.confirmPassword} // Certifique-se de que o valor está sendo mostrado
                                className="mb-4"
                                onChange={(e) => setAuth({ ...auth, confirmPassword: e.target.value })} // Atualizando o estado correto
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
                            className="w-48 mx-auto bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition "
                        >
                            {loading ? <CircularProgress size={25} color="secondary" /> : "Cadastrar"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>)
}
