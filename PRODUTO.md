# Dividi — Especificação do Produto

**Versão:** 1.0  
**Última atualização:** 19/09/2026

---

## Visão Geral

Aplicação web mobile-first para **dividir conta de restaurante**.

### Características principais:
- ✅ Sem necessidade de autenticação
- ✅ Funcionamento 100% offline (localStorage)
- ✅ Interface otimizada para mobile
- ✅ Fluxo linear em 4 etapas

---

## Fluxo de Uso (4 Telas)

### 1️⃣ PEDIDOS — Criação da Comanda

**Objetivo:** Adicionar itens da conta e seus respectivos valores.

**Elementos:**
- Header: "Comanda" + identificador "Mesa 01"
- Botão "Adicionar" para novos pedidos
- Lista de pedidos:
  - Quantidade (ex: 2x, 1x)
  - Nome do item (ex: Água sem gás, Refrigerante)
  - Valor unitário (ex: R$ 10,00)
  - Ícone de remover (lixeira)
- **Total da comanda** exibido no rodapé
- Botão "Próximo" para avançar

**Regras:**
- Comanda vazia não pode avançar
- Valores sempre em formato BRL (R$)

---

### 2️⃣ PESSOAS — Atribuição de Consumidores

**Objetivo:** Adicionar pessoas e definir quem consumiu cada item.

**Elementos:**
- Header: "Pessoas" + "Mesa 01"
- Botão "Adicionar" para novas pessoas
- Lista de pessoas (chips/avatares coloridos):
  - Ana (azul), Bruno (roxo), Carlos (verde), Juliana (laranja), etc.
- **Divisão dos pedidos:**
  - Cards expandíveis por item (ex: "Água sem gás (2x) - R$ 10,00")
  - Avatares das pessoas que consomem aquele item
  - Botão "+" para adicionar mais pessoas ao item

**Regras:**
- Cada pedido deve ter **pelo menos 1 pessoa** atribuída
- Uma pessoa pode estar em múltiplos pedidos
- Cores dos avatares são fixas por pessoa

---

### 3️⃣ GORJETA — Configuração

**Objetivo:** Escolher tipo de gorjeta e quem vai participar.

**Elementos:**
- Header: "Gorjeta" + "Mesa 01"
- **Tipo de gorjeta:**
  - ⚪ **Percentual** (padrão, 10% editável)
  - ⚪ Valor fixo (usuário define)
- Controles de ajuste:
  - Botões `-` e `+` para incrementar/decrementar
  - Input central editável
- **Quem vai participar:**
  - Lista de todas as pessoas da mesa
  - Toggle/checkbox por pessoa
  - Estado padrão: **todos participando**
  - Label "Participando" quando ativo

**Regras:**
- Padrão: gorjeta percentual de 10%
- Todos participam por padrão (opt-out)
- Mínimo de 1 pessoa participando se gorjeta ativa

---

### 4️⃣ RESUMO — Valor Final por Pessoa

**Objetivo:** Exibir quanto cada pessoa deve pagar.

**Elementos:**
- Header: "Resumo" + "Mesa 01"
- **Total da comanda** (sem gorjeta)
- **Gorjeta** calculada
- **Total com gorjeta** (destaque)
- **Resumo por pessoa:**
  - Avatar colorido
  - Nome
  - Valor individual
- Botões:
  - 🔗 "Compartilhar resumo"
  - 🔄 "Novo cálculo" (reinicia fluxo)

**Regras:**
- Valores divididos proporcionalmente aos itens consumidos
- Gorjeta dividida igualmente entre participantes (ou proporcional, se aplicável)

---

## Design System

### 🎨 Paleta de Cores

#### Cores Primárias
| Cor | Hex | Uso |
|-----|-----|-----|
| **Primary 600** | `#2563EB` | Botões primários, texto ativo, highlights |
| **Primary 500** | `#3B82F6` | Hover states |
| **Primary 100** | `#DBEAFE` | Backgrounds leves |
| **Primary 50** | `#EFF6FF` | Backgrounds muito leves |

#### Cores Secundárias
| Cor | Hex | Uso |
|-----|-----|-----|
| **Verde** | `#16A34A` (Success 600) | Confirmações, sucesso |
| **Laranja** | `#FB923C` (Warning 400) | Alertas, atenção |
| **Vermelho** | `#DC2626` (Error 600) | Erros, remover |

#### Cores Neutras
| Cor | Hex | Uso |
|-----|-----|-----|
| **Gray 900** | `#111827` | Texto principal |
| **Gray 600** | `#4B5563` | Texto secundário |
| **Gray 400** | `#9CA3AF` | Texto desabilitado |
| **Gray 200** | `#E5E7EB` | Bordas |
| **Gray 100** | `#F3F4F6` | Backgrounds |
| **Gray 50** | `#F9FAFB` | Backgrounds leves |

#### Cores para Avatares (fixas por pessoa)
| Pessoa | Cor | Hex |
|--------|-----|-----|
| Ana | Azul | `#3B82F6` |
| Bruno | Roxo | `#A855F7` |
| Carlos | Verde | `#10B981` |
| Juliana | Laranja | `#F59E0B` |
| Rosa | Rosa | `#EC4899` |
| Ciano | Ciano | `#06B6D4` |

---

### 📝 Tipografia

**Fonte:** Inter (Google Fonts)

| Estilo | Tamanho | Peso | Altura de linha | Uso |
|--------|---------|------|-----------------|-----|
| **Display / Títulos** | 28px | 700 | 34px | Títulos principais |
| **Título de tela** | 20px | 600 | 28px | Headers de páginas |
| **Corpo de texto** | 18px | 400 | 28px | Texto principal |
| **Texto principal** | 16px | 400 | 24px | Corpo de texto |
| **Texto médio** | 14px | 500 | 20px | Itens, nomes |
| **Labels** | 13px | 400 | 18px | Campos, labels |
| **Legenda** | 12px | 400 | 16px | Textos auxiliares |
| **Botões** | 15px | 600 | 20px | Texto de botões |
| **Valores/Moedas** | 16px | 800 | 24px | Preços, valores |

---

### 🔘 Componentes

#### Botões

**Primário:**
- Background: `#2563EB` (Primary 600)
- Texto: Branco (#FFFFFF)
- Padding: 12px 24px
- Border-radius: 8px
- Estado ativo: `#1D4ED8`

**Secundário:**
- Background: Transparente
- Texto: `#2563EB`
- Border: 1px solid `#2563EB`
- Padding: 12px 24px
- Border-radius: 8px

**Ícone (Bottom Nav):**
- Size: 44px × 44px
- Background: `#EFF6FF` (inativo) / `#2563EB` (ativo)
- Ícone: `#6B7280` (inativo) / `#FFFFFF` (ativo)

---

#### Cards e Listas

**Card de pedido:**
- Background: Branco
- Border: 1px solid `#E5E7EB`
- Border-radius: 8px
- Padding: 16px
- Shadow: `0 1px 3px rgba(0,0,0,0.1)`

**Avatar/Chip de pessoa:**
- Size: 32px × 32px (lista) / 40px × 40px (destaque)
- Background: Cor da pessoa
- Texto: Iniciais em branco
- Border-radius: 50%

---

#### Estados de Feedback

**Sucesso:**
- Background: `#D1FAE5` (verde claro)
- Ícone: `#059669`
- Texto: `#065F46`

**Alerta/Atenção:**
- Background: `#FEF3C7` (amarelo claro)
- Ícone: `#F59E0B`
- Texto: `#92400E`

**Erro:**
- Background: `#FEE2E2` (vermelho claro)
- Ícone: `#DC2626`
- Texto: `#991B1B`

---

### 🧭 Navegação / Progresso

**Bottom Navigation com 4 etapas:**

1. Pedidos (ícone: comanda)
2. Pessoas (ícone: grupo)
3. Gorjeta (ícone: porcentagem)
4. Resumo (ícone: gráfico)

**Estados visuais:**
- **Ativo:** Background azul, ícone branco
- **Concluído:** Background verde, ícone branco + checkmark
- **Pendente:** Background cinza claro, ícone cinza

---

### 📐 Espaçamento

**Sistema de espaçamento:**
- `xs`: 8px
- `sm`: 16px
- `md`: 20px
- `lg`: 24px
- `xl`: 32px

**Bordas arredondadas:**
- Padrão: 8px
- Avatares: 50% (circular)
- Botões grandes: 12px

---

### 🎯 Ícones

Biblioteca: **Outline style** (Heroicons ou similar)

**Principais ícones:**
- Voltar: `←`
- Próximo: `→`
- Adicionar: `+`
- Remover: 🗑️
- Comanda: 📋
- Pessoas: 👥
- Percentual: `%`
- Valor fixo: `$`
- Gorjeta: 💰
- Resumo: 📊
- Compartilhar: 🔗
- Refazer: 🔄
- Menu: ☰
- Info: ℹ️

---

## Regras de Negócio

### Cálculo de valores

1. **Divisão de pedidos:**
   - Valor do item ÷ número de pessoas que consumiram = valor por pessoa

2. **Gorjeta:**
   - **Percentual:** Total da comanda × (percentual ÷ 100)
   - **Valor fixo:** Valor definido pelo usuário
   - Divisão da gorjeta: Total gorjeta ÷ número de participantes

3. **Total por pessoa:**
   - Soma dos itens consumidos + (gorjeta ÷ participantes)

### Validações

- ✅ Comanda precisa ter ao menos 1 pedido
- ✅ Cada pedido precisa ter ao menos 1 pessoa
- ✅ Mesa precisa ter ao menos 1 pessoa cadastrada
- ✅ Se gorjeta ativa, ao menos 1 pessoa deve participar

---

## Persistência Local

**localStorage keys:**
```
dividi:mesa-atual           // Identificador da mesa
dividi:pedidos              // Array de pedidos
dividi:pessoas              // Array de pessoas
dividi:gorjeta-config       // Configuração de gorjeta
dividi:divisao              // Mapa de quem consumiu o quê
```

**sessionStorage:**
- Usado para estado temporário durante o fluxo (etapa atual, drafts)

---

## Acessibilidade

- ✅ Touch targets mínimo: 44px × 44px
- ✅ Contraste WCAG AA em textos
- ✅ Feedback visual em todas as interações
- ✅ Estados de foco visíveis para navegação por teclado

---

## Responsividade

**Breakpoint principal:** 640px (max-width mobile)

**Container:**
- Mobile: `max-width: 480px`, padding lateral 16px
- Tablet+: centralizado com `max-width: 640px`

---

## Próximos Passos (Backlog)

- [ ] Implementar Tela 1: Pedidos
- [ ] Implementar Tela 2: Pessoas
- [ ] Implementar Tela 3: Gorjeta
- [ ] Implementar Tela 4: Resumo
- [ ] Persistência localStorage
- [ ] Função "Compartilhar resumo"
- [ ] PWA (offline-first, instalável)
- [ ] Modo escuro (opcional)
