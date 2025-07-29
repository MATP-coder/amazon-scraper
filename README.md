# eBay Price Scanner

This repository contains a minimal [Next.js](https://nextjs.org/) web application
that helps you search for items on eBay using the official Browse API.
You can use it to find discounted listings (for example, if a seller
accidentally lists an item at a lower price than usual) and display the
results in a simple user interface. The app is intentionally kept lean
so that you can deploy it easily to [Vercel](https://vercel.com/) or run it
locally.

## How it works

1. A user enters a keyword into the search bar on the home page.
2. A request is sent to `/api/search?q=...`, which performs an API call to the
   eBay Browse API. The call uses the `EBAY_BEARER_TOKEN` environment
   variable for authentication and optionally `EBAY_MARKETPLACE_ID` to
   target a specific eBay marketplace (defaults to `EBAY_US`).
3. The serverless function extracts the `itemSummaries` from the eBay
   response and returns only a few fields: the listing ID, title, price and
   a URL to the listing.
4. The client receives this simplified payload and renders it as a list of
   search results.

## Getting started

### Prerequisites

Before running the project you need an eBay **application key (App ID)**
and an **OAuth access token**. Follow the steps on the
[eBay developer portal](https://developer.ebay.com/) to create an app and
generate an application access token via the client‑credentials grant. The
token must have the scope `https://api.ebay.com/oauth/api_scope`.

### Setup

1. Clone this repository or download the files into a directory on your
   machine.
2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env.local` file at the root of the project and add your
   credentials:

   ```
   EBAY_BEARER_TOKEN=your_oauth_token_here
   # Optional: specify a marketplace. For Spain use EBAY_ES. See the eBay docs
   # for supported marketplace IDs such as EBAY_DE, EBAY_GB, etc.
   EBAY_MARKETPLACE_ID=EBAY_ES
   ```

4. Start the development server:

   ```sh
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser. Type a
   product name (for example, “iPhone 12”) into the search bar and press
   **Search** to see the results.

### Deploying to Vercel

This project is compatible with Vercel out of the box. To deploy it:

1. Create a new project in your Vercel dashboard and import this GitHub
   repository. Vercel will automatically detect that it is a Next.js
   application.
2. During the deployment setup, add the `EBAY_BEARER_TOKEN` and
   `EBAY_MARKETPLACE_ID` as Environment Variables in the Vercel UI.
3. Click **Deploy** and wait for Vercel to build and deploy your site.

Once deployed, you will have a URL where you can perform eBay searches via
the serverless function.

## Security considerations

This project does not store any credentials in the repository. Make sure to
configure your secrets as environment variables in your local `.env.local`
file or in your deployment platform (e.g. Vercel) and avoid committing
tokens to version control.
