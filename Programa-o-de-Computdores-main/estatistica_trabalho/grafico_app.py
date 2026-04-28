# ============================================================
# Atividade 02 — Simulação de Investimento em Bancos
# ============================================================
# Este programa faz 6 coisas na ordem:
#   1. Lista os bancos disponíveis
#   2. Pede para o usuário escolher 2 bancos
#   3. Baixa os preços reais da bolsa pela internet
#   4. Calcula quanto cada ativo variou por dia (retorno)
#   5. Simula como R$ 10.000 teriam evoluído
#   6. Mostra um gráfico interativo com os resultados
# ============================================================


# ==============================
# IMPORTAÇÃO DE BIBLIOTECAS
# ==============================
# Bibliotecas são "caixas de ferramentas" prontas que outras
# pessoas criaram. Importamos aqui para usar as ferramentas delas.

import numpy as np
# numpy → usada para cálculos matemáticos com listas de números (arrays)
# "np" é só um apelido curto para não escrever "numpy" toda vez

import pandas as pd
# pandas → usada para trabalhar com tabelas de dados (como uma planilha Excel)
# "pd" é o apelido padrão do pandas

import plotly.graph_objects as go
# plotly → usada para criar gráficos interativos (com zoom, hover, etc.)
# "go" é o apelido para a parte de gráficos do plotly

import yfinance as yf
# yfinance → usada para baixar dados reais da bolsa de valores (Yahoo Finance)
# com ela conseguimos o histórico de preços de qualquer ativo listado


# ==============================
# 1. BANCOS DISPONÍVEIS
# ==============================
# Criamos um dicionário chamado "bancos".
# Um dicionário associa uma "chave" a um "valor", como um glossário.
# Aqui: a chave é o número ("1", "2"...) e o valor é uma tupla com
# o nome amigável e o ticker (código do ativo na bolsa).
#
# Ticker é o código que identifica uma ação na bolsa:
#   ITUB4.SA → Itaú na B3 (bolsa brasileira)
#   O ".SA" no final indica que o ativo é da bolsa de São Paulo

bancos = {
    "1": ("Itaú",            "ITUB4.SA"),
    "2": ("Bradesco",        "BBDC4.SA"),
    "3": ("Banco do Brasil", "BBAS3.SA"),
    "4": ("Santander",       "SANB11.SA"),
}

# Exibe no terminal a lista de bancos disponíveis para o usuário ver
# O \n no começo pula uma linha antes de imprimir, só para ficar mais legível
print("\nBancos disponíveis:")

# Percorre cada item do dicionário "bancos"
# "chave"  → o número ("1", "2", "3", "4")
# "nome"   → o nome do banco ("Itaú", "Bradesco"...)
# "ticker" → o código da bolsa ("ITUB4.SA", "BBDC4.SA"...)
for chave, (nome, ticker) in bancos.items():
    print(f"  [{chave}] {nome} ({ticker})")
    # f"..." é uma f-string: permite colocar variáveis dentro do texto
    # usando chaves {}. O resultado seria algo como: [1] Itaú (ITUB4.SA)


# ==============================
# 2. INPUTS DO USUÁRIO
# ==============================
# input() pausa o programa e espera o usuário digitar algo.
# O que o usuário digitar fica salvo na variável.
# .strip() remove espaços em branco acidentais no começo ou fim do texto.

while True:
    escolha1 = input("\nEscolha o 1º banco: ").strip()
    if escolha1 in bancos:
        break
    print("Escolha inválida. Digite um número de 1 a 4.")

while True:
    escolha2 = input("Escolha o 2º banco: ").strip()
    if escolha2 in bancos:
        break
    print("Escolha inválida. Digite um número de 1 a 4.")

# Agora buscamos no dicionário "bancos" as informações do banco escolhido.
# bancos["1"] retorna ("Itaú", "ITUB4.SA"), por exemplo.
# O nome e o ticker ficam salvos em variáveis separadas.
nome1, ticker1 = bancos[escolha1]
nome2, ticker2 = bancos[escolha2]

# Juntamos os dois tickers em uma lista para baixar os dados de uma vez
ativos = [ticker1, ticker2]
# Exemplo: ativos = ["ITUB4.SA", "BBAS3.SA"]


# ==============================
# 3. BAIXAR DADOS REAIS
# ==============================
# yf.download() conecta na internet e baixa os preços históricos
# dos ativos que passamos na lista "ativos".
#
# Parâmetros:
#   ativos             → lista com os tickers que queremos
#   start="2022-01-01" → data de início (formato: ano-mês-dia)
#   end="2024-01-01"   → data de fim
#
# ["Close"] → seleciona apenas a coluna de preço de fechamento
# (o preço do ativo no final de cada dia de negociação)
#
# O resultado é uma tabela (DataFrame) onde:
#   - cada linha  = um dia de negociação
#   - cada coluna = preço de fechamento de um ativo naquele dia

try:
    dados = yf.download(ativos, start="2020-01-01", end="2026-01-01")["Close"]
    if dados.empty:  # Verifica se os dados baixados estão vazios (nenhum dado encontrado)
        raise ValueError("Dados não encontrados para os ativos selecionados.")  # Força um erro se não houver dados, para evitar continuar com dados inválidos
except Exception as e:
    print(f"Erro ao baixar dados: {e}")
    print("Verifique sua conexão com a internet ou tente novamente mais tarde.")
    exit()


# ==============================
# 4. CALCULAR RETORNOS
# ==============================
# Queremos saber quanto o preço variou percentualmente de um dia para o outro.
#
# .pct_change() aplica a fórmula em cada dia:
#   retorno = (preço_hoje - preço_ontem) / preço_ontem
#
#   Exemplo:
#     preço ontem = R$ 100
#     preço hoje  = R$ 105
#     retorno     = (105 - 100) / 100 = 0.05 → ou seja, +5%
#
# O primeiro dia sempre resulta em NaN (Not a Number) porque não
# existe "dia anterior" para comparar.
#
# .dropna() remove as linhas com NaN para não sujar os cálculos.

retornos = dados.pct_change().dropna()


# ==============================
# 5. SIMULAÇÃO DE INVESTIMENTO
# ==============================

# Valor inicial investido (em reais)
capital_inicial = 10000

# Pesos definem como o capital é dividido entre os dois bancos.
# [0.50, 0.50] significa 50% para cada banco.
# np.array() transforma a lista em um array do numpy para cálculo.
# A soma dos pesos deve sempre ser 1.0 (= 100%)
pesos = np.array([0.50, 0.50])

# .dot(pesos) faz a multiplicação dos retornos pelos pesos e soma tudo.
# Isso gera um único retorno diário para a carteira inteira.
#
# Matematicamente, para cada dia:
#   retorno_carteira = (retorno_banco1 × 0.50) + (retorno_banco2 × 0.50)
#
# O resultado é uma série com um número por dia.
retorno_carteira = retornos.dot(pesos)

# Criamos uma lista "valores" que começa com o capital inicial.
# A cada dia, adicionaremos o novo saldo após aplicar o retorno do dia.
valores = [capital_inicial]

# Loop que percorre o retorno de cada dia
for r in retorno_carteira:
    # Fórmula de atualização do capital:
    #   novo_valor = valor_de_ontem × (1 + retorno_de_hoje)
    #
    # Exemplo:
    #   capital    = R$ 10.000
    #   retorno    = +2% = 0.02
    #   novo valor = 10.000 × (1 + 0.02) = 10.000 × 1.02 = R$ 10.200
    #
    # valores[-1] pega sempre o último elemento da lista (o dia mais recente)
    novo_valor = valores[-1] * (1 + r)

    # Adiciona o novo valor ao final da lista
    valores.append(novo_valor)


# ==============================
# 6. GRÁFICO INTERATIVO
# ==============================

# go.Figure() cria uma figura vazia onde adicionaremos os gráficos
fig = go.Figure()

# — Traçado dos ativos individuais —
# Percorremos cada ativo da lista para adicionar uma linha por banco
for ativo in ativos:

    # Normalizamos o preço para que todos comecem em R$ 10.000.
    # Isso permite comparar bancos com preços absolutos diferentes
    # na mesma escala de capital investido.
    #
    # Fórmula:
    #   valor_normalizado = (preço_no_dia / preço_no_1º_dia) × capital_inicial
    #
    # .iloc[0] pega o valor da primeira linha (índice 0 = primeiro dia)
    #
    # Exemplo:
    #   preço dia 1  = R$ 30
    #   preço dia 50 = R$ 33
    #   normalizado  = (33 / 30) × 10.000 = R$ 11.000 → cresceu 10%
    primeiro_preco = dados[ativo].iloc[0]
    if primeiro_preco == 0 or pd.isna(primeiro_preco):
        print(f"Aviso: Primeiro preço para {ativo} é zero ou inválido. Pulando este ativo.")
        continue
    preco_normalizado = dados[ativo] / primeiro_preco * capital_inicial

    fig.add_trace(go.Scatter(
        y=preco_normalizado,  # valores do eixo Y (preço normalizado)
        mode="lines",         # exibir como linha contínua (não pontos)
        name=ativo            # nome que aparece na legenda do gráfico
    ))

# — Traçado da carteira combinada —
# Adiciona a evolução total da carteira como uma linha mais grossa
# para se destacar das linhas individuais dos bancos
fig.add_trace(go.Scatter(
    y=valores,                              # lista com a evolução do capital dia a dia
    mode="lines",                           # linha contínua
    name=f"Carteira ({nome1} + {nome2})",   # nome dinâmico com os bancos escolhidos
    line=dict(width=4)                      # largura 4 para destacar no gráfico
))

# — Configurações visuais do gráfico —
fig.update_layout(
    title=f"Simulação de Investimento — {nome1} vs {nome2}",
    # título dinâmico com os nomes dos bancos escolhidos pelo usuário

    xaxis_title="Tempo",
    # rótulo do eixo horizontal (X) -> representa os dias

    yaxis_title="Valor (R$)",
    # rótulo do eixo vertical (Y) -> representa o saldo em reais

    template="plotly_dark"
    # tema visual escuro (fundo preto, linhas coloridas)
)

# Abre o gráfico no navegador de internet padrão do computador.
# O gráfico é interativo: é possível dar zoom, passar o mouse
# para ver valores e clicar na legenda para mostrar/ocultar linhas.
fig.show()