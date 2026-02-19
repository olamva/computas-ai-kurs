# Codex

## VSCode og codex extension
Du kan bruke codex som en extension i vscode.

Vscode kan installeres her: 
https://code.visualstudio.com/


Så trenger du codex extensionen:
https://marketplace.visualstudio.com/items?itemName=openai.chatgpt

Codex kan også installeres som en CLI app på mac, linux og windows (med WSL). Den raskeste veien til målet er å bruke vscode, men om du har installert eller får installert node kan du installere codex for bruk i terminalen med `npm i -g @openai/codex`. 

## Åpne og logg inn i codex

### Åpne Codex

Windows/Linux `Ctrl+Shift p` eller `Cmd+Shift p` skriv så `new thread in codex sidebar` du skal få opp en mulighet til å logge deg inn om du ikke har gjort det før. 

### Logge inn

Når du har installert Codex kan du logge på i extension eller cli med en API key vi vil gi deg tilgang til under workshoppen, men det kan være nyttig å vite at bruk av Codex er inkludert i et ChatGPT abonnement. Du kan også logge deg på ved å paste API keyen inn i terminalen eller kjøre en login flow via ChatGPT (om du har abonnement) etter å ha installert codex og kjørt `codex` i terminalen.

## Gratulerer! 

Når du er ferdig med det ovenfor er du klar til å sette igang med hackathon oppgaven, men om du er interessert i en ekstra utfordring kan du forsøke å installere noen verktøy og konfigurere ai agenten din. Det er imidlertid mye som er inkludert med Codex og lignende kodeagenter så helt greit å stoppe her om dette er første gang du bruker dem.

# Ekstra utfordringer

## Agent.md
Codex plukker automatisk opp en Agent.md i folderen du jobber i og følger instruksjoner gitt i denne. Et eksempel på ting jeg bruker Agent.md til er å sørge for at agenter husker jeg bruker `uv` for håndtere installasjon av biblioteker og virtualenvs når jeg bruker python. Agenten vil som regel ikke få med seg dette. Istedenfor å stadig vekk rette på agenten kan man forklare det med en setning i Agent.md filen. Mange har et template for Agent.md per type prosjekt (programmeringsspråk, type prosjekt).


## Skills

Du kan finne skills her:
https://skills.sh/

Dette er den vi nevner i vår presentasjon:
https://skills.sh/anthropics/skills/frontend-design


Dette er sånn du kan installere den selv:
`npx skills add https://github.com/anthropics/skills --skill frontend-design`

`npx skills add https://github.com/chongdashu/phaserjs-tinyswords --skill phaser-gamedev`

Du vil få en del valg når du installerer:

"Which agents do you want to install to?"

Trykk enter, default er riktig her.

"Installation scope"

Velg project scope riktig her.

"Installation method"

Velg "Copy to all agents", dette er mer robust.


Det hender agenten ikke plukker opp at den har skills tilgjengelig, det kan hjelpe å minne den på dette. Det samme gjelder for MCP servere.


## Agent-browser
https://github.com/vercel-labs/agent-browser

Hva man skal gjøre her kan variere litt med hvilket operativsystem man bruker, men det virker med WSL.

```
npm install -g agent-browser
agent-browser install  # Download Chromium
```
