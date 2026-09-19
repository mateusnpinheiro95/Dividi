# Dividi

Projeto React moderno com boas práticas e design patterns, focado em mobile web.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **Tailwind CSS** - Framework CSS mobile-first
- **React Router** - Navegação entre páginas

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
│   ├── Button/
│   ├── Card/
│   └── index.ts    # Barrel export
├── pages/          # Páginas/telas da aplicação
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   └── index.ts
├── hooks/          # Custom hooks
│   ├── useLocalStorage.ts
│   └── index.ts
├── contexts/       # React contexts para estado global
├── layouts/        # Layouts reutilizáveis
│   └── MainLayout.tsx
├── utils/          # Funções utilitárias
│   └── index.ts
├── types/          # Tipos TypeScript
│   └── index.ts
├── constants/      # Constantes da aplicação
│   └── index.ts
├── assets/         # Imagens, ícones, etc
├── router.tsx      # Configuração de rotas
└── App.tsx         # Componente principal
```

## 🎨 Design Patterns Implementados

### 1. **Component Pattern**
Componentes pequenos, focados e reutilizáveis.

```tsx
<Button variant="primary" onClick={handleClick}>
  Clique aqui
</Button>
```

### 2. **Custom Hooks**
Lógica reutilizável encapsulada em hooks.

```tsx
const [value, setValue] = useLocalStorage('key', defaultValue);
```

### 3. **Barrel Exports**
Imports simplificados através de arquivos index.ts.

```tsx
import { Button, Card } from '@/components';
```

### 4. **Layout Pattern**
Layouts reutilizáveis para estrutura comum das páginas.

```tsx
<MainLayout>
  <YourPage />
</MainLayout>
```

### 5. **Path Aliases**
Imports absolutos usando `@/` ao invés de `../../`.

```tsx
import { Button } from '@/components';
import { ROUTES } from '@/constants';
```

## 🏃 Como Executar

### Desenvolvimento

```bash
npm run dev
```

Abre automaticamente em `http://localhost:3000`

### Build para Produção

```bash
npm run build
```

### Preview do Build

```bash
npm run preview
```

## 📱 Mobile-First

O projeto foi desenvolvido com foco em dispositivos móveis:

- Tailwind configurado com abordagem mobile-first
- Classes utilitárias para touch: `touch-manipulation`, `active:scale-95`
- Container responsivo: `container-mobile`
- Viewport otimizado para mobile

## 🎯 Boas Práticas

### TypeScript
- Tipos explícitos em interfaces
- Props tipadas em todos os componentes
- Type safety em todo o código

### Componentes
- Props interface sempre definida
- Valores default para props opcionais
- Componentes funcionais com arrow functions
- Documentação com JSDoc quando necessário

### Estilização
- Tailwind classes para consistência
- Classes customizadas em `@layer components`
- Mobile-first approach
- Estados interativos (`active:`, `hover:`)

### Organização
- Um componente por arquivo
- Barrel exports para imports limpos
- Estrutura de pastas clara e escalável
- Separação de concerns (lógica, apresentação, dados)

## 🔄 Próximos Passos

1. **Context API**: Adicionar contexts para estado global quando necessário
2. **Error Boundaries**: Implementar tratamento de erros
3. **Testes**: Adicionar testes unitários e de integração
4. **PWA**: Configurar como Progressive Web App
5. **Otimizações**: Code splitting, lazy loading

## 📚 Recursos Úteis

- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Docs](https://vite.dev/)
- [React Router](https://reactrouter.com/)

## 📝 Notas

- Sem integração com backend/APIs externas (conforme requisito)
- Dados persistem no localStorage quando necessário
- Totalmente funcional offline
