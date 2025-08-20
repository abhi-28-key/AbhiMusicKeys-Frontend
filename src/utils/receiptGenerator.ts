interface ReceiptData {
  userName: string;
  userEmail: string;
  planName: string;
  amount: number;
  currency: string;
  paymentId: string;
  orderId: string;
  purchaseDate: Date;
  planDuration: string;
}

export const generateReceiptText = (data: ReceiptData): string => {
  const receiptText = `
╔══════════════════════════════════════════════════════════════╗
║                    ABHIMUSICKEYS                             ║
║                 Your Journey to Piano Mastery                ║
╠══════════════════════════════════════════════════════════════╣
║                        PAYMENT RECEIPT                       ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Receipt Details:                                            ║
║  Date: ${data.purchaseDate.toLocaleDateString()}                    ║
║  Time: ${data.purchaseDate.toLocaleTimeString()}                    ║
║  Receipt #: ${data.paymentId}                                ║
║  Order #: ${data.orderId}                                     ║
║                                                              ║
║  Customer Information:                                        ║
║  Name: ${data.userName}                                       ║
║  Email: ${data.userEmail}                                     ║
║                                                              ║
║  Purchase Details:                                            ║
║  ┌─────────────────┬─────────────────┬─────────────────────┐ ║
║  │ Item            │ Duration        │ Amount              │ ║
║  ├─────────────────┼─────────────────┼─────────────────────┤ ║
║  │ ${data.planName.padEnd(15)} │ ${data.planDuration.padEnd(15)} │ ${data.currency} ${data.amount.toLocaleString().padEnd(15)} │ ║
║  └─────────────────┴─────────────────┴─────────────────────┘ ║
║                                                              ║
║  Total: ${data.currency} ${data.amount.toLocaleString()}                    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Thank you for choosing AbhiMusicKeys!                      ║
║  Start your musical journey today.                          ║
║  For support: abhimusickeys@gmail.com                       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`;

  return receiptText;
};

export const downloadReceipt = (data: ReceiptData, filename?: string): void => {
  const receiptText = generateReceiptText(data);
  const fileName = filename || `receipt-${data.paymentId}.txt`;
  
  // Create a blob with the receipt text
  const blob = new Blob([receiptText], { type: 'text/plain' });
  
  // Create a download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const getReceiptData = (
  userName: string,
  userEmail: string,
  planName: string,
  amount: number,
  currency: string,
  paymentId: string,
  orderId: string,
  planDuration: string
): ReceiptData => {
  return {
    userName,
    userEmail,
    planName,
    amount,
    currency,
    paymentId,
    orderId,
    purchaseDate: new Date(),
    planDuration
  };
}; 