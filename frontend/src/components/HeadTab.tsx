import Head from 'next/head'
import React from 'react'

export function HeadTab({ title }: { title: string }) {

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="Created by André Cunha" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}