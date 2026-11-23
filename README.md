# Station App: Community Reports Dashboard

A case study in civic tech for Johannesburg. Residents report local problems like broken streetlights and illegal dumping. This dashboard is where staff review those reports and track them to resolution.

**Live demo:**(https://station-dashboard1.netlify.app/)
**Role:** UX research, service design, UI design and front-end build
**By:** Luyanda Mahlangu, BA Digital Media, University of Johannesburg

## The problem

Residents in Johannesburg often feel powerless in their own neighbourhoods. When a streetlight breaks or trash piles up, they don't know who to tell, or whether anyone is listening. That leaves people frustrated and unsafe, especially during load shedding.

## The solution

The **Station Companion App** is a mobile app that works alongside a physical Reporting Station in the community. Residents can:

1. Report an issue by choosing a category
2. Add photo evidence and confirm the location
3. Track the report from submitted to fixed, with before and after photos

This dashboard is the other side of that loop. It gives staff one place to see incoming reports, search and filter them, and check their status.

## Research

I interviewed Johannesburg residents about their suburbs, environmental concerns, and whether they feel able to act on them. Three needs came up again and again:

- **Security:** feeling protected, especially during power outages
- **Certainty:** clear, honest updates on what is being done
- **Control:** having a real say in what happens on their street

Two personas came out of this: **Itumeleng**, a student in Braamfontein who wants to feel safe walking at night, and **Michelle**, a long-term resident who wants reliable communication from the city.

## Process

| Stage | What I made |
| --- | --- |
| Research | Interviews and a Firma model of the wider context |
| Strategy | Problem statement, guiding policy and four coherent actions |
| Service design | Personas, customer journey map and service blueprint |
| Flows | Three user journeys and sixteen task models |
| Design | Paper wireframes, user testing, then eight final UI screens |
| Build | This staff dashboard, built in HTML, CSS and JavaScript |

## Design choices

- **Warm, not bureaucratic.** Salmon and orange tones plus soft rounded shapes, so civic tools feel friendly instead of cold.
- **Plain language.** Labels say what things are, like "Under review" and "In progress", with no system jargon.
- **Closing the loop.** Every report has a status and a timeline, because certainty was the strongest need in the research.
- **Dark mode and responsive layout** so staff can use it on any screen.

## Dashboard features

- Search by issue, area or ID, and filter by category or status
- Click any report to see its description, location, department and progress timeline
- Export the visible reports as a CSV file
- Dark mode, collapsible sidebar, and a `/` shortcut to jump to search

## Run it locally

No install needed. Keep these files together and open `index.html` in a browser:

```
index.html   page structure and demo data
styles.css   all styling
script.js    search, filters, report popup, export, dark mode
```

Icons load from Unicons, so you need an internet connection.

## Notes

All report data is demo content written into the HTML. Nothing is connected to a backend yet.
