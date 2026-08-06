# Firebase setup for the shared trip board

1. Create a Firebase Spark project and add a Web app.
2. In Authentication, enable the Google provider and add `k903034108.github.io` to authorized domains.
3. Create a Firestore database in a nearby Asia region.
4. Copy the Web config object into `firebase-config.js`.
5. Publish the rules in `firestore.rules.example` from the Firestore Rules screen.
6. Open the trip site and sign in once. Copy the UID shown in the Share sheet.
7. In Firestore, create these documents for the two editors:
   - `boards/nagoya-2026/members/YOUR_UID`
   - `boards/nagoya-2026/members/GIRLFRIEND_UID`
8. Each member document may contain a single field such as `role: "editor"`.

The shared site stores saved links in `resources` and user-added daily plans in `itineraryItems`. Both collections are protected by the same member check in the example rules.

Never put a service-account key, Google password, GitHub token, or Firebase Admin credential in this public repository.
