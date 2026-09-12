# Lootlings

Diablo-liknande skattjakt för barn. Körs i webbläsaren med tangentbord, mus och mobilstyrning.

Pixelgrafik i `js/sprites.mjs`: hjältar, slime/fladdermus/svamp, pumpaboss, portal, loot-ikoner och grottgolv. Mörk dungeon, stora ögon, lite trams.

## Länkar

- Repo: https://github.com/Juulis/lootlings
- Vercel-projekt: lootlings (konto juuffy)
- Pages: slå på under Settings → Pages → Source = GitHub Actions, kör sedan workflown `Deploy GitHub Pages`
- Efter Pages: https://juulis.github.io/lootlings/

## Loop

1. Välj klass: Riddare, Magiker eller Skytt
2. Rensa våningen
3. Plocka loot (vanlig → legend)
4. Gå in i portalen
5. Boss var 5:e våning

## Styrning

- WASD / piltangenter för att gå
- Håll mellanslag, mus eller Slå-knappen för att slå *samtidigt som du går*
- Auto-attack mot närmaste monster i räckvidd
- E eller Shift för klasskraft
- Mobil: styrpinne + håll Slå

## Backend

`api/scores.js` är Vercel-funktion för topplista. Importera repot i Vercel (team juuffy) för automatisk deploy + API.

## Utveckling

```bash
npm test
npx serve .
```
