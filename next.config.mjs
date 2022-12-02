// @ts-check
/* run the build with this set to skip validation */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  /** Next.js i18n docs:
   * @see https://nextjs.org/docs/advanced-features/i18n-routing
   * Reference repo for i18n:
   * @see https://github.com/juliusmarminge/t3-i18n
   **/
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: [
      "cms.nhl.bamgrid.com",
      "files.eliteprospects.com",
      "img.mlbstatic.com",
      "securea.mlb.com",
      "ak-static.cms.nba.com",
      "madden-assets-cdn.pulse.ea.com",
      "a.espncdn.com",
      "espncdn.com",
      "www.cfl.ca",
      "cfl.ca",
      "images.mlssoccer.com",
      "d2zywfiolv4f83.cloudfront.net",
      "sportshub.cbsistatic.com",
      "www.atptour.com",
      "atptour.com",
      "www.wtatennis.com",
      "wtatennis.com",
      "images.rogersdigitalmedia.com",
      "photoresources.wtatennis.com",
      "www.formula1.com",
      "www.indycar.com",
      "digbza2f4g9qo.cloudfront.net",
    ],
  },
});
