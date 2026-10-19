# RoadFit — Expo + React Native starter

RoadFit is an offline-first truck-driver fitness and weight-loss app. The first version includes:
- Dashboard with today's plan and weekly completion
- Weight logging and saved progress
- Editable road-friendly meal planner with add, edit and delete
- Water intake tracking in litres (250 ml per tap)
- Shopping list with checkboxes
- Five-day workout schedule: 3 strength days + 2 pool days, plus custom workouts; mark each activity and complete a session once all its activities are done
- Local persistence using AsyncStorage
- Optional Supabase email-account cloud sync (requires your own Supabase project)

## 1. Run RoadFit on Windows
1. Download and extract `RoadFit_Expo_Starter.zip`.
2. Open Visual Studio Code and choose **File → Open Folder**, then select the extracted `RoadFit` folder.
3. In VS Code, choose **Terminal → New Terminal**.
4. Run `npm install` and wait for it to finish.
5. Run `npx expo start`.
6. Install **Expo Go** on your Android phone, then scan the QR code shown in the terminal/browser. Keep your computer and phone on the same Wi-Fi network. If local networking fails, try `npx expo start --tunnel`.
7. For an Android emulator, press `a` after Expo starts. On Windows, you cannot run Apple's iOS Simulator locally; you can test on a physical iPhone with Expo Go, and create store builds later using EAS Build.

If Expo reports that package versions do not match, run `npx expo install --fix`, then restart with `npx expo start -c`.

## Publish a public web version with GitHub Pages
The repository includes a GitHub Actions workflow that builds and deploys the static web app to `https://reel2reel-audio.github.io/RoadFit/`.

1. Push the RoadFit project to the `main` branch of `Reel2Reel-Audio/RoadFit`.
2. In the GitHub repository, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**.
3. Open the **Actions** tab and wait for **Deploy RoadFit to GitHub Pages** to finish successfully.

Each push to `main` republishes the site. The app is configured for the `/RoadFit` project-site path.

## 2. Set up optional cloud sync
Local storage is the source of truth; the app works offline. Cloud sync is deliberately optional and will show as not configured until you add credentials.

1. Create a project at Supabase.
2. In Supabase SQL Editor, run the SQL in `supabase/schema.sql`.
3. In Supabase project settings, copy the Project URL and publishable/anon key into `.env`:
   - `EXPO_PUBLIC_SUPABASE_URL=...`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY=...`
4. In Supabase Authentication settings, configure Email sign-in. If email confirmation is enabled, users must confirm their address before signing in.
5. Restart Expo after changing `.env`: stop the server and run `npx expo start -c`.
6. In RoadFit, open Progress, create an account or sign in, then tap **Sync now**. Sign in with the same account on another device to merge weight entries and completion checklists. Sync is manual in this first version; local changes are still saved offline.

Never put a Supabase `service_role` secret in a mobile app. Only use the publishable/anon key.

## 3. Build for Android and iOS
For development, Expo Go is the quickest way to test. For store-ready builds, configure an Expo account and EAS:
- `npm install -g eas-cli`
- `eas login`
- `eas build:configure`
- `eas build --platform android`
- `eas build --platform ios`

Apple App Store builds/signing require Apple Developer account credentials. You can develop on Windows; you just cannot run Apple's local iOS Simulator on Windows.

## What is included
- `app/(tabs)/index.tsx`: Dashboard
- `app/(tabs)/meals.tsx`: Meals
- `app/(tabs)/workouts.tsx`: Workouts
- `app/(tabs)/shopping.tsx`: Shopping list
- `app/(tabs)/progress.tsx`: Weight tracking, completion, sync
- `src/RoadFitProvider.tsx`: Offline-first state and persistence
- `src/data.ts`: Sample meal and workout plan
- `src/supabase.ts`: Optional cloud-sync client
- `supabase/schema.sql`: Table and row-level security

## Notes
- The meal plan is a general starting point, not medical advice or a promise of a specific rate of weight loss.
- The sample workout plan is beginner-friendly. Adjust intensity to your ability, and get medical advice if you have health conditions or have been inactive for a long time.
- Cloud sync is a scaffold requiring your own Supabase setup; it is not active by default.
