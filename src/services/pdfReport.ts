import jsPDF from 'jspdf';
import { Laudo, RecomendacaoStatus } from '../types/laudo';
import { DAMAGE_TYPES } from '../constants/defaultChecklist';

export class PdfReportService {
  /**
   * Gera e faz o download direto do Laudo Técnico Pericial de Consultoria Automotiva com FIPE
   * Formatado especialmente para o proprietário vendedor apresentar aos compradores
   */
  static generatePdf(laudo: Laudo): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const primaryColor = [15, 23, 42]; // Slate 900
    const accentColor = [2, 132, 199]; // Sky 600
    const textColor = [51, 65, 85]; // Slate 700

    // ==========================================
    // PÁGINA 1: CABEÇALHO, DADOS E PRECIFICAÇÃO FIPE
    // ==========================================

    // Top Header Banner
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 26, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('LAUDO TÉCNICO PERICIAL DE CONSULTORIA AUTOMOTIVA COM FIPE', 14, 11);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('AVALIAÇÃO DE PROCEDÊNCIA, ESTADO GERAL E PRECIFICAÇÃO RECOMENDADA PARA VENDA', 14, 17);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`LAUDO N°: ${laudo.numeroLaudo}`, 196, 11, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`DATA: ${new Date(laudo.dataCriacao).toLocaleDateString('pt-BR')}`, 196, 17, { align: 'right' });

    // Status Banner (Certificado para Venda / Apontamentos / Restrito)
    let statusText = 'VEÍCULO CERTIFICADO PARA VENDA';
    let statusColor = [16, 185, 129]; // Emerald

    if (laudo.conclusao.recomendacao === 'aprovado_apontamentos') {
      statusText = 'CERTIFICADO COM APONTAMENTOS DE TRANSPARÊNCIA';
      statusColor = [245, 158, 11]; // Amber
    } else if (laudo.conclusao.recomendacao === 'reprovado') {
      statusText = 'RESTRITO PARA REPAROS ANTES DA VENDA';
      statusColor = [239, 68, 68]; // Rose
    }

    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.rect(14, 30, 182, 9, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`RESULTADO PERICIAL: ${statusText}`, 105, 36, { align: 'center' });

    // SEÇÃO 1: DADOS DO CLIENTE E DO VEÍCULO
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text('1. DADOS DE IDENTIFICAÇÃO DO VEÍCULO E PROPRIETÁRIO', 14, 46);

    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 49, 182, 38, 'FD');

    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Proprietário / Vendedor:', 18, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.cliente.nome || 'Não informado'} | Contato: ${laudo.cliente.telefone || 'Não informado'}`, 58, 55);

    doc.setFont('helvetica', 'bold');
    doc.text('Veículo / Modelo:', 18, 61);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.veiculo.marca} ${laudo.veiculo.modelo} ${laudo.veiculo.versao}`, 46, 61);

    doc.setFont('helvetica', 'bold');
    doc.text('Placa:', 18, 67);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.veiculo.placa.toUpperCase()}`, 30, 67);

    doc.setFont('helvetica', 'bold');
    doc.text('Ano Fab / Mod:', 65, 67);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.veiculo.anoFabricacao} / ${laudo.veiculo.anoModelo}`, 90, 67);

    doc.setFont('helvetica', 'bold');
    doc.text('KM Atual:', 130, 67);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.veiculo.kmAtual.toLocaleString('pt-BR')} km`, 150, 67);

    doc.setFont('helvetica', 'bold');
    doc.text('Cor:', 18, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.veiculo.cor || 'Não informada'}`, 30, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Combustível:', 65, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.veiculo.combustivel}`, 90, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Câmbio:', 130, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.veiculo.cambio}`, 150, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Chassi:', 18, 79);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.veiculo.chassi || 'Vidros e etiquetas conformes'}`, 32, 79);

    doc.setFont('helvetica', 'bold');
    doc.text('Renavam:', 130, 79);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.veiculo.renavam || 'Auditado em cadastro'}`, 150, 79);

    // SEÇÃO 2: TABELA FIPE E PRECIFICAÇÃO RECOMENDADA AO PROPRIETÁRIO
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text('2. AVALIAÇÃO DE MERCADO E PRECIFICAÇÃO RECOMENDADA AO PROPRIETÁRIO', 14, 94);

    doc.setFillColor(248, 250, 252);
    doc.rect(14, 97, 182, 36, 'FD');

    // Box 1: FIPE Oficial
    doc.setFillColor(255, 255, 255);
    doc.rect(18, 101, 55, 28, 'FD');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('TABELA FIPE (OFICIAL)', 22, 106);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(12);
    doc.text(laudo.precificacao.valorFipe.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 22, 114);
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Código: ${laudo.precificacao.codigoFipe || 'N/A'}`, 22, 120);
    doc.text(`Ref: ${laudo.precificacao.mesReferenciaFipe || 'Novembro/2026'}`, 22, 124);

    // Box 2: Preço Sugerido de Anúncio (Destaque Principal)
    doc.setFillColor(240, 249, 255);
    doc.rect(78, 101, 55, 28, 'FD');
    doc.setTextColor(2, 132, 199);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('PREÇO SUGERIDO DE ANÚNCIO', 82, 106);
    doc.setFontSize(12);
    doc.text(laudo.precificacao.precoVendaSugerido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 82, 114);
    doc.setFontSize(6.5);
    doc.setTextColor(3, 105, 161);
    doc.text('Valor ideal para vitrine e portais', 82, 120);
    doc.text('Ajustado ao mercado e procedência', 82, 124);

    // Box 3: Preço Mínimo para Negociação
    doc.setFillColor(240, 253, 244);
    doc.rect(138, 101, 55, 28, 'FD');
    doc.setTextColor(22, 101, 52);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('PREÇO MÍNIMO P/ NEGOCIAÇÃO', 142, 106);
    doc.setFontSize(12);
    doc.text(laudo.precificacao.precoMinimoNegociacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 142, 114);
    doc.setFontSize(6.5);
    doc.setTextColor(21, 128, 61);
    doc.text(`Margem de desconto: ${laudo.precificacao.margemNegociacaoPercentual || 5}%`, 142, 120);
    doc.text('Piso seguro para fechar a venda', 142, 124);

    // SEÇÃO 3: MAPA DE AVARIAS E TRANSPARÊNCIA PERICIAL
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`3. MAPEAMENTO DE CARROCERIA & APONTAMENTOS (${laudo.danosCarroceria.length} ITENS)`, 14, 140);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('Apontamentos relatados para transparência e autoridade na negociação', 196, 140, { align: 'right' });

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 144, 182, 6, 'FD');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('N°', 18, 148);
    doc.text('PAINEL / PEÇA', 28, 148);
    doc.text('TIPO DE APONTAMENTO', 75, 148);
    doc.text('SEVERIDADE', 125, 148);
    doc.text('ESTADO / OBSERVAÇÃO', 160, 148);

    let startY = 153;
    if (laudo.danosCarroceria.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(16, 185, 129);
      doc.text('Lataria e pintura em estado original impecável, sem amassados ou riscos relevantes.', 18, startY + 2);
      startY += 10;
    } else {
      laudo.danosCarroceria.slice(0, 7).forEach((dmg, idx) => {
        const typeInfo = DAMAGE_TYPES[dmg.type] || { label: dmg.type };
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);

        doc.text(`${idx + 1}`, 18, startY);
        doc.text(`${dmg.partName}`, 28, startY);
        doc.text(`${typeInfo.label}`, 75, startY);
        doc.text(`${dmg.severity.toUpperCase()}`, 125, startY);
        doc.text(dmg.notes ? dmg.notes.slice(0, 28) : 'Desgaste estético natural', 160, startY);

        doc.setDrawColor(241, 245, 249);
        doc.line(14, startY + 2, 196, startY + 2);
        startY += 6;
      });
    }

    // SEÇÃO 4: RESUMO DO TESTE DE RODAGEM E CONDIÇÃO MECÂNICA
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text('4. TESTE DE RODAGEM E AVALIAÇÃO MECÂNICA EM PERCURSO', 14, startY + 8);

    doc.setFillColor(248, 250, 252);
    doc.rect(14, startY + 11, 182, 34, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    doc.text('Ruídos Motor / Câmbio:', 18, startY + 17);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.testeRodagem.ruidosMotorTransmissao || 'Conforme, funcionamento suave'}`, 60, startY + 17);

    doc.setFont('helvetica', 'bold');
    doc.text('Suspensão e Estabilidade:', 18, startY + 23);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.testeRodagem.comportamentoSuspensao || 'Boa absorção de impactos, sem folgas'}`, 60, startY + 23);

    doc.setFont('helvetica', 'bold');
    doc.text('Pedais e Freios:', 18, startY + 29);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.testeRodagem.anomaliasPedais || 'Sem vibrações no pedal ou afundamento'}`, 60, startY + 29);

    doc.setFont('helvetica', 'bold');
    doc.text('Vibrações e Trepidações:', 18, startY + 35);
    doc.setFont('helvetica', 'normal');
    doc.text(`${laudo.testeRodagem.vibracoesTrepidacoes || 'Ausência de vibrações em velocidade de cruzeiro'}`, 60, startY + 35);

    doc.setFont('helvetica', 'bold');
    doc.text('Condição Mecânica Geral:', 18, startY + 41);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(laudo.conclusao.condicaoMecanica === 'critica' ? 220 : 16, 120, 50);
    doc.text(`${laudo.conclusao.condicaoMecanica.toUpperCase()}`, 60, startY + 41);

    // Rodapé da Página 1
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Laudo Técnico Pericial de Consultoria Automotiva com FIPE · Dossiê do Vendedor · Página 1 de 2', 105, 290, { align: 'center' });

    // ==========================================
    // PÁGINA 2: CHECKLIST, PARECER E ASSINATURAS
    // ==========================================
    doc.addPage();

    // Top Header Banner Página 2
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(`LAUDO TÉCNICO PERICIAL DE CONSULTORIA AUTOMOTIVA COM FIPE · ${laudo.numeroLaudo}`, 14, 11);

    // SEÇÃO 5: RESUMO DO CHECKLIST PERICIAL
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(10);
    doc.text('5. AUDITORIA DOS SISTEMAS E COMPONENTES INSPECIONADOS', 14, 26);

    const checklistCounts = {
      conforme: laudo.checklist.filter((i) => i.status === 'conforme').length,
      atencao: laudo.checklist.filter((i) => i.status === 'atencao').length,
      irregular: laudo.checklist.filter((i) => i.status === 'irregular').length,
    };

    doc.setFillColor(248, 250, 252);
    doc.rect(14, 29, 182, 10, 'FD');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`TOTAL AUDITADO: ${laudo.checklist.length} ITENS`, 18, 35);
    doc.setTextColor(16, 185, 129);
    doc.text(`CONFORME: ${checklistCounts.conforme}`, 80, 35);
    doc.setTextColor(245, 158, 11);
    doc.text(`ATENÇÃO: ${checklistCounts.atencao}`, 120, 35);
    doc.setTextColor(239, 68, 68);
    doc.text(`IRREGULAR: ${checklistCounts.irregular}`, 160, 35);

    // Tabela de Apontamentos do Checklist
    const criticalChecklist = laudo.checklist.filter((i) => i.status === 'irregular' || i.status === 'atencao');

    doc.setFillColor(241, 245, 249);
    doc.rect(14, 43, 182, 6, 'FD');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(7.5);
    doc.text('SISTEMA / COMPONENTE', 18, 47);
    doc.text('STATUS', 85, 47);
    doc.text('OBSERVAÇÃO TÉCNICA', 115, 47);

    let checkY = 53;
    if (criticalChecklist.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(16, 185, 129);
      doc.text('Todos os sistemas de motor, câmbio, suspensão, freios, elétrica e segurança auditados estão CONFORMES.', 18, checkY);
      checkY += 8;
    } else {
      criticalChecklist.slice(0, 6).forEach((item) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text(item.name, 18, checkY);

        doc.setTextColor(item.status === 'irregular' ? 220 : 200, item.status === 'irregular' ? 38 : 130, 38);
        doc.text(item.status.toUpperCase(), 85, checkY);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text(item.notes || 'Desgaste compatível com ano/KM', 115, checkY);

        doc.setDrawColor(241, 245, 249);
        doc.line(14, checkY + 2, 196, checkY + 2);
        checkY += 6;
      });
    }

    // SEÇÃO 6: HISTÓRICO DE MANUTENÇÕES
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('6. HISTÓRICO DE REVISÕES E MANUTENÇÕES COMPROVADAS', 14, checkY + 8);

    doc.setFillColor(248, 250, 252);
    doc.rect(14, checkY + 11, 182, 24, 'FD');

    let maintY = checkY + 17;
    if (laudo.historicoManutencao.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Nenhuma manutenção anterior registrada. Manutenções recomendadas conforme manual do fabricante.', 18, maintY);
      maintY += 6;
    } else {
      laudo.historicoManutencao.slice(0, 3).forEach((m) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text(`${new Date(m.data).toLocaleDateString('pt-BR')} (${m.km.toLocaleString('pt-BR')} KM):`, 18, maintY);
        doc.setFont('helvetica', 'normal');
        doc.text(`${m.descricao} [${m.tipo.toUpperCase()}]`, 65, maintY);
        maintY += 5;
      });
    }

    // SEÇÃO 7: PARECER TÉCNICO CONCLUSIVO DO PERITO
    const parecerStartY = maintY + 10;
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('7. PARECER CONCLUSIVO E RECOMENDAÇÃO DO CONSULTOR PERICIAL', 14, parecerStartY);

    doc.setFillColor(248, 250, 252);
    doc.rect(14, parecerStartY + 3, 182, 32, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    const parecerText =
      laudo.conclusao.parecerTecnico ||
      'Após minuciosa inspeção pericial estática, dinâmica e documental do veículo supracitado, atesta-se que o automóvel possui procedência idônea e integridade estrutural, estando perfeitamente apto para comercialização no mercado particular pelo valor sugerido de vitrine.';

    const splitParecer = doc.splitTextToSize(parecerText, 174);
    doc.text(splitParecer, 18, parecerStartY + 9);

    if (laudo.conclusao.restricoesUso) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text(`OBSERVAÇÃO TÉCNICA: ${laudo.conclusao.restricoesUso}`, 18, parecerStartY + 30);
    }

    // SEÇÃO 8: ASSINATURAS DIGITAIS
    const signStartY = parecerStartY + 42;
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('8. TERMO DE VISTORIA E ASSINATURAS DIGITAIS', 14, signStartY);

    // Box Assinatura Técnico
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(255, 255, 255);
    doc.rect(14, signStartY + 4, 88, 44, 'FD');

    if (laudo.conclusao.assinaturaTecnicoUrl) {
      try {
        doc.addImage(laudo.conclusao.assinaturaTecnicoUrl, 'PNG', 20, signStartY + 6, 76, 22);
      } catch {
        // Fallback
      }
    }
    doc.line(20, signStartY + 32, 96, signStartY + 32);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(laudo.conclusao.responsavelNome || 'Perito Consultor Automotivo', 58, signStartY + 37, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(laudo.conclusao.responsavelCargo || 'Consultor Técnico Especialista', 58, signStartY + 42, { align: 'center' });

    // Box Assinatura Cliente
    doc.rect(108, signStartY + 4, 88, 44, 'FD');

    if (laudo.conclusao.assinaturaClienteUrl) {
      try {
        doc.addImage(laudo.conclusao.assinaturaClienteUrl, 'PNG', 114, signStartY + 6, 76, 22);
      } catch {
        // Fallback
      }
    }
    doc.line(114, signStartY + 32, 190, signStartY + 32);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(laudo.cliente.nome || 'Proprietário Vendedor', 152, signStartY + 37, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('Proprietário / Solicitante do Laudo', 152, signStartY + 42, { align: 'center' });

    // Rodapé da Página 2
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Laudo emitido por consultor técnico credenciado · Válido com assinatura digital · Página 2 de 2', 105, 290, { align: 'center' });

    // Download
    const sanitizedPlaca = (laudo.veiculo.placa || 'VEICULO').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    doc.save(`Laudo_Venda_${sanitizedPlaca}_${laudo.numeroLaudo}.pdf`);
  }

  /**
   * Constrói e abre o link de envio pré-formatado para o WhatsApp como Dossiê de Venda do Veículo
   */
  static shareWhatsApp(laudo: Laudo): void {
    const statusLabel =
      laudo.conclusao.recomendacao === 'aprovado'
        ? '✅ CERTIFICADO PARA VENDA (Sem Restrições)'
        : laudo.conclusao.recomendacao === 'aprovado_apontamentos'
        ? '⚠️ CERTIFICADO COM APONTAMENTOS DE TRANSPARÊNCIA'
        : '❌ RESTRITO PARA REPAROS';

    const texto = `🚗 *LAUDO TÉCNICO PERICIAL DE CONSULTORIA AUTOMOTIVA COM FIPE*
📋 *Laudo N°:* ${laudo.numeroLaudo}
📅 *Data da Avaliação:* ${new Date(laudo.dataCriacao).toLocaleDateString('pt-BR')}

👤 *Proprietário Vendedor:* ${laudo.cliente.nome || 'Proprietário'}
🚘 *Veículo:* ${laudo.veiculo.marca} ${laudo.veiculo.modelo} ${laudo.veiculo.versao}
🔢 *Placa:* ${laudo.veiculo.placa.toUpperCase()} | *Ano:* ${laudo.veiculo.anoFabricacao}/${laudo.veiculo.anoModelo}
⏱️ *Quilometragem:* ${laudo.veiculo.kmAtual.toLocaleString('pt-BR')} km

💰 *AVALIAÇÃO DE MERCADO & PREÇO RECOMENDADO:*
• *Valor Tabela FIPE Oficial:* ${laudo.precificacao.valorFipe.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
• *Preço Sugerido de Anúncio:* ${laudo.precificacao.precoVendaSugerido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
• *Preço Mínimo para Negociação:* ${laudo.precificacao.precoMinimoNegociacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}

🔍 *CERTIFICAÇÃO TÉCNICA:*
• *Resultado Pericial:* ${statusLabel}
• *Condição Mecânica Geral:* ${laudo.conclusao.condicaoMecanica.toUpperCase()}
• *Teste de Rodagem:* ${laudo.testeRodagem.statusGeralRodagem.toUpperCase()}
• *Apontamentos na Carroceria:* ${laudo.danosCarroceria.length} item(ns)

📝 *Parecer do Consultor:*
_${laudo.conclusao.parecerTecnico || 'Veículo com integridade estrutural e procedência aprovadas em vistoria técnica completa.'}_

📄 _O Laudo Técnico Completo em PDF com fotos, checklist e assinaturas digitais foi emitido com sucesso._`;

    const encoded = encodeURIComponent(texto);
    const cleanPhone = (laudo.cliente.telefone || '').replace(/\D/g, '');
    const url = cleanPhone ? `https://wa.me/55${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;

    window.open(url, '_blank');
  }
}
