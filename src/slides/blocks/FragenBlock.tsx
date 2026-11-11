import { Slide } from '@revealjs/react'
import nanaAvatar from '../assets/techworld-with-nana.jpg'
import { BlockStack } from '../BlockStack'
import { CenteredLayout } from '../CenteredLayout'
import { SCHEDULE } from '../schedule'
import { SectionSlide } from '../SectionSlide'

const BLOCK_ID = 'fragen'

const end = SCHEDULE[SCHEDULE.length - 1].end

// Zum Weiterlernen nach dem Workshop, ohne die Tracking-Parameter der Teilen-Links.
const NANA_CHANNEL = 'https://www.youtube.com/@TechWorldwithNana'
const nanaVideos = [
  {
    title: 'Docker Crash Course for Absolute Beginners',
    url: 'https://youtu.be/pg19Z8LL06w',
  },
  {
    title: 'Docker Tutorial for Beginners [FULL COURSE in 3 Hours]',
    url: 'https://youtu.be/3c-iBn73dDE',
  },
]

/** Block „Fragen“: offene Fragen, dann der Abschied mit Tipps zum Weiterlernen. */
export function FragenBlock() {
  return (
    <BlockStack>
      <SectionSlide blockId={BLOCK_ID} />

      <Slide>
        <CenteredLayout>
          <p className="eyebrow">Ende um {end}</p>
          <h2 className="section-title">Danke fürs Mitmachen!</h2>
          <div className="further">
            <img className="further__avatar" src={nanaAvatar} alt="" />
            <div>
              <p className="further__label">Zum Weiterlernen auf YouTube</p>
              <p className="further__channel">
                <a href={NANA_CHANNEL} target="_blank" rel="noreferrer">
                  TechWorld with Nana
                </a>{' '}
                <span className="further__handle">@TechWorldwithNana</span>
              </p>
              <ul className="further__videos">
                {nanaVideos.map((video) => (
                  <li key={video.url}>
                    <a href={video.url} target="_blank" rel="noreferrer">
                      {video.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CenteredLayout>
      </Slide>
    </BlockStack>
  )
}
