# Lootlings

Diablo-liknande skattjakt för barn. Körs i webbläsaren med tangentbord, mus och mobilstyrning.

## Spela

- [GitHub-repo](https://github.com/Juulis/lootlings)
- Vercel-URL publiceras när projektet är kopplat

## Loop

1. Välj klass: Riddare, Magiker eller Skytt
2. Rensa våningen
3. Plocka loot (vanlig → legend)
4. Gå in i portalen
5. Boss var 5:e våning

## Styrning

- WASD / piltangenter för att gå
- Klick eller mellanslag för att slå
- E eller Shift för klasskraft
- Mobil: styrpinne + knappar

## Utveckling

```bash
npm test
npx serve .
```

Frontend är statisk. `api/scores.js` är Vercel-funktion för topplista.
