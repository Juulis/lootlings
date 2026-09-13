/** Semver: major.feature.patch. Stampel är datum + hh:mm (CEST) när versionen släpptes. */
export const SEMVER = "1.1.0";
export const STAMP = "2026-09-13 02:22";

export function versionLabel() {
  return `${STAMP} · ${SEMVER}`;
}
