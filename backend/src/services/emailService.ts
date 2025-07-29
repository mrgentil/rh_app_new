import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT || process.env.EMAIL_PORT || '587'),
      secure: false, // true pour 465, false pour les autres ports
      auth: {
        user: process.env.MAIL_USERNAME || process.env.EMAIL_USER,
        pass: process.env.MAIL_PASSWORD || process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Envoyer un email de changement de mot de passe
  async sendPasswordResetEmail(email: string, username: string, resetToken: string): Promise<void> {
    if (!email || !email.includes('@')) {
      throw new Error('Email invalide pour l\'envoi');
    }

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: '"RH App" <noreply@rhapp.com>',
      to: email,
      subject: 'Activation de votre compte - Définissez votre mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Bienvenue dans RH App !</h2>
          <p>Bonjour ${username},</p>
          <p>Un compte utilisateur a été créé pour vous dans notre système RH.</p>
          <p><strong>Votre compte est actuellement inactif.</strong></p>
          <p>Pour activer votre compte et définir votre mot de passe, veuillez cliquer sur le lien ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Définir mon mot de passe
            </a>
          </div>
          <p>Ce lien expirera dans 24 heures.</p>
          <p>Si vous n'avez pas demandé la création de ce compte, veuillez ignorer cet email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de création de compte envoyé à ${email}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw new Error('Impossible d\'envoyer l\'email de création de compte');
    }
  }

  // Envoyer un email de notification de suspension
  async sendAccountSuspendedEmail(email: string, username: string, reason?: string): Promise<void> {
    if (!email || !email.includes('@')) {
      throw new Error('Email invalide pour l\'envoi');
    }

    const mailOptions = {
      from: '"RH App" <noreply@rhapp.com>',
      to: email,
      subject: 'Votre compte a été suspendu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Compte suspendu</h2>
          <p>Bonjour ${username},</p>
          <p>Votre compte utilisateur a été suspendu par un administrateur.</p>
          ${reason ? `<p><strong>Raison :</strong> ${reason}</p>` : ''}
          <p>Vous ne pouvez plus accéder au système jusqu'à ce que votre compte soit réactivé.</p>
          <p>Si vous pensez qu'il s'agit d'une erreur, veuillez contacter votre administrateur système.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de suspension envoyé à ${email}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de suspension:', error);
      throw new Error('Impossible d\'envoyer l\'email de suspension');
    }
  }

  // Envoyer un email de notification de suppression
  async sendAccountDeletedEmail(email: string, username: string): Promise<void> {
    if (!email || !email.includes('@')) {
      throw new Error('Email invalide pour l\'envoi');
    }

    const mailOptions = {
      from: '"RH App" <noreply@rhapp.com>',
      to: email,
      subject: 'Votre compte a été supprimé',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Compte supprimé</h2>
          <p>Bonjour ${username},</p>
          <p>Votre compte utilisateur a été définitivement supprimé du système RH.</p>
          <p>Vous ne pouvez plus accéder à l'application.</p>
          <p>Si vous pensez qu'il s'agit d'une erreur, veuillez contacter votre administrateur système.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de suppression envoyé à ${email}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de suppression:', error);
      throw new Error('Impossible d\'envoyer l\'email de suppression');
    }
  }

  // Envoyer un email de notification de réactivation
  async sendAccountReactivatedEmail(email: string, username: string): Promise<void> {
    if (!email || !email.includes('@')) {
      throw new Error('Email invalide pour l\'envoi');
    }

    const mailOptions = {
      from: '"RH App" <noreply@rhapp.com>',
      to: email,
      subject: 'Votre compte a été réactivé',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Compte réactivé</h2>
          <p>Bonjour ${username},</p>
          <p>Votre compte utilisateur a été réactivé par un administrateur.</p>
          <p>Vous pouvez maintenant vous connecter à l'application avec vos identifiants habituels.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
               style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Se connecter
            </a>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de réactivation envoyé à ${email}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de réactivation:', error);
      throw new Error('Impossible d\'envoyer l\'email de réactivation');
    }
  }

  // Générer un token de réinitialisation de mot de passe
  generateResetToken(userId: number, email: string): string {
    return jwt.sign(
      { userId, email, type: 'password_reset' },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  // Vérifier un token de réinitialisation
  verifyResetToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }
}

export const emailService = new EmailService(); 