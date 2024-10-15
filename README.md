# Shower Thoughts

Shower Thoughts is a web application that allows users to share and explore random, thought-provoking ideas. It's built with Next.js, React, and TypeScript, featuring a modern, responsive design with dark mode support.

## Features

- Share your shower thoughts anonymously
- Browse thoughts by Hot, New, and Top filters
- Dark mode support
- Responsive design for mobile and desktop
- Local SQLite database for data storage

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/shower-thoughts.git
   cd shower-thoughts
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. Run the development server:

   ```
   npm run dev
   ```

   or

   ```
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This project can be easily deployed to Vercel. Here are the steps:

1. Sign up for a Vercel account if you haven't already.
2. Install the Vercel CLI:
   ```
   npm i -g vercel
   ```
3. Run the following command in your project directory:
   ```
   vercel
   ```
4. Follow the prompts to deploy your application.

Note: The current configuration uses a local SQLite database. For production deployment, you may want to consider using a more scalable database solution.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
