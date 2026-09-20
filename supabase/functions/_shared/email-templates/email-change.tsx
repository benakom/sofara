/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Link } from 'npm:@react-email/components@0.0.22'
import { AuthEmail, langsOf, styles, type AuthCopy, type AuthLang } from './i18n.tsx'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
  lang?: string
}

export const EmailChangeEmail = ({ email, newEmail, confirmationUrl, lang }: EmailChangeEmailProps) => {
  const from = <Link href={`mailto:${email}`} style={styles.link}>{email}</Link>
  const to = <Link href={`mailto:${newEmail}`} style={styles.link}>{newEmail}</Link>
  const copy: Record<AuthLang, AuthCopy> = {
    en: {
      preview: 'Confirm your email change for Sofara',
      title: 'Confirm your email change',
      intro: <>You requested to change the email address of your Sofara account from {from} to {to}.</>,
      footer: "If you didn't request this change, secure your account immediately and write to hello@sofara.io.",
      button: 'Confirm email change',
    },
    fr: {
      preview: 'Confirmez le changement d\'email de votre compte Sofara',
      title: 'Confirmez votre changement d\'email',
      intro: <>Vous avez demandé à changer l'adresse email de votre compte Sofara de {from} vers {to}.</>,
      footer: "Si vous n'êtes pas à l'origine de cette demande, sécurisez votre compte immédiatement et écrivez à hello@sofara.io.",
      button: 'Confirmer le changement',
    },
  }
  return <AuthEmail langs={langsOf(lang)} copy={copy} buttonHref={confirmationUrl} />
}

export default EmailChangeEmail
