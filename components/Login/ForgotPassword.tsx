import { Visibility, VisibilityOff } from '@mui/icons-material';
import { InputLabel, TextField, InputAdornment, IconButton, Button, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import Image from "next/image";
import logo from '../../public/assets/logo.svg';

interface ForgotPasswordProps {
  handleSendToken: () => void;
  setAuthPassword: React.Dispatch<React.SetStateAction<{ email: string; token: string; newPassword: string; confirmPassword: string }>>;
  authPassword: { email: string; token: string; newPassword: string; confirmPassword: string };
  loading: boolean;
  showPassword: boolean;
  handleClickShowPassword: () => void;
  handleMouseDownPassword: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ForgotPassword({
  handleSendToken,
  setAuthPassword,
  authPassword,
  loading,
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword
}: ForgotPasswordProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    console.log(handleSendToken());
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Logo Section */}
      <div className="md:w-1/2 w-full bg-gradient-to-br from-primary-light to-primary-dark flex justify-center items-center p-4 md:p-0">
        <div className="w-full flex justify-center items-center">
          <Image src={logo} alt="logo" width={200} height={200} className="md:w-[500px] md:h-[500px]" />
        </div>
      </div>

      {/* Form Section */}
      <div className="md:w-1/2 w-full bg-primary flex justify-center items-center p-4">
        <div className="bg-primary-50 p-6 md:p-10 rounded-lg shadow-2xl w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
            {currentStep === 1 ? 'Recuperar Senha' : 'Redefinir Senha'}
          </h2>

          {currentStep === 1 && (
            <>
              <div className="text-xs text-center pb-4">
                Insira seu e-mail para receber o token de recuperação de senha.
              </div>

              <div className="mb-4">
                <InputLabel className="block mb-2" htmlFor="email">Email</InputLabel>
                <TextField
                  id="email"
                  type="email"
                  variant="outlined"
                  placeholder="Digite seu email"
                  fullWidth
                  className="mb-4"
                  onChange={(e) => setAuthPassword({ ...authPassword, email: e.target.value })}
                />
              </div>

              <Button
                onClick={handleNextStep}
                variant="contained"
                fullWidth
                className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition mb-6"
                disabled={!authPassword.email} 
              >
                {loading ? <CircularProgress size={25} color="secondary" /> : "Enviar Token por Email"}
              </Button>
            </>
          )}

          {currentStep === 2 && (
            <form>
              <div className="text-xs text-center pb-4">
                Digite o token que você recebeu no email e crie uma nova senha.
              </div>

              <div className="mb-4">
                <InputLabel className="block mb-2" htmlFor="token">Token</InputLabel>
                <TextField
                  id="token"
                  type="text"
                  variant="outlined"
                  placeholder="Digite o token"
                  fullWidth
                  className="mb-4"
                  onChange={(e) => setAuthPassword({ ...authPassword, token: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <InputLabel className="block mb-2" htmlFor="newPassword">Nova Senha</InputLabel>
                <TextField
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  placeholder="Digite sua nova senha"
                  fullWidth
                  className="mb-4"
                  onChange={(e) => setAuthPassword({ ...authPassword, newPassword: e.target.value })}
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

              <div className="mb-6">
                <InputLabel className="block mb-2" htmlFor="confirmPassword">Confirmar Nova Senha</InputLabel>
                <TextField
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  placeholder="Confirme sua nova senha"
                  fullWidth
                  className="mb-4"
                  onChange={(e) => setAuthPassword({ ...authPassword, confirmPassword: e.target.value })}
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
                disabled={!authPassword.token || !authPassword.newPassword || !authPassword.confirmPassword}
              >
                {loading ? <CircularProgress size={25} color="secondary" /> : "Redefinir Senha"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
