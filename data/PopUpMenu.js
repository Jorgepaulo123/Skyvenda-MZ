import { FiUser, FiGrid, FiEdit3, FiSettings, FiHelpCircle, FiLogOut } from 'react-icons/fi';

export const profileMenuItems = [
    {
        icon: FiUser,
        label: 'Perfil',
        description: 'Ver e editar seu perfil',
        route: '/profile' // Propriedade route
    },
    {
        icon: FiGrid,
        label: 'Dashboard',
        description: 'Acessar painel de controle',
        route: '/dash' // Propriedade route
    },
    {
        icon: FiEdit3,
        label: 'Editar Perfil',
        description: 'Atualizar suas informações',
        route: '/profile/edit' // Propriedade route
    },
    {
        icon: FiSettings,
        label: 'Definições',
        description: 'Gerenciar preferências',
        route: '/settings' // Propriedade route
    },
    {
        icon: FiHelpCircle,
        label: 'Ajuda',
        description: 'Suporte e FAQ',
        route: '/help' // Propriedade route
    },
    {
        icon: FiLogOut,
        label: 'Terminar Sessão',
        description: 'Sair da sua conta',
        route: '' // Propriedade route
    }
];
