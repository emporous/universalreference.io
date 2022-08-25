import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Ubiquity',
    Svg: require('@site/static/img/undraw_world_re_768g.svg').default,
    description: (
      <>
        Single API<br></br>
        All Inclusive<br></br>
        Portable<br></br>
        Extendable
      </>
    ),
  },
  {
    title: 'Identity',
    Svg: require('@site/static/img/undraw_fingerprint_re_uf3f.svg').default,
    description: (
      <>
        User Owned<br></br>
        Strongly Expressed<br></br>
        Attribute Based Access Control
      </>
    ),
  },
  {
    title: 'Security',
    Svg: require('@site/static/img/undraw_security_on_re_e491.svg').default,
    description: (
      <>
        Provenance<br></br>
        Attestation<br></br>
        Runtime Isolation<br></br>
        Cryptographic Signing
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
