/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { AuthEmail, langsOf, type AuthCopy, type AuthLang } from './i18n.tsx'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
  lang?: string
}

export const MagicLinkEmail = ({ confirmationUrl, lang }: MagicLinkEmailProps) => {
  const copy: Record<AuthLang, AuthCopy> = {
    en: {
      preview: 'Your Sofara login link',
      title: 'Your login link',
      intro: 'Click the button below to log in to your Sofara account. This link expires shortly.',
      footer: "If you didn't request this link, you can safely ignore this email.",
      button: 'Log in',
    },
    fr: {
      preview: 'Votre lien de connexion Sofara',
      title: 'Votre lien de connexion',
      intro: 'Cliquez sur le bouton ci-dessous pour vous connecter à votre compte Sofara. Ce lien expire rapidement.',
      footer: "Si vous n'avez pas demandé ce lien, vous pouvez ignorer cet email.",
      button: 'Se connecter',
    },
  }
  return <AuthEmail langs={langsOf(lang)} copy={copy} buttonHref={confirmationUrl} />
}

export default MagicLinkEmail
