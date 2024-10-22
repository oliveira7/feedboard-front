import { Role } from "@/schema/user.model";

export const translateRole = (role: Role) => {
    switch (role) {
      case Role.STUDENT:
        return 'Estudante';
      case Role.TEACHER:
        return 'Professor';
      case Role.COORDINATOR:
        return 'Coordenador';
      default:
        return 'Desconhecido';
    }
  };