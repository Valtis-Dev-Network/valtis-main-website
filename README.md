# Valtis

Building the future of Minecraft development.

Valtis is an independent network for Minecraft developers, creators and technical communities.

We build our own projects, support community initiatives, and provide a space where quality development can thrive.

## What is Valtis?

Valtis exists to connect the people building the Minecraft ecosystem.

Whether you're creating plugins, mods, infrastructure, documentation, tooling, web platforms, resource packs, or community projects, Valtis aims to provide a place where quality development can be discovered, showcased and supported.

## Features

* Project Directory
* Developer Directory
* Community Initiatives
* Technical Resources
* Staff Dashboard
* Moderation & Reporting Tools
* Legal & Policy Management
* Cookie Consent Management
* Safeguarding & Safety Reporting
* Role-Based Access Control

## Technology Stack

* Next.js
* TypeScript
* Tailwind CSS
* Prisma
* SQLite (Development)
* PostgreSQL Ready
* Auth.js / NextAuth
* Zod
* React Hook Form
* Framer Motion

## Development

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Push the database schema:

```bash
npm run db:push
```

Seed development data:

```bash
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

## Environment Variables

See `.env.example` for the required configuration.

Set `NEXT_PUBLIC_SITE_URL` to the real public domain before launch. Social previews and Discord embeds use it to build the absolute URL for the high quality Valtis preview image.

Never commit:

* `.env`
* API keys
* Database credentials
* Authentication secrets

## Contributing

Contributions, suggestions and issue reports are welcome.

Please open an issue before undertaking large changes so work can be coordinated effectively.

## License

This project is licensed under the MIT License.

See the LICENSE file for details.

## Disclaimer

Valtis is an independent network for Minecraft developers, creators and technical communities.

Valtis is not affiliated with Mojang Studios or Microsoft.

Minecraft is a trademark of Mojang Studios.
