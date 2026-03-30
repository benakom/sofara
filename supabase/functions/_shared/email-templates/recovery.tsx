/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your Sofara password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logoText}>SOFARA</Text>
        </Section>
        <Hr style={divider} />
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>
          We received a request to reset your password for your Sofara account.
          Click the button below to choose a new password.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={confirmationUrl}>
            Reset Password
          </Button>
        </Section>
        <Text style={footer}>
          If you didn't request a password reset, you can safely ignore this
          email. Your password will not be changed.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

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
const buttonContainer = { textAlign: 'center' as const, margin: '8px 0 28px' }
const button = {
  backgroundColor: '#D3F34B',
  color: '#0d3a2b',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  borderRadius: '12px',
  padding: '14px 28px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#9ca3af', margin: '20px 0 0' }
