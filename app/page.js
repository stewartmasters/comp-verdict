import { CV_DATA } from '../lib/cv-data.js'
import VerdictTool from '../components/VerdictTool.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export const metadata = {
  title: 'CompVerdict — Is this offer worth taking?',
  description: "Enter your salary offer and get an instant data-backed verdict. Know if you're being underpaid before you sign.",
  alternates: {
    canonical: 'https://comp-verdict.netlify.app/',
    languages: {
      'en': 'https://comp-verdict.netlify.app/',
      'es': 'https://comp-verdict.netlify.app/es/',
      'de': 'https://comp-verdict.netlify.app/de/',
      'x-default': 'https://comp-verdict.netlify.app/',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://comp-verdict.netlify.app/',
    title: 'CompVerdict — Is this offer worth taking?',
    description: "Enter your salary offer and get an instant data-backed verdict. Know if you're being underpaid before you sign.",
    images: [{ url: 'https://comp-verdict.netlify.app/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CompVerdict — Is this offer worth taking?',
    description: "Enter your salary offer and get an instant data-backed verdict. Know if you're being underpaid before you sign.",
    images: ['https://comp-verdict.netlify.app/og-image.png'],
  },
}

export default function HomePage() {
  return (
    <>
      <Header locale="en" currentPath="/" />
      <VerdictTool cvData={CV_DATA} locale="en" />
      <Footer locale="en" />
    </>
  )
}
