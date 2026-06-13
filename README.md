# Career Guidance Platform – AI Powered Career Roadmap Generator

An AI-powered career guidance platform that helps users discover career paths, generate personalized learning roadmaps, and track their progress through structured milestones. The platform leverages Gemini AI to analyze user skills, interests, education, and career goals, providing tailored recommendations and actionable learning plans.

## Features

### User Profile Management

* Create and update personalized profiles
* Store education, skills, interests, and career goals
* Set custom target completion timelines

### AI Career Analysis

* Generates personalized career roadmaps using Gemini AI
* Provides step-by-step learning plans
* Suggests assignments and practical learning activities
* Recommends relevant resources for skill development

### Dynamic Roadmap Generation

* Creates 10–14 structured learning steps
* Automatically adjusts timelines based on user goals
* Calculates learning duration and milestones

### Progress Tracking

* Mark roadmap steps as complete or incomplete
* Monitor overall learning progress
* Track completed milestones and pending tasks

### Learning Resources

* Curated recommendations including:

  * Online courses
  * Documentation
  * Articles
  * YouTube tutorials
  * Books

### Multi-User Support

* Separate profiles and roadmaps for each user
* Personalized recommendations and progress tracking

## Tech Stack

**Frontend:** React, Tailwind CSS, Framer Motion, React Router
**Backend:** Node.js, Express.js
**Database:** MongoDB, Mongoose
**AI Integration:** Gemini API

## Installation

```bash
git clone <repo-url>
cd career-guidance
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

## Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
```

## Future Improvements

* Calendar Integration
* Job and Internship Recommendations
* Resume Analysis and Skill Gap Detection
