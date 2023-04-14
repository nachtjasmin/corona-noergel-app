# Corona-Nörgel-App

:warning: Due to the so-called "end of the pandemic" (ffs, have you seen the numbers?), this project is now archived.

Complaints as a service. We use prefabricated arguments and public address data to generate individual draft complaint emails. These can then be improved upon before sending, if so desired.

Wir haben einige Argumente gesammelt und kombinieren diese automatisch zu individuellen Mailentwürfen, die dann vor dem Verschicken an das jeweilige Landesministerium, falls gewünscht, noch erweitert und angepasst werden können.

## Complain / Beschweren

If you ended up here, because you want to complain (to your health ministry that is) - no need to do anything of the following. Just head over to https://beschweren.rocks/ and complain to them.

Wenn du hier gelandet bist, weil du dich über fragwürdige Beschlüsse in der aktuellen Coronapolitik bist: es gibt eine live-version unter https://beschweren.rocks/ - kein programmieren, kein git, kein quelltext, einfach Mails zusammenbauen, ins Mailprogramm übernehmen, individualisieren und verschicken.

If something doesn't work as expected feel free to add an issue here or drop us a line at hallo@beschweren.rocks.

Wenn du hier bist, um dich zu beschweren, weil etwas an https://beschweren.rocks/ nicht funktioniert, mach gerne eine Issue auf oder schreib uns an hallo@beschweren.rocks

## Money / Geld

We neither need money for the project nor do we have a suitable legal form to accept money cleanly. However, if you find this useful, you are welcome to donate a little something to the non-profit Queer Lexikon e.V.. Links are in the sidebar.

Wir brauchen weder Geld für das Projekt noch haben wir eine passende Rechtsform, um Geld sauber anzunehmen. Falls du das hier nützlich findest, kannst du aber gerne eine Kleinigkeit an den gemeinnützigen Queer Lexikon e.V. spenden. Die Links dafür sind in der Sidebar.

## Do it yourself

This code is open source, feel free to fork, file issues or maybe even a pull request. We are using Svelte with Tailwind. For dev and build instructions see below.

### Developing

Install the dependencies with `npm install` (or `pnpm install` or `yarn`). Afterwards, you can start
the development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To build the application, run:

```bash
npm run build
```

The generated files are found in the `build` folder of the repository and can be delivered with any server.
After all, it's just plain JavaScript.

## Licenses

The favicon was downloaded [here](https://favicon.io/emoji-favicons/face-with-medical-mask) and is based on the Twemoji emoji set by Twitter, licensed under CC-BY 4.0
