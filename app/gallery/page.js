import Link from 'next/link';

const panels = [
  {
    state: 'Assam',
    region: 'NORTHEAST',
    title: 'Sattriya dance',
    note: 'A performance tradition shown here through a Sattriya dancer.',
    file: 'assam-sattriya.jpg',
    creator: 'Joydeep Chakraborty',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:A_Sattriya_dancer_performing_the_dance_form_in_Assam,_India.jpg',
  },
  {
    state: 'Bihar',
    region: 'EAST',
    title: 'Madhubani painting',
    note: 'A contemporary Madhubani painting by artist Asha Jha.',
    file: 'bihar-madhubani.jpg',
    creator: 'Alok Kriti',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Asha_Jha_Madhubani_Painting_Bihar_Artist.jpg',
  },
  {
    state: 'Gujarat',
    region: 'WEST',
    title: 'Patan Patola textile',
    note: 'A double ikat textile representing Gujarat’s weaving heritage.',
    file: 'gujarat-patola.jpg',
    creator: 'Jainamishra',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Antique_Patan_Patola_Double_Ikat_Trade_Textile_courtesy_Wovensouls_Collection,_Singapore.jpg',
  },
  {
    state: 'Himachal Pradesh',
    region: 'NORTH',
    title: 'Kullu Dussehra',
    note: 'Decorative lanterns at the Kullu Dussehra festival.',
    file: 'himachal-kullu-festival.jpg',
    creator: 'Gannu03',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Decorative_paper_lanterns_at_Kullu_Dussehra_festival.jpg',
  },
  {
    state: 'Karnataka',
    region: 'SOUTH',
    title: 'Yakshagana dance',
    note: 'A Yakshagana performer in traditional costume and makeup.',
    file: 'karnataka-yakshagana.jpg',
    creator: 'Hailé F',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:2016_Yakshagana_dance_Karnataka,_a_Hindu_classical_dance.jpg',
  },
  {
    state: 'Madhya Pradesh',
    region: 'CENTRAL',
    title: 'Sanchi Ashoka pillar',
    note: 'A historic pillar at the Sanchi Buddhist complex.',
    file: 'madhya-pradesh-sanchi.jpg',
    creator: 'Suyash Dwivedi',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Ashoka%E2%80%99s_Pillar_at_Sanchi_Stup_(2).jpg',
  },
  {
    state: 'Maharashtra',
    region: 'WEST',
    title: 'Ajanta Caves',
    note: 'The basalt cliffs and cave entrances of the Ajanta complex.',
    file: 'maharashtra-ajanta.jpg',
    creator: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Ajanta_Caves,_India,_Ajanta_basalt_cliffs_and_caves.jpg',
  },
  {
    state: 'Nagaland',
    region: 'NORTHEAST',
    title: 'Naga traditional shawl',
    note: 'A traditional textile representing the region’s rich weaving heritage.',
    file: 'nagaland-shawl.jpg',
    creator: 'পাপৰি বৰা',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Naga_Tribe_Traditional_Shawl.jpg',
  },
  {
    state: 'Odisha',
    region: 'EAST',
    title: 'Konark Sun Temple sculpture',
    note: 'A 13th-century elephant sculpture at the Konark Sun Temple.',
    file: 'odisha-konark.jpg',
    creator: 'Joydeep',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:13th_Century_Elephant_sculpture_at_Konark_Sun_Temple_Puri_district,_Odisha,_India.jpg',
  },
  {
    state: 'Punjab',
    region: 'NORTH',
    title: 'Harmandir Sahib',
    note: 'The Akal Takht and Harmandir Sahib in Amritsar.',
    file: 'punjab-harmandir-sahib.jpg',
    creator: 'Jasleen Kaur',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Akal_Takht_and_Harmandir_Sahib,_Amritsar,_Punjab,_India.jpg',
  },
  {
    state: 'Rajasthan',
    region: 'NORTHWEST',
    title: 'Hawa Mahal',
    note: 'The historic façade of Jaipur’s Palace of Winds.',
    file: 'rajasthan-hawa-mahal.jpg',
    creator: 'Chainwit.',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:East_facade_Hawa_Mahal_Jaipur_from_ground_level_(July_2022)_-_img_01.jpg',
  },
];

export default function GalleryPage() {
  return <main className="culture-app">
    <header className="create-nav">
      <Link className="brand" href="/">LOKA</Link>
      <span>CULTURE GALLERY / FIELD NOTES</span>
      <Link href="/discover" className="back">Discover</Link>
    </header>
    <section className="gallery-hero">
      <div>
        <span className="stamp">11 FIELD NOTES · MANY REGIONS</span>
        <h1>KEEP THE<br/><i>STORIES.</i></h1>
        <p>Explore cultural places, art, textiles and performance traditions from across India.</p>
      </div>
      <div className="gallery-starburst">✦<br/>भारत</div>
    </section>
    <p className="gallery-disclaimer">
      A small, growing selection from north, south, east, west, central and northeastern India.
      Each image is credited to its creator and linked to its source and reuse licence.
    </p>
    <section className="memory-grid" aria-label="Cultural photographs from Indian states">
      {panels.map((panel, index) => (
        <figure key={panel.state} className={`memory-card ${['wide', 'square', 'tall'][index % 3]}`}>
          <img
            src={`/culture-gallery/${panel.file}`}
            alt={`${panel.title} in ${panel.state}`}
            loading="lazy"
          />
          <figcaption>
            <span>{String(index + 1).padStart(2, '0')} / {panel.region} · {panel.state}</span>
            <strong>{panel.title}</strong>
            <em>{panel.note}</em>
            <small>
              Photo: {panel.creator} ·{' '}
              <a href={panel.licenseUrl} target="_blank" rel="noreferrer">{panel.license}</a>
            </small>
            <a href={panel.source} target="_blank" rel="noreferrer">VIEW ORIGINAL PHOTO ↗</a>
          </figcaption>
        </figure>
      ))}
    </section>
    <section className="gallery-footer">
      <p>Help grow the archive with properly credited, consented photographs and reliable cultural context.</p>
      <Link className="primary" href="/contribute">CONTRIBUTE A STORY <b>→</b></Link>
    </section>
  </main>;
}
