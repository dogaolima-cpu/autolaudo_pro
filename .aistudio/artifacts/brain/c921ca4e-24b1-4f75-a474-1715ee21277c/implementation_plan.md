# AutoLaudo Pro - Laudo Técnico Pericial de Consultoria Automotiva com FIPE

Reestruturação do sistema para atender perfeitamente o técnico perito contratado pelo **proprietário do veículo** que deseja vender seu carro usado no mercado, precificando de forma justa, estratégica e valorizada perante compradores particulares ou lojistas.

### User Review & Critical Decisions

> [!IMPORTANT]
> As decisões de foco e perspectiva foram ajustadas para o benefício do **proprietário vendedor**:
> - **Foco no Proprietário Vendedor**: Remove termos de "compra de repasse da loja" ou "margem da concessionária". O laudo é um documento de consultoria de alto valor para o vendedor apresentar com segurança e transparência a potenciais compradores.
> - **Precificação Estratégica**:
>   - **Valor Tabela FIPE Oficial**: Base de mercado auditada em tempo real.
>   - **Preço Sugerido de Anúncio (Particular)**: Calculado com base na FIPE, valorização de conservação, baixa KM, opcionais e ajuste de mercado na região.
>   - **Preço Mínimo Aceitável para Negociação**: Margem de segurança definida para orientar o proprietário até onde ele pode conceder desconto em negociações sem prejuízo.
> - **Tratamento de Apontamentos & Avarias**: Os apontamentos de lataria e manutenção são detalhados como histórico de transparência pericial (checklist e diagrama), mas sem dedução forçada que destrua o valor do patrimônio do cliente.
> - **Título Oficial do Laudo**: "Laudo Técnico Pericial de Consultoria Automotiva com FIPE", conferindo autoridade profissional perante compradores e plataformas de venda.

---

### 1. Visão Geral e Conceito Atualizado

- **O que faz**: O técnico/consultor automotivo avalia o veículo do proprietário e entrega um laudo pericial impresso e digital (PDF e WhatsApp) que:
  1. Comprova a procedência e integridade estrutural do veículo (sem histórico de colisão grave, monobloco e chassi íntegros).
  2. Apresenta o diagrama visual da carroceria com apontamentos detalhados para total transparência com o futuro comprador.
  3. Relaciona os equipamentos de série, opcionais e checklist completo de 35+ itens mecânicos e elétricos.
  4. Certifica o teste de rodagem dinâmico (comportamento em pista, ausência de ruídos e estabilidade).
  5. Recomenda a faixa ideal de venda: **Preço Sugerido de Anúncio** (para posicionamento competitivo de vitrine) e **Preço Mínimo Aceitável** (para margem de negociação do vendedor).
- **Público-alvo**: Proprietários particulares vendendo seus carros, consultores automotivos independentes (Car Hunters / Avaliadores Cautelares) e peritos que prestam serviço de laudo e precificação para clientes finais.

---

### 2. Experiência do Usuário e Design Visual

- **Identidade e Estilo**:
  - Padrão pericial de consultoria automotiva com design sóbrio, técnico e confiável (`Plus Jakarta Sans` e `JetBrains Mono` tabular).
  - Título pericial destacado: **LAUDO TÉCNICO PERICIAL DE CONSULTORIA AUTOMOTIVA COM FIPE**.
  - Selo de Certificação para o proprietário: **VEÍCULO CERTIFICADO PARA VENDA** (ou *Certificado com Apontamentos* / *Restrito*).
- **Módulo de Precificação Orientado ao Vendedor**:
  - *Referência Tabela FIPE Oficial* (com mês vigente e código FIPE).
  - *Ajuste de Mercado Regional* (ágio por alta demanda na cidade/estado ou deságio regional).
  - *Preço Sugerido de Anúncio (Valor Alvo de Venda)*: Valor ideal para anunciar na Webmotors, OLX, redes sociais e negociações particulares.
  - *Preço Mínimo Aceitável para Negociação*: Piso sugerido pelo perito para o proprietário fechar negócio com segurança sem perder dinheiro.
  - *Margem de Negociação*: Indicador em R$ e % que o proprietário tem de folga para contrapropostas.

---

### 3. Componentes a Serem Atualizados

1. **`src/types/laudo.ts`**:
   - Ajuste dos campos de `PricingData` para refletir `precoAnuncioSugerido`, `precoMinimoNegociacao`, `margemNegociacaoSugeridaPercentual`, `agioMercadoRegional` e `observacoesVenda`.
2. **`src/components/PricingCalculator.tsx`**:
   - Redesenho da interface da calculadora: FIPE de referência, diferencial de conservação/quilometragem, ágio regional, sugestão de preço de anúncio e preço mínimo de negociação.
   - Remoção de noções de "compra de repasse da loja".
3. **`src/services/pdfReport.ts`**:
   - Atualização do cabeçalho institucional: "LAUDO TÉCNICO PERICIAL DE CONSULTORIA AUTOMOTIVA COM FIPE".
   - Diagramação de precificação destacando o Preço Sugerido de Anúncio e a faixa de negociação segura para o proprietário.
   - Texto de compartilhamento no WhatsApp formatado como dossiê do vendedor para enviar a compradores interessados.
4. **`src/components/LaudoViewerModal.tsx` & `src/components/Dashboard.tsx`**:
   - Alinhamento de métricas, textos e cartões para refletir o valor total de patrimônio para venda e precificação do proprietário.
5. **`src/constants/initialLaudos.ts` & `src/components/NewLaudoWizard.tsx`**:
   - Atualização dos dados de exemplo e do assistente de vistoria.

---

### 4. Diagrama de Fluxo e Precificação do Vendedor

```
┌────────────────────────────────────────────────────────────────────────┐
│             Precificação para o Proprietário Vendedor                  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌───────────────────────────┐      ┌─────────────────────────────┐   │
│   │  Tabela FIPE Oficial      │ ───► │  Ajuste de Mercado Regional │   │
│   │  (Consulta em Tempo Real) │      │  (Ágio / Demanda Local)     │   │
│   └─────────────┬─────────────┘      └──────────────┬──────────────┘   │
│                 │                                   │                  │
│                 ▼                                   ▼                  │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │            PREÇO SUGERIDO DE ANÚNCIO (VITRINE)                 │   │
│   │  Posicionamento competitivo para venda no mercado particular   │   │
│   └─────────────────────────────┬──────────────────────────────────┘   │
│                                 │                                      │
│                                 ▼                                      │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │        PREÇO MÍNIMO ACEITÁVEL DE NEGOCIAÇÃO                    │   │
│   │  Piso de segurança do proprietário para propostas e fechar     │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 5. Próximos Passos de Execução (Após Aprovação)

1. Ajustar as interfaces TypeScript (`PricingData`).
2. Atualizar o componente de precificação (`PricingCalculator.tsx`).
3. Atualizar o serviço de PDF (`pdfReport.ts`) com o título e foco no proprietário.
4. Atualizar o modal de visualização e o assistente de nova vistoria.
5. Validar com `compile_applet` e `lint_applet`.
