// Email service exports
// This file is a placeholder for future email service implementation

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  async sendEmail(options: EmailOptions): Promise<void> {
    // Placeholder implementation
    console.log('Email would be sent:', options);
  }
}

export const emailService = new EmailService();