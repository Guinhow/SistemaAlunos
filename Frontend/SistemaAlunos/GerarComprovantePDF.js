import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export const gerarComprovantePDF = async (pagamento) => {
  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #c40000; }
          .info { margin-bottom: 8px; font-size: 16px; }
          .footer { margin-top: 30px; font-size: 13px; color: #555; }
        </style>
      </head>
      <body>
        <h1>Comprovante de Pagamento</h1>
        <div class="info"><strong>Aluno:</strong> ${pagamento.contrato.aluno.nome}</div>
        <div class="info"><strong>Turma:</strong> ${pagamento.contrato.turma.nome}</div>
        <div class="info"><strong>Parcela:</strong> ${pagamento.numeroParcela} de ${pagamento.contrato.parcelas}</div>
        <div class="info"><strong>Valor:</strong> R$ ${pagamento.valor.toFixed(2)}</div>
        <div class="info"><strong>Data de Pagamento:</strong> ${pagamento.dataPagamento}</div>
        <div class="footer">Comprovante gerado automaticamente pelo sistema.</div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error('Erro ao gerar comprovante PDF:', error);
  }
};
