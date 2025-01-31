import { Html, Head, Main, NextScript } from 'next/document';
import { Analytics } from "@vercel/analytics/react"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" />
        <meta name="theme-color" content="#000000" />
        <meta property="og:site_name" content="Am Here Chat" />
        <meta property="og:image" content="/AmHereImage.jpg" />
        <meta property="og:title" content="Am Here Chat" />
        <meta
          name="description"
          content="Am Here Chat | คุณไม่ได้เผชิญสิ่งนี้เพียงลำพัง 🌞 แม้วันนี้จะมืดมิด พรุ่งนี้ก็ยังมีแสงสว่างรออยู่เสมอ ✨ ทุกความรู้สึกของคุณมีค่า และคุณสำคัญ"
        />

      <meta
        name="keywords"
        content="AI, IT, Am Here, โรคซึมเศร้า, Chat"
      />
      <meta name="author" content="Am Here Chat" />
      <meta property="og:title" content="Am Here Chat" />
      <meta
        property="og:description"
        content="คุณไม่ได้เผชิญสิ่งนี้เพียงลำพัง 🌞 แม้วันนี้จะมืดมิด พรุ่งนี้ก็ยังมีแสงสว่างรออยู่เสมอ ✨ ทุกความรู้สึกของคุณมีค่า และคุณสำคัญ"
      />
      <meta property="og:url" content="https://here.hnawny.dev/" />
      <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <title>Am Here Chat V0.2.3</title>
      </Head>
      <body>
        <Main />
        <Analytics />
        <NextScript />
      </body>
    </Html>
  );
}
