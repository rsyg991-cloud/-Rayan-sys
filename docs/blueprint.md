# **App Name**: Hayati: Personal Digital Planner

## Core Features:

- Academic Task List: Manage and track academic tasks. Tasks are stored locally using window.localStorage.
- Deadline Tracker: Input deadlines with subject, type, and due date. Calculates and displays dynamic countdowns, changing card color based on urgency. Uses window.localStorage for data persistence.
- Personal Task List: Manage and track personal tasks. Tasks are stored locally using window.localStorage.
- Habit Tracker: Track daily habits with a streak counter. Visual flame icon indicates habit completion, growing brighter as the streak increases. Uses window.localStorage for data persistence.
- RTL Layout: The UI is rendered in Right-to-Left (RTL) direction to support Arabic language.
- Data persistence: The data should persist in localStorage. Tasks, habits and deadlines must be restored after a refresh of the browser tab

## Style Guidelines:

- Primary color: Soft Emerald (#36b37e), reflecting growth and harmony in the user's organized life.
- Background color: Desaturated Emerald (#f0fdfa) creates a soothing yet productive environment.
- Accent color: Indigo (#5c6ac4) acts as a vivid analog, for clear calls-to-action and deadlines.
- Body and headline font: 'Cairo', a modern Arabic sans-serif for readability and aesthetic appeal.
- Split-screen 'Bento Box' grid layout: The left panel is for the 'University Zone,' and the right panel for the 'Life Zone,' optimizing tablet landscape viewing.
- Use Framer Motion for smooth task strikethrough animations, dynamic countdowns, and habit streak updates.