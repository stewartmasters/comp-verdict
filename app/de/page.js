import { CV_DATA } from '../../lib/cv-data.js'
import VerdictTool from '../../components/VerdictTool.jsx'
import Header from '../../components/Header.jsx'
import Footer from '../../components/Footer.jsx'

export const metadata = {
  title: 'CompVerdict — Ist dieses Angebot die Annahme wert?',
  description: 'Gib dein Gehaltsangebot ein und erhalte sofort ein datenbasiertes Urteil. Erfahre, ob du unter Marktniveau bezahlt wirst, bevor du unterschreibst.',
  alternates: {
    canonical: 'https://comp-verdict.netlify.app/de/',
    languages: {
      'en': 'https://comp-verdict.netlify.app/',
      'es': 'https://comp-verdict.netlify.app/es/',
      'de': 'https://comp-verdict.netlify.app/de/',
      'x-default': 'https://comp-verdict.netlify.app/',
    },
  },
}

export default function DeHomePage() {
  return (
    <>
      <Header locale="de" currentPath="/de/" />
      <VerdictTool cvData={CV_DATA} locale="de" />
      <Footer locale="de" />
    </>
  )
}
