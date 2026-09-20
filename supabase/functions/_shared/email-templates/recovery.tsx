/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { AuthEmail, langsOf, type AuthCopy, type AuthLang } from './i18n.tsx'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
  lang?: string
}

export const RecoveryEmail = ({ confirmationUrl, lang }: RecoveryEmailProps) => {
  const copy: Record<AuthLang, AuthCopy> = {
    en: {
      preview: 'Reset your Sofara password',
      title: 'Reset your password',
      intro: 'We received a request to reset the password of your Sofara account. Click the button below to choose a new password.',
      footer: "If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.",
      button: 'Reset password',
    },
    fr: {
      preview: 'Réinitialisez votre mot de passe Sofara',
      title: 'Réinitialisez votre mot de passe',
      intro: 'Nous avons reçu une demande de réinitialisation du mot de passe de votre compte Sofara. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.',
      footer: "Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. Votre mot de passe ne sera pas modifié.",
      button: 'Réinitialiser le mot de passe',
    },
  }
  return <AuthEmail langs={langsOf(lang)} copy={copy} buttonHref={confirmationUrl} />
}

export default RecoveryEmail
