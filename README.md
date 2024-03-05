<div align="center">
  <br />
      <a href="https://ibb.co/nngvVrD"><img src="https://i.ibb.co/Sds81NK/Full-Fram.jpg" alt="Full-Fram" border="0"></a>
  <br />
  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=white&logo=mongodb&color=47A248" alt="mongodb" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  </div>

  <h3 align="center">A modern twist to stack overflow  </h3>

</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🔗 [Links](#links)

## <a name="introduction">🤖 Introduction</a>

DevOverflow: Your AI-Powered Coding Sidekick

Tired of outdated answers and endless scrolling on traditional dev forums? Meet DevOverflow, where AI and community expertise collide to solve your coding problems faster.

Key Features:

AI-Assisted Answers: Get code suggestions, explanations, and debugging help from cutting-edge AI models.
Clerk Authentication: Secure login, protecting your contributions.
Community-Driven Quality: Upvotes and comments promote the best solutions.
Hyper-Focused Search: Find the right answers instantly with Next.js-powered search.
Optional: Location-Based Networking: Connect with devs in your area.
Level up your coding with DevOverflow. Experience the power of AI and community.

## <a name="tech-stack">⚙️ Tech Stack</a>

Core Technologies

Next.js (React): A powerful React-based framework for building web applications. Provides features like server-side rendering (SSR), automatic code splitting, and a streamlined development experience.
MongoDB: A flexible NoSQL database known for its scalability and use of JSON-like documents for data storage.
Mongoose: An object modeling library (ODM) for Node.js, making interaction with a MongoDB database easier.
User Interface (UI)

Tailwind CSS: A utility-first CSS framework for creating custom designs without overly specific CSS classes.
Radix UI: A collection of accessible and well-crafted React components for building robust user interfaces.
Lucide React: Provides well-designed and accessible icons for your UI.
Clerk.js: Handles secure user authentication and session management.
Enhanced Functionality

React Hook Form: Streamlines form creation, validation, and management in React applications.
OpenAI: Access to powerful AI models for tasks like text generation, code suggestion, and more (if you're integrating with their API).
Zod: A TypeScript library for robust data validation and parsing.
Svix: Event-driven webhooks for seamless integration within your application.
Styling and Formatting

@tailwindcss/typography: Adds beautiful typography styles with Tailwind CSS.
Prism.js: A library for syntax highlighting in code blocks.
Tinymce: A rich text editor for content creation (like comments or forum posts).

## <a name="features">🔋 Features</a>

Absolutely! Here's a revamped version of the feature list, focusing on what users can do and the benefits the app provides:

👉 **Secure and Seamless Access:** Effortlessly register, log in, and explore protected content with confidence.

👉 **Discover Relevant Content:**

- Personalized Recommendations: Get tailored post suggestions based on your interests and activity.
- Effortless Global Exploration: Browse a worldwide database of posts with lightning-fast retrieval.
- Find Exactly What You Need: Use advanced filters and pagination to pinpoint the right content.

👉 **Harness the Power of AI:** \* Get Instant Insights: Receive AI-generated answers to your questions, providing helpful perspectives.

👉 **Be Part of a Thriving Community:**
_ Earn Recognition:\*\* Gain badges and build your reputation by contributing valuable content.
_ Shape the Conversation: Upvote or downvote posts to influence what gets highlighted. \* Learn From the Best: Find top answers and questions showcased for easy access to community knowledge.

👉 **Search with Precision:** Locate content with ease using both local and global search capabilities.

...and many more, including code architecture and reusability for a streamlined development experience.

Let me know if you want to make it even more concise or focus on other specific benefits!

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/stevef24/Next13-Stackoverflow.git
```

**Installation**

Install the project dependencies using npm:

```bash
npm run dev
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_TINY_EDITOR_API_KEY=
MONGODB_URI=

NEXT_PUBLIC_SERVER_URL=http://localhost:3000

OPENAI_API_KEY=

NEXT_PUBLIC_RAPID_API_KEY=
```

Replace the placeholder values with your actual respective account credentials. You can obtain these credentials by signing up on the [Clerk](https://clerk.com/), [MongoDB](https://www.mongodb.com/), [OpenAI](https://platform.openai.com/) and [Tiny](https://www.tiny.cloud/)

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="links">🔗 Links</a>

Live link (AI functionality may be take down due to excessive use of Open AI key, view the code to see how it works) [here](https://next13-stackoverflow.vercel.app/)
