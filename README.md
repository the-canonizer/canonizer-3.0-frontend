This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Cloning

```
- Clone repo
- Checkout to main branch
```

## Getting Started

First, run the development server:

```bash
- npm run dev: starts dev environment
- npm run build: creates a build
- npm run start: starts production environment
- npm run format: prettify all files
- npm run lint: checks eslint warnings and errors
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

You can start editing the page by modifying `src/pages/index.js`. The page auto-updates as you edit the file.

## Environment

    We can add environment variables in .env, .env.development and .env.production files

## /bin

    Containing .sh files for configuration of environments

## /Styles

    Containing global styling files and antd design variables .less

## Routes

    Any file name under src/pages is basically a route name

## High order components (HOC)

- ## loggedInLayout:

        Containing logic for restricted pages(required permission) and rendering layout and children components for logged in users

- ## loggedOutLayout:

        Containing logic to render either logged in layout or logged out layout and also rendering the children components

- ## GetStartedLayout:

```
  for login, reset password, forgot password pages
```

## src/components:

- ## Common

        - LoggedInHeader
        - LoggedOutHeader

- ## Pages:

        Containing the components for pages

- ## Libraries:

        Containing third party libraries like fresh chat

## src/constants

      Containing constants being used throughout the application like network constants

## src/hooks

     Containing custom hooks like usePermission() hook returns true if a user have a specific permission

## src/store

     Containing redux store configurations

## src/network

- ## api

```
  containing specific api methods in which we are calling api requests and dispatching redux store actions
```

- ## request

```
  containing specific request methods in which we are calling generic network call method
```

## src/store/slices

    Containing slices of redux store, Slice is basically a feature of redux toolkit, a combination of action, action creator and redux reducer.

## src/utils

    utils contains all utilities being used in application like a waiting spinner

## Note

    The component's directory name (src/components/pages) should be  same as route name files (src/pages)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
