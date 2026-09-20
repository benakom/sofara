/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { AuthEmail, langsOf, type AuthCopy, type AuthLang } from './i18n.tsx'

interface ReauthenticationEmailProps {
  token: string
  lang?: string
}

export const ReauthenticationEmail = ({ token, lang }: ReauthenticationEmailProps) => {
  const copy: Record<AuthLang, AuthCopy> = {
    en: {
      preview: 'Your Sofara verification code',
      title: 'Verification code',
      intro: 'Use the code below to confirm your identity:',
      footer: "This code expires shortly. If you didn't request it, you can safely ignore this email.",
    },
    fr: {
      preview: 'Votre code de vérification Sofara',
      title: 'Code de vérification',
      intro: 'Utilisez le code ci-dessous pour confirmer votre identité :',
      footer: "Ce code expire rapidement. Si vous ne l'avez pas demandé, vous pouvez ignorer cet email.",
    },
  }
  return <AuthEmail langs={langsOf(lang)} copy={copy} code={token} />
}

export default ReauthenticationEmail
