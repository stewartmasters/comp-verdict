import './globals.css'

export const metadata = {
  metadataBase: new URL('https://comp-verdict.netlify.app'),
  title: 'CompVerdict — Is this offer worth taking?',
  description: 'Enter your salary offer and get an instant data-backed verdict. Know if you\'re being underpaid before you sign.',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
