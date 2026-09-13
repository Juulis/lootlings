/** Semver: major.feature.patch. Stampel är datum + hh:mm när versionen släpptes. */
export const SEMVER = "1.6.1";
export const STAMP = "2026-09-13 02:52";

export function versionLabel() {
  return `${STAMP} · ${SEMVER}`;
}
