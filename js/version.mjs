/** Semver: major.feature.patch. Stampel är datum + hh:mm när versionen släpptes. */
export const SEMVER = "1.4.0";
export const STAMP = "2026-09-13 02:40";

export function versionLabel() {
  return `${STAMP} · ${SEMVER}`;
}
