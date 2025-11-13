import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiBox, 
  FiClipboard, 
  FiMessageSquare,
  FiFileText,
  FiBarChart2,
  FiCreditCard,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';

export const sidebarMenuItems = [
  {
    icon: FiHome,
    label: 'Pagina Inicial',
    route: '/'
  },
  {
    icon: RiRobot2Line,
    label: 'assistente SkAI',
    route: '/skai'
  },
  {
    icon: FiUsers,
    label: 'Nhongistas e Lojas',
    route: '/nhonguistas'
  },
  {
    icon: FiBox,
    label: 'Meus Produtos',
    route: '/produtos'
  },
  {
    icon: FiClipboard,
    label: 'Pedidos',
    route: '/pedidos',
    badge: 3
  },
  {
    icon: FiMessageSquare,
    label: 'Meus Anucios',
    route: '/ads'
  },
  {
    icon: FiFileText,
    label: 'Publicacoes',
    route: '/posts',
    highlight: true
  },
  {
    icon: FiBarChart2,
    label: 'Visão geral',
    route: '/overview'
  },
  {
    icon: FiCreditCard,
    label: 'SkyWallet',
    route: '/wallet',
    highlight: true
  },
  {
    icon: FiSettings,
    label: 'Configurações',
    route: '/settings'
  },
  {
    icon: FiLogOut,
    label: 'Sair',
    route: '/logout',
    className: 'text-red-500'
  }
];
