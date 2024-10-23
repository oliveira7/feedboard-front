import React from 'react'
import logo from '../../public/assets/logo.svg';
import { Role } from '@/schema/user.model';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { InputLabel, TextField, FormControl, Select, MenuItem, InputAdornment, IconButton, Button, CircularProgress, SelectChangeEvent } from '@mui/material';
import Image from 'next/image';

interface RegisterFormProps {
    handleRegister: (e: React.FormEvent) => void;
    setAuth: React.Dispatch<React.SetStateAction<{
        name: string;
        email: string;
        course: string;
        password: string;
        confirmPassword: string;
    }>>;
    auth: {
        name: string;
        email: string;
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
    role,
    handleChange,
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
                <div className="w-full flex justify-end items-center">
                    <Image src={logo} alt="logo" width={100} height={100} className='bg-gradient-to-br from-primary-light to-primary-dark rounded-full p-2'/>
                </div>
                <h2 className="text-3xl font-bold mb-2 text-center">Cadastro</h2>
                <div className="text-xs text-center pb-2">
                    Inscreva-se e participe do mundo acadêmico.
                </div>

                <form onSubmit={handleRegister}>
                    <div className="flex w-full justify-around">
                        <div className="mb-4 mt-4 w-2/5 ">
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
                        <div className="mb-4 mt-4 w-2/5 ">
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
                                    onChange={(event, child) => handleChange(event, child)}
                                >
                                    <MenuItem value={Role.STUDENT}>Estudante</MenuItem>
                                    <MenuItem value={Role.TEACHER}>Professor</MenuItem>
                                    <MenuItem value={Role.COORDINATOR}>Coordenador</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className="flex w-full justify-around items-center">
                        <div className="mb-4 mt-4  w-2/5">
                            <InputLabel className="block mb-2" htmlFor="password">Senha</InputLabel>
                            <TextField
                                id="password"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                fullWidth
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
                    <div className="flex justify-center mt-2">
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
