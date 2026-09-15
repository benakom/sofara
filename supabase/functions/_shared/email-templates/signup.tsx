/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
  token?: string
}

export const SignupEmail = ({
  siteName,
  recipient,
  token,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Sofara verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logoText}>SOFARA</Text>
        </Section>
        <Hr style={divider} />
        <Heading style={h1}>Your verification code</Heading>
        <Text style={text}>
          Thanks for signing up! Copy the code below and paste it on
          the Sofara sign-up page to activate your ambassador space for{' '}
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          .
        </Text>
        <Section style={codeBox}>
          <Text style={codeText}>{token}</Text>
        </Section>
        <Text style={text}>
          The code expires in 1 hour. If you requested several codes, only the
          one from the most recent email works.
        </Text>
        <Text style={footer}>
          If you didn't create an account on Sofara, you can safely ignore this
          email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Poppins', Arial, sans-serif" }
const container = { padding: '40px 25px', maxWidth: '520px', margin: '0 auto' }
const header = { textAlign: 'center' as const, marginBottom: '10px' }
const logoText = {
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#0d3a2b',
  letterSpacing: '3px',
  margin: '0',
}
const divider = { borderColor: '#e5e7eb', margin: '16px 0 28px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#0d3a2b',
  margin: '0 0 16px',
}
const text = {
  fontSize: '14px',
  color: '#4b5563',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const link = { color: '#0d3a2b', textDecoration: 'underline' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '20px 0 0' }
const codeBox = {
  backgroundColor: '#f3f4f6',
  borderRadius: '10px',
  padding: '14px 20px',
  margin: '8px 0 24px',
  textAlign: 'center' as const,
}
const codeText = {
  fontSize: '28px',
  fontWeight: 'bold' as const,
  letterSpacing: '8px',
  color: '#0d3a2b',
  margin: '0',
}
