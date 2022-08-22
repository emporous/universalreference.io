import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Adaptable',
    Svg: require('@site/static/img/undraw_programmer_re_owql.svg').default,
    description: (
      <>
        A single API that can be used to express literally anything in the universe.
      </>
    ),
  },
  {
    title: 'Any content / Anywhere',
    Svg: require('@site/static/img/undraw_nakamoto_-2-iv6-light.svg').default,
    description: (
      <>
        A simple framework that enables anything in the universe to be expressed in a single format and interacted with by a single API.
      </>
    ),
  },
  {
    title: 'Powered by OCI Distribution',
    Svg: require('@site/static/img/oci_icon_distribution.svg').default,
    description: (
      <>
        Consolidate all data distribution systems into a single provider powered by OCI Registries.
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
