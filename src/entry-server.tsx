import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import App from './App';

export function render(path: string): Promise<{ html: string; head: string }> {
  const context: { helmet?: HelmetServerState } = {};
  return new Promise((resolve, reject) => {
    let html = '';
    const output = new PassThrough();
    output.on('data', (chunk: Buffer) => {
      html += chunk.toString();
    });
    output.on('error', reject);
    output.on('end', () => {
      const helmet = context.helmet;
      resolve({
        html,
        head: helmet
          ? [helmet.title, helmet.meta, helmet.link, helmet.script]
              .map((part) => part.toString())
              .join('')
          : '',
      });
    });
    const stream = renderToPipeableStream(
      <HelmetProvider context={context}>
        <StaticRouter location={path}>
          <App />
        </StaticRouter>
      </HelmetProvider>,
      {
        onAllReady() {
          stream.pipe(output);
        },
        onShellError: reject,
        onError: reject,
      },
    );
  });
}
