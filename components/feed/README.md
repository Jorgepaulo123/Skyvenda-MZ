# Componentes de Feed - SkyVenda MZ

Este diretório contém os componentes de feed responsivos para a aplicação SkyVenda MZ, com estilos adaptados para mobile (estilo rede social) e desktop (estilo Instagram).

## 📱 Componentes Disponíveis

### 1. **AdaptiveFeed** (Recomendado)
Componente principal que detecta automaticamente o tamanho da tela e renderiza o feed apropriado.

```jsx
import AdaptiveFeed from './components/feed/AdaptiveFeed';

<AdaptiveFeed />
```

**Características:**
- ✅ Detecção automática de mobile/desktop
- ✅ Mobile: Estilo rede social (Instagram-like)
- ✅ Desktop: Estilo Instagram com cards grandes
- ✅ Responsivo e otimizado

### 2. **MobileFeed**
Feed otimizado para dispositivos móveis com estilo de rede social.

```jsx
import MobileFeed from './components/feed/MobileFeed';

<MobileFeed />
```

**Características:**
- 📱 Layout vertical em lista
- 📱 Cards com largura total
- 📱 Navegação por gestos
- 📱 Otimizado para touch

### 3. **DesktopFeed**
Feed otimizado para desktop com estilo Instagram.

```jsx
import DesktopFeed from './components/feed/DesktopFeed';

<DesktopFeed />
```

**Características:**
- 💻 Layout centralizado (614px)
- 💻 Cards grandes e quadrados
- 💻 Navegação por mouse
- 💻 Modo claro otimizado

### 4. **ResponsiveFeed**
Feed responsivo que se adapta a diferentes tamanhos de tela.

```jsx
import ResponsiveFeed from './components/feed/ResponsiveFeed';

<ResponsiveFeed />
```

## 🎨 Estilos CSS

### Mobile Styles (`feed-mobile.css`)
- Animações suaves
- Feedback visual
- Suporte a dark mode
- Acessibilidade

### Desktop Styles (`feed-desktop.css`)
- Layout estilo Instagram
- Cards grandes
- Modo claro otimizado
- Transições suaves

## 📦 Cards de Conteúdo

### ProductCard
- **Mobile**: `ProductCard.jsx` - Layout vertical
- **Desktop**: `ProductCardDesktop.jsx` - Layout quadrado

### PostCard
- **Mobile**: `PostCard.jsx` - Layout vertical
- **Desktop**: `PostCardDesktop.jsx` - Layout quadrado

## 🔧 Configuração

### Breakpoints
- **Mobile**: < 768px
- **Desktop**: ≥ 768px

### Recursos
- ✅ Infinite scroll
- ✅ Pull-to-refresh
- ✅ Loading states
- ✅ Error handling
- ✅ Empty states
- ✅ Dark mode support
- ✅ Accessibility support

## 🚀 Como Usar

### 1. Importar o componente
```jsx
import AdaptiveFeed from './components/feed/AdaptiveFeed';
```

### 2. Usar no componente
```jsx
function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdaptiveFeed />
    </div>
  );
}
```

### 3. Personalizar (opcional)
```jsx
// Para usar apenas mobile
import MobileFeed from './components/feed/MobileFeed';

// Para usar apenas desktop
import DesktopFeed from './components/feed/DesktopFeed';
```

## 📱 Mobile Features

- **Layout**: Lista vertical com largura total
- **Cards**: Altos e estreitos
- **Navegação**: Gestos e touch
- **Performance**: Otimizada para mobile
- **UX**: Similar ao Instagram mobile

## 💻 Desktop Features

- **Layout**: Centralizado (614px)
- **Cards**: Quadrados grandes
- **Navegação**: Mouse e teclado
- **Performance**: Otimizada para desktop
- **UX**: Similar ao Instagram desktop

## 🎯 Benefícios

1. **Responsivo**: Adapta-se automaticamente ao dispositivo
2. **Performance**: Otimizado para cada plataforma
3. **UX**: Interface familiar para usuários
4. **Manutenível**: Código organizado e modular
5. **Acessível**: Suporte completo a acessibilidade

## 🔄 Atualizações

- **v1.0**: Implementação inicial
- **v1.1**: Adicionado suporte a dark mode
- **v1.2**: Melhorias de acessibilidade
- **v1.3**: Otimizações de performance

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com a equipe de desenvolvimento.