export type DeploymentEnvironment = 'homologacao' | 'producao';

const environment = import.meta.env.VITE_DEPLOY_ENV || 'producao';
if (environment !== 'homologacao' && environment !== 'producao') {
  throw new Error(`Ambiente de publicação inválido: ${environment}`);
}

const productionOrigin = 'https://rafaeldev.com.br';
export const siteConfig = {
  environment: environment as DeploymentEnvironment,
  origin: environment === 'homologacao' ? 'https://new.rafaeldev.com.br' : productionOrigin,
  canonicalOrigin: productionOrigin,
  indexable: environment === 'producao',
};
