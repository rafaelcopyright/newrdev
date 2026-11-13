import { ArrowDown, ArrowUpRight, Check, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '@/features/seo/Seo';
import { siteConfig } from '@/config/site';
import { reportAnalyticsEvent } from '@/lib/analytics';
import { experiences, skillGroups } from './aboutContent';
import './about.css';

const linkedin = 'https://www.linkedin.com/in/rafael-almeida-reis/';

function ContactLink({ placement }: { placement: string }) {
  return (
    <a
      className="about-button"
      href="https://wa.me/5511969005617"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        reportAnalyticsEvent('about_contact_click', {
          method: 'whatsapp',
          placement,
          page_type: 'about',
        })
      }
    >
      Conversar sobre um projeto <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}

export default function AboutPage() {
  const origin = siteConfig.canonicalOrigin;
  return (
    <>
      <Seo
        title="Rafael Reis | Desenvolvedor web, WordPress e IA — Sobre"
        description="Conheça a trajetória de Rafael Reis: desenvolvimento web desde 2018, experiência em agências, no Band.com.br e em projetos com IA. Vamos conversar sobre seu projeto."
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'AboutPage',
              '@id': origin + '/sobre/#pagina',
              url: origin + '/sobre/',
              name: 'Sobre Rafael Reis',
              inLanguage: 'pt-BR',
              mainEntity: { '@id': origin + '/sobre/#pessoa' },
            },
            {
              '@type': 'Person',
              '@id': origin + '/sobre/#pessoa',
              name: 'Rafael Almeida dos Reis',
              jobTitle: 'Desenvolvedor web',
              url: origin + '/sobre/',
              image: origin + '/media/rafael-reis-perfil.webp',
              sameAs: [linkedin],
              knowsAbout: [
                'Desenvolvimento web',
                'WordPress',
                'Angular',
                'SEO técnico',
                'Inteligência artificial',
              ],
            },
          ],
        }}
      />
      <div className="about-page">
        <section className="about-hero about-container" aria-labelledby="about-title">
          <div>
            <p className="about-eyebrow">Sobre mim · desenvolvimento desde 2018</p>
            <h1 id="about-title">
              Rafael Almeida
              <br />
              dos <span>Reis.</span>
            </h1>
            <p className="about-role">Desenvolvimento web, WordPress e IA.</p>
            <p className="about-intro">
              Transformo necessidades de negócio em sites, interfaces e ferramentas que as pessoas
              conseguem usar. Minha experiência passa por agências digitais, pelo Band.com.br e por
              projetos com inteligência artificial.
            </p>
            <div className="about-actions">
              <ContactLink placement="hero" />
              <a className="about-text-link" href="#experiencia">
                Ver experiência <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
            <p className="about-note">
              Projetos sob demanda e parcerias PJ. Vamos entender o que você precisa, sem
              compromisso.
            </p>
          </div>
          <aside className="about-profile" aria-label="Perfil profissional">
            <img
              src="/media/rafael-reis-perfil.webp"
              width="400"
              height="400"
              alt="Rafael Almeida dos Reis"
              {...{ fetchpriority: 'high' }}
            />
            <div className="about-profile-info">
              <p>
                <MapPin size={16} aria-hidden="true" /> São Bernardo do Campo · SP
              </p>
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                Meu perfil no LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </aside>
        </section>
        <div className="about-signals">
          <div className="about-container">
            <p>
              <strong>Agências digitais</strong>Sites, conteúdo e e-commerce
            </p>
            <p>
              <strong>Portal de mídia</strong>Interfaces, APIs e performance
            </p>
            <p>
              <strong>Projetos com IA</strong>Integrações e ferramentas internas
            </p>
          </div>
        </div>
        <section
          className="about-section about-container about-award"
          aria-labelledby="award-title"
        >
          <figure>
            <div className="about-award-photos">
              <img
                src="/media/premio-abc-2023-equipe.webp"
                srcSet="/media/premio-abc-2023-equipe-480.webp 480w, /media/premio-abc-2023-equipe.webp 828w"
                sizes="(max-width: 600px) calc(100vw - 40px), 50vw"
                width="828"
                height="552"
                loading="lazy"
                decoding="async"
                alt="Equipe da agência WB.P reunida com o troféu de bronze do Prêmio ABC 2023"
              />
              <img
                className="about-award-trophies"
                src="/media/premio-abc-2023-trofeus.webp"
                width="480"
                height="320"
                loading="lazy"
                decoding="async"
                alt="Troféus conquistados pela agência WB.P no Prêmio ABC 2023"
              />
            </div>
            <figcaption>Uma conquista em equipe na agência WB.P (Webfoco + Pippe).</figcaption>
          </figure>
          <div>
            <p className="about-eyebrow">Reconhecimento · Prêmio ABC 2023</p>
            <h2 id="award-title">Prêmio em Projeto de SEO</h2>
            <p>
              Na agência WB.P, participei de um projeto de SEO e otimização de site que conquistou o
              bronze em Melhor Desenvolvimento Web no Prêmio ABC 2023, com destaque para a
              experiência de uso e a navegação rápida.
            </p>
            <p>
              Atuei no desenvolvimento e na otimização, ao lado de Paloma Montenegro no design e
              Carla Suzano na gestão do projeto. Um reconhecimento ao cuidado de toda a equipe com a
              qualidade do site.
            </p>
            <a
              className="about-text-link"
              href="https://www.linkedin.com/feed/update/urn:li:activity:7140102796216893440/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver a publicação sobre o prêmio <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </section>
        <section className="about-section about-container" aria-labelledby="approach-title">
          <p className="about-eyebrow">Como essa experiência ajuda o seu projeto</p>
          <h2 id="approach-title">
            Entender o problema.
            <br />
            Construir uma solução que faça sentido.
          </h2>
          <p className="about-section-intro">
            Em agência, aprendi a traduzir a identidade e as necessidades de cada cliente em um
            site. Em um portal de mídia, trabalhei com integrações, desempenho e colaboração entre
            equipes. Levo essa visão para os projetos que desenvolvo: entender o contexto, explicar
            as escolhas e cuidar da implementação.
          </p>
          <div className="about-services">
            <article>
              <span className="about-number">01 / Presença digital</span>
              <h3>Seu negócio bem apresentado na internet</h3>
              <p>
                Sites institucionais e blogs com navegação clara, boa experiência no celular e
                estrutura para publicar conteúdo.
              </p>
              <Link to="/criacao-de-sites/">
                Conhecer o serviço de sites <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </article>
            <article>
              <span className="about-number">02 / Operação do negócio</span>
              <h3>Ferramentas para organizar o trabalho</h3>
              <p>
                Sistemas web, integrações e automações pensados a partir dos processos e das
                informações que sua equipe precisa gerenciar.
              </p>
              <Link to="/desenvolvimento-de-sistemas/">
                Conversar sobre sistemas <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </article>
          </div>
        </section>
        <section
          className="about-section about-experience"
          id="experiencia"
          aria-labelledby="experience-title"
        >
          <div className="about-container">
            <p className="about-eyebrow">Trajetória profissional</p>
            <h2 id="experience-title">Onde construí minha experiência.</h2>
            <div className="about-timeline">
              {experiences.map((experience) => (
                <article className="about-job" key={experience.company}>
                  <div className="about-job-meta">
                    <p>{experience.period}</p>
                    <h3>{experience.company}</h3>
                  </div>
                  <div>
                    <h4>{experience.role}</h4>
                    <p>{experience.summary}</p>
                    <ul>
                      {experience.points.map((point) => (
                        <li key={point}>
                          <Check size={16} aria-hidden="true" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="about-tags">
                      {experience.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="about-section about-container" aria-labelledby="skills-title">
          <p className="about-eyebrow">Competências</p>
          <h2 id="skills-title">Tecnologia a serviço do projeto.</h2>
          <p className="about-section-intro">
            Escolho as ferramentas de acordo com a necessidade e a manutenção da solução. Estas são
            as principais frentes da minha atuação.
          </p>
          <div className="about-skills">
            {skillGroups.map((group) => (
              <article key={group.title}>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
                <small>{group.tools}</small>
              </article>
            ))}
          </div>
        </section>
        <section
          className="about-section about-container about-learning"
          aria-labelledby="education-title"
        >
          <div>
            <p className="about-eyebrow">Formação e aprendizado</p>
            <h2 id="education-title">
              Uma base técnica.
              <br />
              Aprendizado contínuo.
            </h2>
            <p>
              Além do trabalho, desenvolvo projetos pessoais para explorar integrações com IA e
              aplicações web. Também estudo desenvolvimento mobile com Flutter e Dart em projetos
              pessoais e acadêmicos.
            </p>
          </div>
          <div className="about-education">
            <article>
              <span>Graduação · em andamento</span>
              <h3>Análise e Desenvolvimento de Sistemas</h3>
              <p>
                Anhembi Morumbi · EAD
                <br />
                Conclusão prevista para 2027
              </p>
            </article>
            <article>
              <span>Formação técnica · concluída</span>
              <h3>Técnico em Informática</h3>
              <p>Etec Lauro Gomes · 2015–2016</p>
            </article>
            <article>
              <span>Idiomas</span>
              <h3>Inglês intermediário</h3>
              <p>Leitura de documentação técnica e estudo contínuo do idioma.</p>
            </article>
          </div>
        </section>
        <section className="about-section about-container" aria-labelledby="projects-title">
          <p className="about-eyebrow">Projetos além do currículo</p>
          <h2 id="projects-title">Da ideia à implementação.</h2>
          <div className="about-projects">
            <article>
              <img
                src="/media/5cf78d9554030b56.webp"
                width="1200"
                height="675"
                loading="lazy"
                alt="Projeto Sob as Asas do Segredo: blog e landing page"
              />
              <div>
                <span className="about-number">Portfólio</span>
                <h3>Sob as Asas do Segredo</h3>
                <p>
                  Um projeto de blog e landing page. Veja a apresentação e conheça uma aplicação do
                  meu trabalho com sites.
                </p>
                <Link to="/portfolio/sob-as-asas-do-segredo-blog-e-landing-page/">
                  Ver o projeto <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
            <article className="about-personal">
              <span className="about-number">Projeto pessoal · IA e conteúdo</span>
              <h3>Oráculo Neural</h3>
              <p>
                Portal desenvolvido para explorar a integração de PHP, banco de dados e APIs de
                modelos de linguagem na geração dinâmica de conteúdo.
              </p>
              <p>
                Um espaço para experimentar prompts, consumo de APIs e a conexão entre a interface e
                o processamento dos dados.
              </p>
              <a href="https://oraculoneural.com.br/" target="_blank" rel="noopener noreferrer">
                Visitar o Oráculo Neural <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </article>
          </div>
        </section>
        <section className="about-container about-contact" aria-labelledby="contact-title">
          <p className="about-eyebrow">Vamos conversar</p>
          <h2 id="contact-title">O próximo projeto pode ser o seu.</h2>
          <p>
            Precisa de um site, quer organizar um processo com um sistema ou procura um
            desenvolvedor web freelancer para uma parceria PJ? Conte o que você tem em mente.
            Podemos definir os detalhes juntos.
          </p>
          <div className="about-actions">
            <ContactLink placement="closing" />
            <Link className="about-text-link" to="/orcamento/">
              Prefiro enviar pelo formulário <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <p className="about-note">Contato direto comigo, sem compromisso.</p>
        </section>
      </div>
    </>
  );
}
