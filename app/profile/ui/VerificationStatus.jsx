import React from 'react';
import { VerifiedCard } from './VerifiedCard';
import { PendingCard } from './PendingCard';
import UserForm from './UserForm';

export function VerificationStatus({ estadoRevisao }) {
  if (estadoRevisao === 'sim') {
    return <VerifiedCard />;
  }

  if (estadoRevisao === 'pendente') {
    return <PendingCard />;
  }

  // Renderiza um formulário para usuários que ainda precisam verificar o perfil
  return <UserForm />;
}
