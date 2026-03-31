import { CV_DATA } from '../../lib/cv-data.js'
import VerdictTool from '../../components/VerdictTool.jsx'
import Header from '../../components/Header.jsx'
import Footer from '../../components/Footer.jsx'

export const metadata = {
  title: 'CompVerdict — ¿Vale la pena esta oferta?',
  description: 'Introduce tu oferta salarial y obtén un veredicto instantáneo basado en datos. Sabe si te están pagando por debajo del mercado antes de firmar.',
  alternates: {
    canonical: 'https://comp-verdict.netlify.app/es/',
    languages: {
      'en': 'https://comp-verdict.netlify.app/',
      'es': 'https://comp-verdict.netlify.app/es/',
      'de': 'https://comp-verdict.netlify.app/de/',
      'x-default': 'https://comp-verdict.netlify.app/',
    },
  },
}

export default function EsHomePage() {
  return (
    <>
      <Header locale="es" currentPath="/es/" />
      <VerdictTool cvData={CV_DATA} locale="es" />
      <Footer locale="es" />
    </>
  )
}
