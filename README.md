This is a REST based DUNE Campaign advisor server using nextJS.

## Getting Started developing the advisor

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Starting the server

### Configure the envinroment of the server

The server will use following environmental variables to operate:

- PORT: The Server PORT the server is started

- DBURL: The Database URL.

- DBUSER: The database user name.

- DBPASSWORD: The database password.

### Start the production server

Start the development server:

```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Deploy on Vercel

As the project is a Next.js app, you can easily publish the app using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
