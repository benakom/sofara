/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Link } from 'npm:@react-email/components@0.0.22'
import { AuthEmail, langsOf, styles, type AuthCopy, type AuthLang } from './i18n.tsx'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
  lang?: string
}

export const InviteEmail = ({ siteUrl, confirmationUrl, lang }: InviteEmailProps) => {
  const site = (
    <Link href={siteUrl} style={styles.link}>
      <strong>Sofara</strong>
    </Link>
  )
  const copy: Record<AuthLang, AuthCopy> = {
    en: {
      preview: "You've been invited to join Sofara",
      title: "You've been invited",
      intro: <>You've been invited to join {site}, the Dubai real estate ambassador platform. Click below to accept and create your account.</>,
      footer: "If you weren't expecting this invitation, you can safely ignore this email.",
      button: 'Accept invitation',
    },
    fr: {
      preview: 'Vous êtes invité à rejoindre Sofara',
      title: 'Vous êtes invité',
      intro: <>Vous êtes invité à rejoindre {site}, la plateforme d'ambassadeurs immobiliers de Dubaï. Cliquez ci-dessous pour accepter et créer votre compte.</>,
      footer: "Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.",
      button: "Accepter l'invitation",
    },
  }
  return <AuthEmail langs={langsOf(lang)} copy={copy} buttonHref={confirmationUrl} />
}

export default InviteEmail
