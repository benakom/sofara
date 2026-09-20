/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Link } from 'npm:@react-email/components@0.0.22'
import { AuthEmail, langsOf, styles, type AuthCopy, type AuthLang } from './i18n.tsx'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
  token?: string
  lang?: string
}

export const SignupEmail = ({ recipient, token, lang }: SignupEmailProps) => {
  const mail = (
    <Link href={`mailto:${recipient}`} style={styles.link}>
      {recipient}
    </Link>
  )
  const copy: Record<AuthLang, AuthCopy> = {
    en: {
      preview: 'Your Sofara verification code',
      title: 'Your verification code',
      intro: <>Thanks for signing up! Copy the code below and paste it on the Sofara sign-up page to activate your ambassador space for {mail}.</>,
      note: 'The code expires in 1 hour. If you requested several codes, only the one from the most recent email works.',
      footer: "If you didn't create an account on Sofara, you can safely ignore this email.",
    },
    fr: {
      preview: 'Votre code de vérification Sofara',
      title: 'Votre code de vérification',
      intro: <>Merci pour votre inscription ! Copiez le code ci-dessous et collez-le sur la page d'inscription Sofara pour activer votre espace ambassadeur pour {mail}.</>,
      note: "Le code expire dans 1 heure. Si vous avez demandé plusieurs codes, seul celui du dernier email fonctionne.",
      footer: "Si vous n'avez pas créé de compte sur Sofara, vous pouvez ignorer cet email.",
    },
  }
  return <AuthEmail langs={langsOf(lang)} copy={copy} code={token} />
}

export default SignupEmail
