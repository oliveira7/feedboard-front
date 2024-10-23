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
    // if (currentStep === 1) {
    //   handleSendToken(); 
    // }
    setCurrentStep(currentStep + 1);
  };

  return (
    <>
      <div className="w-1/2 bg-gradient-to-br from-primary-light to-primary-dark flex justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center">
          <Image src={logo} alt="logo" width={500} height={500} />
        </div>
      </div>

      <div className="w-1/2 bg-primary flex justify-center items-center relative">
        <div className="bg-primary-50 p-10 rounded-lg shadow-2xl w-full max-w-md absolute">
          <h2 className="text-3xl font-bold mb-6 text-center">
            {currentStep === 1 ? 'Recuperar Senha' : 'Redefinir Senha'}
          </h2>

          {currentStep === 1 && (
            <>
              <div className="text-xs text-center pb-4">
                Insira seu e-mail para receber o token de recuperação de senha.
              </div>

              {/* Step 1: Campo de Email */}
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
                disabled={!authPassword.email} // Desabilita o botão se o email estiver vazio
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

              {/* Step 2: Campo de Token */}
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

              {/* Step 2: Campo de Nova Senha */}
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

              {/* Step 2: Campo Confirmar Nova Senha */}
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
    </>
  );
}
