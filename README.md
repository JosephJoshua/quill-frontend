# Quill Frontend

This repository contains the frontend application for **Quill**, an intelligent language learning platform designed to help users improve their language skills through literature. Quill provides an immersive and interactive user experience for its AI-powered tutoring, content management, and vocabulary retention systems.

The frontend is built with [React](https://react.dev/) and [Vite](https://vitejs.dev/).

---

## Core Features

-   **Interactive Reader**: An immersive view for reading texts with an integrated, resizable AI Tutor panel that provides Socratic dialogue.
-   **On-the-Fly Flashcards**: Users can select text within the reader to instantly create vocabulary flashcards, which are then added to the SRS.
-   **Spaced Repetition System (SRS)**: A full-featured flashcard review system based on the FSRS algorithm to optimize vocabulary retention. Includes interfaces for browsing decks and managing review sessions.
-   **AI-Powered Quizzes**: Dynamically generated quizzes based on the content to test comprehension, with an interface for taking and reviewing attempts.
-   **User Proficiency Assessment**: A dedicated section for users to submit writing samples and receive a CEFR proficiency level estimation.
-   **Responsive Dashboard**: A central hub that provides users with an overview of their learning progress, recent activities, and SRS review schedule.
-   **Modern UI/UX**: Built with **shadcn/ui** and **Tailwind CSS** for a clean, accessible, and responsive design that works across all devices. Includes dark mode support.
-   **Internationalization (i18n)**: Supports multiple languages for the user interface.

---

## Technology Stack

| Category                 | Technology                                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Framework/Library** | [React](https://react.dev/), [Vite](https://vitejs.dev/)                                                     |
| **Language** | [TypeScript](https://www.typescriptlang.org/)                                                               |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)                                    |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/)                                                                    |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/)                                                                    |
| **Routing** | [React Router](https://reactrouter.com/)                                                                    |
| **API Communication** | [Axios](https://axios-http.com/)                                                                            |
| **Form Management** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)                                     |
| **Charts & Visualization**| [Recharts](https://recharts.org/)                                                                           |
| **Internationalization** | [i18next](https://www.i18next.com/)                                                                         |
| **Linting & Formatting** | [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)                                              |

---

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v20 or higher recommended)
-   [pnpm](https://pnpm.io/installation)
-   A running instance of the [Quill Backend](https://github.com/josephjoshua/quill-backend)

### 1. Environment Setup

Create a `.env.local` file in the root directory by copying the example below. This file will contain the URL for your running backend instance.

```env
# .env.local.example

# The base URL for the Quill backend API
VITE_API_URL=http://localhost:3000/api
```

### 2. Installation

Install the project dependencies using pnpm:

```bash
pnpm install
```

### 3. Running the Application

To run the application in development mode with live-reloading:

```bash
pnpm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Scripts

-   `pnpm run dev`: Start the development server.
-   `pnpm run build`: Build the application for production.
-   `pnpm run lint`: Lint the codebase using ESLint.
-   `pnpm run preview`: Preview the production build locally.

---

## Project Structure

The frontend is organized into a modular and maintainable structure:

-   **/src/pages**: Contains the main component for each route/page (e.g., `Dashboard`, `Library`, `Reader`).
-   **/src/components**: Contains reusable React components.
    -   **/ui**: Auto-generated components from `shadcn/ui`.
    -   **/shared**: Custom, widely-used components like `Header` and `EmptyState`.
    -   **/reader**: Components specific to the reader interface.
    -   **/skeletons**: Loading skeleton components for a better user experience.
-   **/src/services**: Modules for making API calls to the backend.
-   **/src/store**: Global state management configuration using Zustand.
-   **/src/layouts**: Layout components that provide a consistent structure, like `AppLayout`.
-   **/src/hooks**: Custom React hooks used throughout the application.
-   **/src/lib**: Shared utility functions.

---

## License

This project is licensed under the MIT license.
