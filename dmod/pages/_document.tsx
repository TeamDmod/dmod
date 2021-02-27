import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class DmodDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <title>Find Server Moderators - Dmod.gg </title>
                </Head>

                <body>
                    <Main />
                </body>
                <NextScript />
            </Html>
        )
    }
}