/*
  Dashboard Financeira (Lucro/Aluguel)
  - Usa localStorage: rapicar_pendencias_v1
  - Interpreta 'dividas' como eventos financeiros (locações vencidas/ocorrências)
  - Gera séries diárias/mensais/anual por agregação dos períodos (primeiroDia -> ultimoDia)
*/

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'rapicar_pendencias_v1';

  // Carros (mock coerente com pim3.js)
  // Inclui categoria mock para atender o filtro pedido.
  const listaCarrosGlobal = [
    { id: 1, marca: 'Volkswagen', modelo: 'Gol', cor: 'Preto', placa: 'ABC-1234', diaria: 599.9},
    { id: 2, marca: 'Chevrolet', modelo: 'Onix', cor: 'Branco', placa: 'DEF-5678', diaria: 599.9},
  
  ];

  const fmtBRL = (value) => {
    const n = Number(value || 0);
    return `R$ ${n.toFixed(2).replace('.', ',')}`;
  };

  const fmtPct = (v) => {
    const n = Number(v || 0) * 100;
    const sign = n > 0 ? '+' : '';
    return `${sign}${n.toFixed(1)}%`;
  };

  const toDate = (iso) => {
    if (!iso) return null;
    // iso: yyyy-mm-dd
    const d = new Date(String(iso) + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return null;
    return d;
  };

  const dateISO = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const inclusiveDaysBetween = (startISO, endISO) => {
    const a = toDate(startISO);
    const b = toDate(endISO);
    if (!a || !b) return 0;
    const diffMs = (b.getTime() - a.getTime());
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(0, days);
  };

  const daysSeries = (startISO, endISO) => {
    const a = toDate(startISO);
    const b = toDate(endISO);
    if (!a || !b) return [];
    const out = [];
    const cur = new Date(a.getTime());
    while (cur.getTime() <= b.getTime() && out.length < 2000) {
      out.push(dateISO(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return out;
  };

  const mesesSeries = (startISO, endISO) => {
    const a = toDate(startISO);
    const b = toDate(endISO);
    if (!a || !b) return [];

    const out = [];
    const cur = new Date(a.getFullYear(), a.getMonth(), 1);
    const limit = new Date(b.getFullYear(), b.getMonth(), 1);

    while (cur.getTime() <= limit.getTime() && out.length < 600) {
      out.push(`${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}`);
      cur.setMonth(cur.getMonth() + 1);
    }
    return out;
  };

  const yearsSeries = (startISO, endISO) => {
    const a = toDate(startISO);
    const b = toDate(endISO);
    if (!a || !b) return [];
    const out = [];
    for (let y = a.getFullYear(); y <= b.getFullYear() && out.length < 200; y++) {
      out.push(String(y));
    }
    return out;
  };

  function carregarEstado() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { clientes: {}, alugueis: [], dividas: [] };
      return JSON.parse(raw);
    } catch {
      return { clientes: {}, alugueis: [], dividas: [] };
    }
  }

  function getCarroPorId(carroId) {
    return listaCarrosGlobal.find(c => Number(c.id) === Number(carroId)) || null;
  }

  function getDividas() {
    const estado = carregarEstado();
    return Array.isArray(estado.dividas) ? estado.dividas : [];
  }

  function normalizeDividas(dividas) {
    // Filtra apenas dividas com datas válidas
    return dividas
      .filter(d => d && d.primeiroDia && d.ultimoDia && d.carroId != null)
      .map(d => {
        const carro = getCarroPorId(d.carroId);
        const diaria = carro ? Number(carro.diaria || 0) : Number(d.diaria || 0);
        const dias = inclusiveDaysBetween(d.primeiroDia, d.ultimoDia);
        const receitaEstim = dias * diaria;
        const prejuizo = Number(d.valor || 0);
        const lucro = receitaEstim - prejuizo;
        return {
          ...d,
          _carro: carro,
          _diaria: diaria,
          _dias: dias,
          _receita: receitaEstim,
          _prejuizo: prejuizo,
          _lucro: lucro,
        };
      })
      .filter(d => d._dias > 0);
  }

  function getScopeLabel(carro) {
    if (!carro) return 'Geral do sistema';
    return `${carro.marca} ${carro.modelo} • ${carro.placa}`;
  }

  function buildPeriodLabel(dividas) {
    if (!dividas.length) return 'Período: —';
    let min = null;
    let max = null;
    dividas.forEach(d => {
      if (!min || d.primeiroDia < min) min = d.primeiroDia;
      if (!max || d.ultimoDia > max) max = d.ultimoDia;
    });
    return `Período: ${min} até ${max}`;
  }

  function safeDelta(current, prev) {
    const c = Number(current || 0);
    const p = Number(prev || 0);
    if (p === 0) return null;
    return (c - p) / p;
  }

  function destroyChart(inst) {
    if (!inst) return;
    try { inst.destroy(); } catch {}
  }

  const dom = {
    // escopo
    pillScope: document.getElementById('pill-scope'),
    pillPeriod: document.getElementById('pill-period'),
    subRendimento: document.getElementById('sub-rendimento'),
    emptyHint: document.getElementById('empty-hint'),

    // cards
    mFaturamentoHoje: document.getElementById('m-faturamento-hoje'),
    mFaturamentoHojeDelta: document.getElementById('m-faturamento-hoje-delta'),

    mFaturamentoMes: document.getElementById('m-faturamento-mes'),
    mFaturamentoMesDelta: document.getElementById('m-faturamento-mes-delta'),

    mFaturamentoAno: document.getElementById('m-faturamento-ano'),
    mFaturamentoAnoDelta: document.getElementById('m-faturamento-ano-delta'),

    mTotalLocacoes: document.getElementById('m-total-locacoes'),
    mTotalLocacoesDelta: document.getElementById('m-total-locacoes-delta'),

    mVeiculosAlugados: document.getElementById('m-veiculos-alugados'),
    mVeiculosAlugadosDelta: document.getElementById('m-veiculos-alugados-delta'),

    mVeiculosDisponiveis: document.getElementById('m-veiculos-disponiveis'),
    mVeiculosDisponiveisDelta: document.getElementById('m-veiculos-disponiveis-delta'),

    mTaxaOcupacao: document.getElementById('m-taxa-ocupacao'),
    mTaxaOcupacaoDelta: document.getElementById('m-taxa-ocupacao-delta'),

    mTicketMedio: document.getElementById('m-ticket-medio'),
    mTicketMedioDelta: document.getElementById('m-ticket-medio-delta'),

    // mini metrics
    mmTotalLocacoes: document.getElementById('mm-total-locacoes'),
    mmDiasAlugado: document.getElementById('mm-dias-alugado'),
    mmDiasParado: document.getElementById('mm-dias-parado'),
    mmLucroAcumulado: document.getElementById('mm-lucro-acumulado'),
    mmMediaDiaria: document.getElementById('mm-media-diaria'),
    mmTaxaUtilizacao: document.getElementById('mm-taxa-utilizacao'),

    // ranking
    rankTop: document.getElementById('rank-top'),
    rankBottom: document.getElementById('rank-bottom'),

    // histórico
    histCrescimento: document.getElementById('hist-crescimento'),
    histComparacao: document.getElementById('hist-comparacao'),
    histTicket: document.getElementById('hist-ticket'),

    // gráficos
    cDiario: document.getElementById('chart-diario'),
    cMensal: document.getElementById('chart-mensal'),
    cAnual: document.getElementById('chart-anual'),
    cOcupacao: document.getElementById('chart-ocupacao'),
    cParticipacao: document.getElementById('chart-participacao'),
    cRanking: document.getElementById('chart-ranking'),
    cLocacoes: document.getElementById('chart-locacoes'),

    // filtro
    inputFiltroVeiculo: document.getElementById('filtro-veiculo'),
    selectCarro: document.getElementById('filtro-carro-selecionado'),
  };

  // estado de gráficos
  const charts = {
    diario: null,
    mensal: null,
    anual: null,
    ocupacao: null,
    participacao: null,
    ranking: null,
    locacoes: null,
  };

  function chartCommonOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: 'rgba(234,242,255,0.92)' } },
        tooltip: {
          backgroundColor: 'rgba(2, 18, 48, 0.92)',
          borderColor: 'rgba(255,255,255,0.18)',
          borderWidth: 1,
          titleColor: '#eaf2ff',
          bodyColor: '#eaf2ff'
        }
      },
      scales: {
        x: {
          ticks: { color: 'rgba(234,242,255,0.85)' },
          grid: { color: 'rgba(255,255,255,0.08)' }
        },
        y: {
          ticks: { color: 'rgba(234,242,255,0.85)' },
          grid: { color: 'rgba(255,255,255,0.08)' }
        }
      }
    };
  }

  function buildSeries(dividas, carroIdFilter = null) {
    const eventos = carroIdFilter ? dividas.filter(d => Number(d.carroId) === Number(carroIdFilter)) : dividas;

    const diaria = new Map(); // dateISO -> { receita, locacoes }
    const mensal = new Map(); // yyyy-MM -> receita
    const anual = new Map(); // yyyy -> receita

    let diasAlugado = 0;
    let lucroTotal = 0;

    // locações = eventos (cada divida como locação)
    eventos.forEach(d => {
      const carro = d._carro;
      const dailyReceita = (carro ? Number(carro.diaria || 0) : Number(d._diaria || 0));

      // distribuição diária
      const ds = daysSeries(d.primeiroDia, d.ultimoDia);
      ds.forEach(dayISO => {
        const current = diaria.get(dayISO) || { receita: 0, locacoes: 0 };
        current.receita += dailyReceita;
        current.locacoes += 1;
        diaria.set(dayISO, current);
      });

      // mensal e anual agregam pelo período
      const ms = mesesSeries(d.primeiroDia, d.ultimoDia);
      ms.forEach(m => {
        // receita no mês: dias do mês dentro do intervalo * diária.
        // Para simplificar sem calendário pesado: estimamos usando dias do intervalo e divisão proporcional por dias do mês.
        // Implementação leve: conta dias reais do mês dentro do intervalo.
        const [yy, mm] = m.split('-').map(x => Number(x));
        const monthStart = `${yy}-${String(mm).padStart(2,'0')}-01`;
        const monthEndDate = new Date(yy, mm, 0); // último dia do mês
        const monthEnd = `${yy}-${String(mm).padStart(2,'0')}-${String(monthEndDate.getDate()).padStart(2,'0')}`;

        const interStart = monthStart > d.primeiroDia ? monthStart : d.primeiroDia;
        const interEnd = monthEnd < d.ultimoDia ? monthEnd : d.ultimoDia;

        const diasInter = inclusiveDaysBetween(interStart, interEnd);
        const rec = diasInter * dailyReceita;
        mensal.set(m, (mensal.get(m) || 0) + rec);
      });

      const ys = yearsSeries(d.primeiroDia, d.ultimoDia);
      ys.forEach(y => {
        const yearStart = `${y}-01-01`;
        const yearEnd = `${y}-12-31`;
        const interStart = yearStart > d.primeiroDia ? yearStart : d.primeiroDia;
        const interEnd = yearEnd < d.ultimoDia ? yearEnd : d.ultimoDia;
        const diasInter = inclusiveDaysBetween(interStart, interEnd);
        anual.set(y, (anual.get(y) || 0) + diasInter * dailyReceita);
      });

      diasAlugado += d._dias;
      lucroTotal += d._lucro;
    });

    // datas ordenadas
    const diariaKeys = [...diaria.keys()].sort();
    const diariaData = diariaKeys.map(k => diaria.get(k));

    const mensalKeys = [...mensal.keys()].sort();
    const mensalData = mensalKeys.map(k => mensal.get(k) || 0);

    const anualKeys = [...anual.keys()].sort();
    const anualData = anualKeys.map(k => anual.get(k) || 0);

    return {
      eventos,
      diaria: { keys: diariaKeys, data: diariaData },
      mensal: { keys: mensalKeys, data: mensalData },
      anual: { keys: anualKeys, data: anualData },
      diasAlugado,
      lucroTotal,
    };
  }

  function computeAvailableVsRented(dividas, carro) {
    // O sistema não guarda status de disponibilidade real.
    // Aproximação: 
    // - diasDisponiveis no período = diasCobertosPeloPeriodo * 1 veículo - diasAlugado.
    // - 'agora' aproximado usando ocorrência mais recente com data dentro do intervalo.

    const all = dividas;
    if (!all.length) {
      return { alugados: 0, disponiveis: listaCarrosGlobal.length, diasParado: 0 };
    }

    // Período global
    let min = null;
    let max = null;
    all.forEach(d => {
      if (!min || d.primeiroDia < min) min = d.primeiroDia;
      if (!max || d.ultimoDia > max) max = d.ultimoDia;
    });

    const totalDiasPeriodo = inclusiveDaysBetween(min, max);

    // Para cada veículo: soma dias de períodos
    const byCar = new Map();
    all.forEach(d => {
      const id = d.carroId;
      const prev = byCar.get(id) || 0;
      byCar.set(id, prev + inclusiveDaysBetween(d.primeiroDia, d.ultimoDia));
    });

    const alugados = carro ? (byCar.get(carro.id) ? 1 : 0) : new Set([...byCar.keys()].map(Number)).size;

    const disponiveis = carro ? (alugados ? 0 : 1) : Math.max(0, listaCarrosGlobal.length - alugados);

    const diasParado = carro
      ? Math.max(0, totalDiasPeriodo - (byCar.get(carro.id) || 0))
      : Math.max(0, totalDiasPeriodo * listaCarrosGlobal.length - [...byCar.entries()].reduce((acc, [, v]) => acc + v, 0));

    return { alugados, disponiveis, diasParado, totalDiasPeriodo };
  }

  function computeOcupacao(totDiasAlugado, diasParado) {
    const total = Number(totDiasAlugado || 0) + Number(diasParado || 0);
    if (total <= 0) return 0;
    return Number(totDiasAlugado) / total;
  }

  function buildRanking(dividas, carroFilterId) {
    // Receita estimada por veículo usando mesma lógica do buildSeries.
    // Para ranking, usamos receita estimada total no dataset filtrado.
    const receitaPorCarro = new Map();
    const lucroPorCarro = new Map();
    const locacoesPorCarro = new Map();

    dividas
      .filter(d => (carroFilterId ? Number(d.carroId) === Number(carroFilterId) : true))
      .forEach(d => {
        const id = Number(d.carroId);
        const prevRec = receitaPorCarro.get(id) || 0;
        const prevLucro = lucroPorCarro.get(id) || 0;
        const prevLoc = locacoesPorCarro.get(id) || 0;
        receitaPorCarro.set(id, prevRec + d._receita);
        lucroPorCarro.set(id, prevLucro + d._lucro);
        locacoesPorCarro.set(id, prevLoc + 1);
      });

    const rows = listaCarrosGlobal
      .map(c => {
        if (carroFilterId && Number(c.id) !== Number(carroFilterId)) return null;
        return {
          carro: c,
          receita: receitaPorCarro.get(Number(c.id)) || 0,
          lucro: lucroPorCarro.get(Number(c.id)) || 0,
          locacoes: locacoesPorCarro.get(Number(c.id)) || 0,
        };
      })
      .filter(Boolean);

    rows.sort((a, b) => b.receita - a.receita);
    const top = rows.slice(0, 5);
    const bottom = [...rows].reverse().slice(0, 5);
    return { rows, top, bottom };
  }

  function renderRankList(el, items) {
    el.innerHTML = '';
    items.forEach((it, idx) => {
      const li = document.createElement('li');
      li.textContent = `${idx + 1}. ${it.carro.marca} ${it.carro.modelo} (${it.carro.placa}) — ${fmtBRL(it.receita)} `;
      el.appendChild(li);
    });
  }

  function setDeltaText(el, delta, formatFn) {
    if (!el) return;
    if (delta === null || delta === undefined || Number.isNaN(delta)) {
      el.textContent = '—';
      el.classList.remove('metric__delta--up', 'metric__delta--down');
      return;
    }
    const txt = formatFn ? formatFn(delta) : fmtPct(delta);
    el.textContent = txt;
    el.classList.remove('metric__delta--up', 'metric__delta--down');
    if (delta >= 0) el.classList.add('metric__delta--up');
    else el.classList.add('metric__delta--down');
  }

  function renderCharts(series, dividasNorm, carroSelected) {
    // Limpa instâncias
    destroyChart(charts.diario);
    destroyChart(charts.mensal);
    destroyChart(charts.anual);
    destroyChart(charts.ocupacao);
    destroyChart(charts.participacao);
    destroyChart(charts.ranking);
    destroyChart(charts.locacoes);

    const labelsDiario = series.diaria.keys.slice(-14);
    const dataReceitaDiaria = labelsDiario.map(k => (series.diaria.data[series.diaria.keys.indexOf(k)]?.receita || 0));
    const dataLocacoesDiaria = labelsDiario.map(k => (series.diaria.data[series.diaria.keys.indexOf(k)]?.locacoes || 0));

    charts.diario = new Chart(dom.cDiario, {
      type: 'line',
      data: {
        labels: labelsDiario,
        datasets: [
          {
            label: 'Receita diária',
            data: dataReceitaDiaria,
            borderColor: 'rgba(56, 189, 248, 0.95)',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            fill: true,
            tension: 0.3,
            yAxisID: 'y',
          },
          {
            label: 'Locações (contagem diária)',
            data: dataLocacoesDiaria,
            borderColor: 'rgba(34, 197, 94, 0.95)',
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            fill: false,
            tension: 0.3,
            yAxisID: 'y1',
          }
        ]
      },
      options: {
        ...chartCommonOptions(),
        scales: {
          ...chartCommonOptions().scales,
          y1: {
            position: 'right',
            ticks: { color: 'rgba(234,242,255,0.85)' },
            grid: { drawOnChartArea: false, color: 'rgba(255,255,255,0.08)' }
          }
        }
      }
    });

    const labelsMensal = series.mensal.keys.slice(-8);
    const dataMensal = series.mensal.data.slice(-8);

    // comparação com meses anteriores: usamos diferença entre últimos 1.. e anterior (mes a mes)
    charts.mensal = new Chart(dom.cMensal, {
      type: 'bar',
      data: {
        labels: labelsMensal,
        datasets: [
          {
            label: 'Faturamento mensal (estimado)',
            data: dataMensal,
            backgroundColor: 'rgba(245, 158, 11, 0.35)',
            borderColor: 'rgba(245, 158, 11, 0.85)',
            borderWidth: 1.2,
            borderRadius: 10,
          }
        ]
      },
      options: chartCommonOptions()
    });

    const labelsAnual = series.anual.keys.slice(-8);
    const dataAnual = series.anual.data.slice(-8);

    charts.anual = new Chart(dom.cAnual, {
      type: 'line',
      data: {
        labels: labelsAnual,
        datasets: [
          {
            label: 'Faturamento anual (estimado)',
            data: dataAnual,
            borderColor: 'rgba(212, 175, 55, 0.95)',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            fill: true,
            tension: 0.25,
            pointRadius: 3,
          }
        ]
      },
      options: chartCommonOptions()
    });

    // Ocupação
    const scopeCar = carroSelected || null;
    const occ = computeAvailableVsRented(dividasNorm, scopeCar);
    const totalAlugado = series.diasAlugado;
    const diasParado = occ.diasParado;
    const taxa = computeOcupacao(totalAlugado, diasParado);

    charts.ocupacao = new Chart(dom.cOcupacao, {
      type: 'doughnut',
      data: {
        labels: ['Alugados', 'Disponíveis'],
        datasets: [
          {
            data: [totalAlugado, diasParado],
            backgroundColor: [
              'rgba(34, 197, 94, 0.75)',
              'rgba(148, 163, 184, 0.55)'
            ],
            borderColor: ['rgba(34, 197, 94, 1)', 'rgba(148, 163, 184, 1)'],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: 'rgba(234,242,255,0.92)' } }
        }
      }
    });

    // Participação: receita por carro (top 5)
    const ranking = buildRanking(dividasNorm, carroSelected ? carroSelected.id : null);
    const top = ranking.rows.sort((a, b) => b.receita - a.receita).slice(0, 6);
    const partLabels = top.map(x => `${x.carro.marca} ${x.carro.modelo}`);
    const partData = top.map(x => x.receita);

    charts.participacao = new Chart(dom.cParticipacao, {
      type: 'pie',
      data: {
        labels: partLabels,
        datasets: [
          {
            data: partData,
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(34, 197, 94, 0.75)',
              'rgba(245, 158, 11, 0.75)',
              'rgba(148, 163, 184, 0.7)',
              'rgba(212, 175, 55, 0.65)',
              'rgba(239, 68, 68, 0.65)'
            ],
            borderColor: 'rgba(255,255,255,0.15)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: 'rgba(234,242,255,0.92)' } }
        }
      }
    });

    // Barras ranking
    charts.ranking = new Chart(dom.cRanking, {
      type: 'bar',
      data: {
        labels: ranking.rows.map(r => `${r.carro.marca}`),
        datasets: [
          {
            label: 'Receita estimada',
            data: ranking.rows.map(r => r.receita),
            backgroundColor: 'rgba(56, 189, 248, 0.35)',
            borderColor: 'rgba(56, 189, 248, 0.9)',
            borderWidth: 1,
            borderRadius: 10,
          }
        ]
      },
      options: {
        ...chartCommonOptions(),
        scales: {
          x: { ticks: { color: 'rgba(234,242,255,0.85)' }, grid: { display: false } },
          y: { ticks: { color: 'rgba(234,242,255,0.85)' }, grid: { color: 'rgba(255,255,255,0.08)' } }
        }
      }
    });

    // Histórico de locações: usa série diária (locações por dia)
    charts.locacoes = new Chart(dom.cLocacoes, {
      type: 'line',
      data: {
        labels: labelsDiario,
        datasets: [
          {
            label: 'Locações (contagem por dia)',
            data: dataLocacoesDiaria,
            borderColor: 'rgba(34, 197, 94, 0.95)',
            backgroundColor: 'rgba(34, 197, 94, 0.18)',
            fill: true,
            tension: 0.3,
            pointRadius: 3,
          }
        ]
      },
      options: chartCommonOptions()
    });

    // empty
    const hasBase = (dividasNorm || []).length > 0;
    dom.emptyHint.style.display = hasBase ? 'none' : 'block';
  }

  function renderMetrics(dividasNorm, series, carroSelected) {
    const eventos = series.eventos;

    const todayISO = dateISO(new Date());
    const receitaHoje = series.diaria.keys.includes(todayISO)
      ? series.diaria.data[series.diaria.keys.indexOf(todayISO)]?.receita || 0
      : 0;

    const lastDay = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return dateISO(d);
    })();

    const receitaOntem = series.diaria.keys.includes(lastDay)
      ? series.diaria.data[series.diaria.keys.indexOf(lastDay)]?.receita || 0
      : 0;

    dom.mFaturamentoHoje.textContent = fmtBRL(receitaHoje);
    setDeltaText(dom.mFaturamentoHojeDelta, safeDelta(receitaHoje, receitaOntem));

    // mês atual
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthKey = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;

    const receitaMes = series.mensal.keys.includes(currentMonthKey) ? series.mensal.data[series.mensal.keys.indexOf(currentMonthKey)] : 0;
    const receitaMesAnterior = series.mensal.keys.includes(prevMonthKey) ? series.mensal.data[series.mensal.keys.indexOf(prevMonthKey)] : 0;

    dom.mFaturamentoMes.textContent = fmtBRL(receitaMes);
    setDeltaText(dom.mFaturamentoMesDelta, safeDelta(receitaMes, receitaMesAnterior));

    // ano atual
    const currentYearKey = String(now.getFullYear());
    const prevYearKey = String(now.getFullYear() - 1);

    const receitaAno = series.anual.keys.includes(currentYearKey) ? series.anual.data[series.anual.keys.indexOf(currentYearKey)] : 0;
    const receitaAnoAnterior = series.anual.keys.includes(prevYearKey) ? series.anual.data[series.anual.keys.indexOf(prevYearKey)] : 0;

    dom.mFaturamentoAno.textContent = fmtBRL(receitaAno);
    setDeltaText(dom.mFaturamentoAnoDelta, safeDelta(receitaAno, receitaAnoAnterior));

    // locações
    const qtdLocacoes = eventos.length;
    dom.mTotalLocacoes.textContent = String(qtdLocacoes);

    // comparação simples: metade anterior do dataset temporal (não perfeito, mas consistente)
    const ordered = [...dividasNorm].sort((a, b) => String(a.primeiroDia).localeCompare(String(b.primeiroDia)));
    const half = Math.max(1, Math.floor(ordered.length / 2));
    const prevLoc = ordered.slice(0, half).filter(d => (carroSelected ? Number(d.carroId) === Number(carroSelected.id) : true)).length;
    const deltaLoc = safeDelta(qtdLocacoes, prevLoc);
    setDeltaText(dom.mTotalLocacoesDelta, deltaLoc);

    // ocupação e disponíveis
    const scopeCar = carroSelected || null;
    const occ = computeAvailableVsRented(dividasNorm, scopeCar);
    const diasParado = occ.diasParado;
    const taxa = computeOcupacao(series.diasAlugado, diasParado);

    dom.mVeiculosAlugados.textContent = String(occ.alugados);
    dom.mVeiculosDisponiveis.textContent = String(occ.disponiveis);
    dom.mTaxaOcupacao.textContent = `${(taxa * 100).toFixed(1)}%`;

    dom.mmTotalLocacoes.textContent = String(qtdLocacoes);
    dom.mmDiasAlugado.textContent = String(series.diasAlugado);
    dom.mmDiasParado.textContent = String(diasParado);
    dom.mmLucroAcumulado.textContent = fmtBRL(series.lucroTotal);

    const mediaDiaria = (() => {
      if (!eventos.length) return 0;
      // média ponderada por dias (para ficar coerente)
      const sumDiariaDias = eventos.reduce((acc, d) => acc + Number(d._diaria || 0) * Number(d._dias || 0), 0);
      const sumDias = eventos.reduce((acc, d) => acc + Number(d._dias || 0), 0);
      if (sumDias <= 0) return 0;
      return sumDiariaDias / sumDias;
    })();

    dom.mmMediaDiaria.textContent = fmtBRL(mediaDiaria);
    dom.mmTaxaUtilizacao.textContent = `${(taxa * 100).toFixed(1)}%`;

    const receitaTotal = series.eventos.reduce((acc, d) => acc + Number(d._receita || 0), 0);
    const ticketMedio = qtdLocacoes ? receitaTotal / qtdLocacoes : 0;
    dom.mTicketMedio.textContent = fmtBRL(ticketMedio);

    // delta ticket: compara com primeira metade
    const prevTicket = (() => {
      if (!ordered.length) return null;
      const subset = ordered.slice(0, half).filter(d => (carroSelected ? Number(d.carroId) === Number(carroSelected.id) : true));
      if (!subset.length) return null;
      const rec = subset.reduce((acc, d) => acc + Number(d._receita || 0), 0);
      return rec / subset.length;
    })();

    setDeltaText(dom.mTicketMedioDelta, prevTicket != null && prevTicket !== 0 ? (ticketMedio - prevTicket) / prevTicket : null);

    dom.histTicket.textContent = fmtBRL(ticketMedio);

    // crescimento financeiro (simplificado): receita acumulada último mês vs mês anterior
    dom.histCrescimento.textContent = dom.mFaturamentoMesDelta.textContent;
    dom.histComparacao.textContent = `Mês atual vs anterior • ${fmtBRL(receitaMes)} vs ${fmtBRL(receitaMesAnterior)}`;

    dom.subRendimento.textContent = carroSelected ? 'Métricas do veículo selecionado' : 'Métricas gerais do sistema';
  }

  function applyFilterToSelect(text) {
    const t = (text || '').trim().toLowerCase();
    if (!t) {
      // mantém seleção atual
      return;
    }

    const options = [...dom.selectCarro.options];
    const match = listaCarrosGlobal.find(c => {
      const hay = `${c.id} ${c.marca} ${c.modelo} ${c.placa} ${c.categoria}`.toLowerCase();
      return hay.includes(t);
    });

    if (match) dom.selectCarro.value = String(match.id);
    else dom.selectCarro.value = '';
  }

  function populateSelect() {
    dom.selectCarro.innerHTML = '';
    const optAll = document.createElement('option');
    optAll.value = '';
    optAll.textContent = 'Todos os veículos (geral)';
    dom.selectCarro.appendChild(optAll);

    listaCarrosGlobal.forEach(c => {
      const opt = document.createElement('option');
      opt.value = String(c.id);
      opt.textContent = `${c.marca} ${c.modelo} • ${c.placa}`;
      dom.selectCarro.appendChild(opt);
    });
  }

  function getSelectedCarro() {
    const id = dom.selectCarro.value;
    if (!id) return null;
    return getCarroPorId(id);
  }

  function renderAll() {
    const raw = getDividas();
    const dividasNorm = normalizeDividas(raw);

    // escopo
    const carroSelected = getSelectedCarro();
    dom.pillScope.textContent = getScopeLabel(carroSelected);

    dom.pillPeriod.textContent = buildPeriodLabel(dividasNorm);

    const series = buildSeries(dividasNorm, carroSelected ? carroSelected.id : null);

    // ranking
    const ranking = buildRanking(dividasNorm, carroSelected ? carroSelected.id : null);
    renderRankList(dom.rankTop, ranking.top);
    renderRankList(dom.rankBottom, ranking.bottom);

    // charts
    renderCharts(series, dividasNorm, carroSelected);

    // metrics
    renderMetrics(dividasNorm, series, carroSelected);
  }

  // eventos
  const domModelo = document.getElementById('filtro-modelo');
  const domPlaca = document.getElementById('filtro-placa');
  const domCategoria = document.getElementById('filtro-categoria');
  const domBtnLimpar = document.getElementById('btn-limpar-filtros');

  function syncSelectWithTextFilter() {
    // O JS atual só filtra pelo campo de texto via applyFilterToSelect().
    // Para manter compatibilidade, montamos a string unificada com os filtros.
    const parts = [];
    if (domModelo?.value) parts.push(domModelo.value);
    if (domPlaca?.value) parts.push(domPlaca.value);
    if (domCategoria?.value) parts.push(domCategoria.value);

    // preserva o que o usuário digitou na pesquisa (nome do carro)
    const typed = (dom.inputFiltroVeiculo?.value || '').trim();
    const typedPart = typed;

    // se houver filtros específicos, concatenamos; senão mantém somente o texto digitado
    const next = parts.length > 0 ? `${typedPart} ${parts.join(' ')}`.trim() : typedPart;
    if (dom.inputFiltroVeiculo) dom.inputFiltroVeiculo.value = next;

    applyFilterToSelect(next);
  }

  function clearAllFilters() {
    if (dom.inputFiltroVeiculo) dom.inputFiltroVeiculo.value = '';
    if (domModelo) domModelo.value = '';
    if (domPlaca) domPlaca.value = '';
    if (domCategoria) domCategoria.value = '';
    if (dom.selectCarro) dom.selectCarro.value = '';
    renderAll();
  }

  function populateExtraSelects() {
    // Preenche modelo/placa/categoria com opções únicas a partir do mock local.
    const modelos = new Set();
    const placas = new Set();
    const categorias = new Set();

    listaCarrosGlobal.forEach(c => {
      if (c.modelo) modelos.add(c.modelo);
      if (c.placa) placas.add(c.placa);
      if (c.categoria) categorias.add(c.categoria);
    });

    const fill = (selectEl, values) => {
      if (!selectEl) return;
      selectEl.innerHTML = '';
      const optAll = document.createElement('option');
      optAll.value = '';
      optAll.textContent = 'Todos';
      selectEl.appendChild(optAll);
      [...values].sort().forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        selectEl.appendChild(opt);
      });
    };

    fill(domModelo, modelos);
    fill(domPlaca, placas);
    fill(domCategoria, categorias);
  }

  dom.inputFiltroVeiculo?.addEventListener('input', (e) => {
    // Se usuário digitou, mantém selects como estão (não atrapalha).
    applyFilterToSelect(e.target.value);
    renderAll();
  });

  dom.selectCarro?.addEventListener('change', () => {
    const carro = getSelectedCarro();
    if (carro) {
      if (domModelo) domModelo.value = carro.modelo || '';
      if (domPlaca) domPlaca.value = carro.placa || '';
      if (domCategoria) domCategoria.value = carro.categoria || '';
      dom.inputFiltroVeiculo.value = `${carro.marca} ${carro.modelo} ${carro.placa} ${carro.categoria}`;
    } else {
      if (domModelo) domModelo.value = '';
      if (domPlaca) domPlaca.value = '';
      if (domCategoria) domCategoria.value = '';
      dom.inputFiltroVeiculo.value = '';
    }
    renderAll();
  });

  domModelo?.addEventListener('change', () => {
    syncSelectWithTextFilter();
    renderAll();
  });
  domPlaca?.addEventListener('change', () => {
    syncSelectWithTextFilter();
    renderAll();
  });
  domCategoria?.addEventListener('change', () => {
    syncSelectWithTextFilter();
    renderAll();
  });

  domBtnLimpar?.addEventListener('click', () => clearAllFilters());

  // init selects extras
  populateExtraSelects();


  // init
  populateSelect();

  // primeira renderização
  renderAll();
});

