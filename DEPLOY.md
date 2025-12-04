# Deploying to Firebase Hosting

## Prerequisites
1.  **Firebase CLI**: Install the Firebase CLI tools.
    ```bash
    npm install -g firebase-tools
    ```
2.  **Login**: Log in to your Google account.
    ```bash
    firebase login
    ```

## Setup
1.  **Create a Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    *   *Project Name Ideas*: `kishore-portfolio`, `kishore-dev-hub`, `kishore-works`, `portfolio-electric-blue`.
2.  **Update Config**:
    *   Open `.firebaserc` in your editor.
    *   Replace `INSERT_YOUR_PROJECT_ID_HERE` with the **Project ID** you just created (e.g., `kishore-portfolio-123`).

## Deploy
1.  **Build and Deploy**:
    Run the following command to build your Next.js app and deploy it to Firebase:
    ```bash
    firebase deploy
    ```
    *Note: The first deploy might take a few minutes as it sets up the backend resources.*

## Troubleshooting
*   If you see errors about "web frameworks", ensure you are using the latest version of `firebase-tools`.
*   If the build fails, try running `npm run build` locally first to check for errors.
