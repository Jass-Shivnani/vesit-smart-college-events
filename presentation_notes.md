# Presentation & Viva Speaking Notes
### Group 11 • VESIT D17A • Advanced Cloud Computing
**Project:** Design and Development of a Containerized College Event Management System with CI/CD  
**Team Members:**
- **Prachi Lund (Roll No. 39)**
- **Riya Khialani (Roll No. 34)**
- **Ankita Kukreja (Roll No. 36)**
- **Shivam Makhija (Roll No. 41)**

---

## 🎤 Slide-by-Slide Speaking Script

### Slide 1: Title Slide
**Speaker: Prachi Lund**
> "Good morning respected teachers. We are Group 11 from Class D17A. Today we present our project: **Design and Development of a Containerized College Event Management System with CI/CD**.
> 
> Our team includes Riya Khialani, Ankita Kukreja, Shivam Makhija, and myself, Prachi Lund. In this project, we developed a centralized college event platform that goes beyond standard CRUD operations by introducing intelligent conflict detection, waitlisting, and QR attendance, fully containerized using Docker, orchestrated on Kubernetes, and automated with a GitHub Actions CI/CD pipeline."

---

### Slide 2: Abstract & Problem Statement
**Speaker: Riya Khialani**
> "Thank you, Prachi. In colleges, event registrations are often managed through separate Google Forms or manual spreadsheets. This creates major issues: students double-book overlapping workshops, events suffer from no-shows, and monolithic servers crash when hundreds of students register at the exact same moment.
> 
> Our platform addresses this through a 3-tier architecture: React.js on the frontend, Node.js and Express.js for business logic, and MySQL for relational persistence.
> 
> Most importantly, our system implements three intelligent algorithms:
> 1. **Schedule Conflict Detection:** Rejects registrations that clash in time with a student's existing registered events.
> 2. **Smart Queue Waitlisting:** When an event is full, students enter a FIFO queue and are automatically promoted when a seat opens up.
> 3. **QR-Based Attendance:** Generates cryptographic digital ticket QR codes scanned at the venue to record live attendance."

---

### Slide 3: Literature Survey
**Speaker: Ankita Kukreja**
> "Thank you, Riya. For our literature survey, we reviewed key research papers in both academic event management and modern cloud DevOps:
> - **Arade et al. (2026)** and **Thombare et al. (2024)** studied the shift from traditional manual event coordination to centralized digital portals.
> - **Chaturvedi et al. (2024)** highlighted the necessity of structured 3-tier modular architectures for student platforms.
> - On the cloud infrastructure side, **Alamoush & Eichelberger (2024)** and **Amaro et al. (2025)** analyzed open-source container orchestration with Kubernetes and automated CI/CD capabilities.
> 
> These papers motivated our design: combining a functional event portal with production DevOps tools—Docker, Kubernetes, and GitHub Actions."

---

### Slide 4: System Architecture & DevOps Implementation
**Speaker: Shivam Makhija**
> "Thank you, Ankita. As shown in our architecture diagram:
> 1. **Frontend:** React.js provides the user interface for both students and administrators.
> 2. **Backend:** Node.js + Express.js runs our authentication, event management, conflict detection, and attendance verification APIs.
> 3. **Database:** MySQL stores relational records of users, events, registrations, and check-in timestamps.
> 
> **For the Cloud & DevOps component:**
> - **Docker:** We created multi-stage Dockerfiles for the frontend and backend, isolating dependencies and eliminating environment differences.
> - **Kubernetes (Minikube):** We deployed the backend as a 3-replica deployment behind a ClusterIP service for internal load balancing, with liveness/readiness probes for automatic self-healing.
> - **CI/CD Pipeline:** Whenever we commit changes to GitHub, GitHub Actions runs our automated unit tests, builds the Docker images, pushes them to the GitHub Container Registry, and validates our Kubernetes manifests."

---

## 🚀 Live Demonstration Walkthrough (Step-by-Step)

When the teacher asks: *"Show me the project running."*

### Step 1: Launch the System
In the terminal, run:
```bash
npm start
```
Browser opens at `http://localhost:3000`.

### Step 2: Student Persona (Riya Khialani)
1. Point out the top bar: *"We are logged in as student Riya Khialani (CMPN)."*
2. Point out the **"Recommended for You"** section: *"The system recommends the AI & Machine Learning Workshop and DevOps Hackathon based on Riya's department and interests."*

### Step 3: Demonstrate Schedule Conflict Detection (Teacher's Favorite!)
1. Click **Register** on the **Cybersecurity & Ethical Hacking Workshop** (11:00 AM - 1:00 PM).
2. The system immediately catches that Riya is already registered for the **AI Workshop** (10:00 AM - 12:00 PM).
3. The **Schedule Conflict Modal** pops up:
   > *"Teacher, look here: The backend executed our interval overlap algorithm ($Start_A < End_B \land End_A > Start_B$) and blocked the registration, explaining the exact conflict!"*

### Step 4: Demonstrate Smart Waitlist Queue
1. Scroll to the **Cloud Native DevOps Hackathon** (Capacity = 3, already full).
2. Click **Join Waitlist**.
3. System shows: *"Event Full! You have been added to the waitlist at Position #2."*

### Step 5: Demonstrate QR Code Ticket
1. Click **"My Tickets"** tab in the navbar.
2. Click **"Show QR Pass"** on the AI Workshop ticket.
3. Show the high-resolution QR code and unique cryptographic token.

### Step 6: Switch to Admin Portal & QR Attendance Scan
1. In the top navbar, click **"Switch to Admin"**.
2. Go to **"Admin Portal"**.
3. Click **"QR Gate Scanner"**.
4. Click **"Riya's AI Workshop Pass"** (simulates scanning Riya's QR code).
5. Confetti pops! Attendance is recorded as **Present** with live timestamp.
6. Check the **"Registrations & Attendance"** tab: Riya's status is now updated to **Present**!

### Step 7: Demonstrate Auto-Promotion on Cancellation
1. Switch back to Student persona.
2. Under "My Tickets", cancel an event that has a waitlist.
3. System displays: *"Seat freed! Student on waitlist has been automatically promoted to Confirmed!"*

### Step 8: Demonstrate Admin Analytics Dashboard
1. Open Admin Portal -> **"Analytics & KPIs"**.
2. Show the real-time metrics:
   - Total Registrations, Attendance Rate %, Most Popular Event, Top Department.
   - Dynamic Bar Charts and Department Breakdown.

### Step 9: Demonstrate Docker & Kubernetes (DevOps Viva)
1. Show `docker-compose.yml`: explain MySQL, Backend, Frontend, and bridge network `event-net`.
2. Show `k8s/`: explain 3 replicas, liveness probes, and self-healing.
3. Show `.github/workflows/ci-cd.yml`: explain CI tests, Docker build, and GHCR registry push.

---

## 💡 Quick Viva Answers Sheet

| Question | What to Say |
|---|---|
| **What is Docker?** | Docker is a containerization platform used to package applications with their dependencies into lightweight, portable containers. |
| **Why both Docker and Kubernetes?** | Docker packages and runs individual containers; Kubernetes orchestrates and manages clusters of containers (scaling, networking, self-healing). |
| **What is a Pod?** | A Pod is the smallest deployable unit in Kubernetes that runs one or more tightly coupled containers. |
| **What happens if a backend container crashes?** | Kubernetes continuously checks container health via Liveness Probes. If a pod crashes, Kubernetes automatically recreates a new pod to restore the desired state (Self-Healing). |
| **How does your CI/CD pipeline work?** | GitHub Actions triggers on every code push to automatically test code, build Docker images, publish them to GitHub Container Registry, and validate Kubernetes manifests. |
