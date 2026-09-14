/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
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
  siteUrl,
  recipient,
  confirmationUrl,
  token,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Verify your email to join Sofara</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logoText}>SOFARA</Text>
        </Section>
        <Hr style={divider} />
        <Heading style={h1}>Welcome to Sofara 🎉</Heading>
        <Text style={text}>
          Thanks for signing up! You're one step away from accessing the
          ambassador platform.
        </Text>
        <Text style={text}>
          Please confirm your email address (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) by clicking the button below:
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={confirmationUrl}>
            Verify my email
          </Button>
        </Section>
        {token && (
          <>
            <Text style={text}>
              Or enter this verification code on the sign-up page:
            </Text>
            <Section style={codeBox}>
              <Text style={codeText}>{token}</Text>
            </Section>
          </>
        )}
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
