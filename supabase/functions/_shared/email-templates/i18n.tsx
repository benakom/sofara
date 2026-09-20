/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

// Bilingual (EN / FR) auth emails. Every template renders in the recipient's
// language when it is known, otherwise in both languages in the same email.

export type AuthLang = 'en' | 'fr'
export type LangChoice = AuthLang | 'both'

export const langsOf = (choice?: string | null): AuthLang[] =>
  choice === 'en' ? ['en'] : choice === 'fr' ? ['fr'] : ['en', 'fr']

export const AUTH_SUBJECTS: Record<string, Record<AuthLang, string>> = {
  signup: { en: 'Your Sofara verification code', fr: 'Votre code de vérification Sofara' },
  invite: { en: "You've been invited to Sofara", fr: 'Vous êtes invité à rejoindre Sofara' },
  magiclink: { en: 'Your Sofara login link', fr: 'Votre lien de connexion Sofara' },
  recovery: { en: 'Reset your Sofara password', fr: 'Réinitialisez votre mot de passe Sofara' },
  email_change: { en: 'Confirm your new email', fr: 'Confirmez votre nouvelle adresse email' },
  reauthentication: { en: 'Your Sofara verification code', fr: 'Votre code de vérification Sofara' },
}

export const subjectFor = (type: string, choice?: string | null): string => {
  const s = AUTH_SUBJECTS[type]
  if (!s) return 'Sofara'
  return langsOf(choice).map((l) => s[l]).join(' · ')
}

export interface AuthCopy {
  preview: string
  title: string
  intro: React.ReactNode
  note?: React.ReactNode
  footer: string
  button?: string
}

interface AuthEmailProps {
  langs: AuthLang[]
  copy: Record<AuthLang, AuthCopy>
  /** Code box content, rendered once between the intro and the note. */
  code?: string
  /** Button link, rendered once (label from copy.button, joined when bilingual). */
  buttonHref?: string
}

export const AuthEmail = ({ langs, copy, code, buttonHref }: AuthEmailProps) => {
  const first = copy[langs[0]]
  const buttonLabel = langs.map((l) => copy[l].button).filter(Boolean).join(' · ')
  return (
    <Html lang={langs[0]} dir="ltr">
      <Head />
      <Preview>{langs.map((l) => copy[l].preview).join(' · ')}</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.logoText}>SOFARA</Text>
          </Section>
          <Hr style={styles.divider} />
          {langs.map((l) => (
            <Heading key={`h-${l}`} style={l === langs[0] ? styles.h1 : styles.h1Secondary}>
              {copy[l].title}
            </Heading>
          ))}
          {langs.map((l) => (
            <Text key={`i-${l}`} style={styles.text}>
              {copy[l].intro}
            </Text>
          ))}
          {code && (
            <Section style={styles.codeBox}>
              <Text style={styles.codeText}>{code}</Text>
            </Section>
          )}
          {buttonHref && (
            <Section style={styles.buttonContainer}>
              <Button style={styles.button} href={buttonHref}>
                {buttonLabel || first.button}
              </Button>
            </Section>
          )}
          {langs.map((l) =>
            copy[l].note ? (
              <Text key={`n-${l}`} style={styles.text}>
                {copy[l].note}
              </Text>
            ) : null
          )}
          {langs.map((l) => (
            <Text key={`f-${l}`} style={styles.footer}>
              {copy[l].footer}
            </Text>
          ))}
          <Hr style={styles.divider} />
          <Text style={styles.legal}>
            Sofara · Cevitas Real Estate LLC, Dubai · hello@sofara.io
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const styles = {
  main: { backgroundColor: '#ffffff', fontFamily: "'Poppins', Arial, sans-serif" },
  container: { padding: '40px 25px', maxWidth: '520px', margin: '0 auto' },
  header: { textAlign: 'center' as const, marginBottom: '10px' },
  logoText: { fontSize: '28px', fontWeight: 'bold' as const, color: '#0d3a2b', letterSpacing: '3px', margin: '0' },
  divider: { borderColor: '#e5e7eb', margin: '16px 0 28px' },
  h1: { fontSize: '22px', fontWeight: 'bold' as const, color: '#0d3a2b', margin: '0 0 6px' },
  h1Secondary: { fontSize: '16px', fontWeight: 'bold' as const, color: '#0d3a2b', margin: '0 0 16px' },
  text: { fontSize: '14px', color: '#4b5563', lineHeight: '1.6', margin: '0 0 16px' },
  link: { color: '#0d3a2b', textDecoration: 'underline' },
  footer: { fontSize: '12px', color: '#9ca3af', margin: '12px 0 0' },
  legal: { fontSize: '11px', color: '#9ca3af', margin: '0' },
  codeBox: { backgroundColor: '#f3f4f6', borderRadius: '10px', padding: '14px 20px', margin: '8px 0 24px', textAlign: 'center' as const },
  codeText: { fontSize: '28px', fontWeight: 'bold' as const, letterSpacing: '8px', color: '#0d3a2b', margin: '0' },
  buttonContainer: { textAlign: 'center' as const, margin: '8px 0 24px' },
  button: { backgroundColor: '#0d3a2b', borderRadius: '10px', color: '#ffffff', fontSize: '15px', fontWeight: '600' as const, textDecoration: 'none', padding: '13px 24px', display: 'inline-block' },
}
