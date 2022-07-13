import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { identify, setGroup, groupIdentify, track, Identify } from '@amplitude/analytics-browser'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Amplitude Analytics Browser Example with React
        </h1>

        <button onClick={() => identify(new Identify().set('role', 'engineer'))}>
          Identify
        </button>

        <button onClick={() => setGroup('org', 'engineering')}>
          Group
        </button>

        <button onClick={() => groupIdentify('org', 'engineering', new Identify().set('technology', 'react.js'))}>
          Group Identify
        </button>

        <button onClick={() => track('Button Click', { name: 'App' })}>
          Track
        </button>
      </main>
    </div>
  )
}

export default Home