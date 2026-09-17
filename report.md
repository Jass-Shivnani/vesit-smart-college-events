# Design and Development of a Containerized College Event Management System with CI/CD
### Advanced Cloud Computing Mini-Project Report

**Course:** Advanced Cloud Computing / Container Technologies Laboratory  
**Institution:** Vivekanand Education Society's Institute of Technology (VESIT)  
**Academic Class & Group:** D17A • Batch 2, Group 11  
**Team Members:**
- Prachi Lund (Roll No. 39)
- Riya Khialani (Roll No. 34)
- Ankita Kukreja (Roll No. 36)
- Shivam Makhija (Roll No. 41)

---

## 1. Abstract

College campus event management has historically relied on disparate forms, spreadsheets, and manual attendance rosters. Such traditional monolithic workflows suffer from single points of failure, lack of automated validation, difficult environment configuration ("it works on my machine"), and no horizontal scalability when hundreds of students attempt to register simultaneously.

This project presents the design, implementation, and automated deployment of a **Smart College Event Management System** built with **React.js**, **Node.js/Express.js**, **MySQL**, **Docker**, **Kubernetes (Minikube)**, and **GitHub Actions CI/CD**. Moving beyond traditional CRUD implementations, the system introduces:
1. **Algorithmic Schedule Conflict Detection:** Validates proposed registrations against existing student commitments to block overlapping session enrollments.
2. **Dynamic Queue-Based Waitlisting:** Manages full-capacity events through a first-in-first-out (FIFO) queue with automatic promotion upon seat cancellation.
3. **QR-Based Attendance Lifecycle:** Generates cryptographic digital ticket tokens rendered into high-resolution QR codes that are verified in real time via an administrative gate scanner.
4. **Cloud-Native Containerization & Orchestration:** Employs multi-stage Dockerfiles, user-defined bridge networks, persistent volumes, Kubernetes multi-replica deployments with liveness/readiness probes, and horizontal pod autoscaling (HPA).
5. **Automated CI/CD:** Utilizes GitHub Actions to automate unit testing, linting, Docker image packaging, GitHub Container Registry (GHCR) publishing, and Kubernetes deployment dry-run validation.

---

## 2. Problem Statement & Technical Objectives

### 2.1 Problem Statement
Manual or monolithic web applications for college event registration exhibit severe limitations during peak campus traffic:
- **Single Point of Failure (SPOF):** Monolithic servers crash during sudden traffic bursts when popular workshops open for registration.
- **Absence of Business Logic:** Students frequently double-book overlapping workshops, leading to wasted seats and low physical attendance.
- **Manual Gate Entry:** Physical paper rosters slow venue entry and lack instant synchronization with backend attendance databases.
- **Deployment & Dependency Overhead:** Inconsistent environments between developer laptops and deployment servers cause version drift and deployment downtime.

### 2.2 Project Objectives
1. **Modular 3-Tier Architecture:** Decouple the user interface, RESTful application business logic, and relational storage.
2. **Intelligent Validation Engines:** Implement schedule conflict prevention ($Start_A < End_B \land End_A > Start_B$) and FIFO waitlist queues.
3. **Cryptographic QR Attendance:** Eliminate paper rosters with digital check-ins linked directly to registration records.
4. **Docker Containerization:** Encapsulate the frontend (React + NGINX), backend (Node.js Alpine), and relational database (MySQL 8.0) into portable containers.
5. **Kubernetes Orchestration:** Manage containers using Minikube Pods, ClusterIP/NodePort Services, PersistentVolumeClaims, and Horizontal Pod Autoscalers.
6. **Continuous Integration & Continuous Deployment (CI/CD):** Automate code verification, testing, and container delivery via GitHub Actions.

---

## 3. System Architecture & Component Design

```
+---------------------------------------------------------------------------------+
|                                 CLIENT BROWSERS                                 |
|                       (Students & Campus Administrators)                        |
+---------------------------------------+-----------------------------------------+
                                        |  HTTP Port 3000 / 80
                                        v
+---------------------------------------------------------------------------------+
|                       FRONTEND CONTAINER (React 18 + NGINX)                     |
|  - Modern Dark Mode Glassmorphism UI                                           |
|  - Real-Time Conflict Visualizer                                               |
|  - Dynamic QR Ticket Generator                                                 |
|  - Admin Analytics Dashboard & QR Scanner                                      |
+---------------------------------------+-----------------------------------------+
                                        |  REST API / Reverse Proxy (/api/*)
                                        v
+---------------------------------------------------------------------------------+
|                    BACKEND PODS (Node.js + Express Microservice)                |
|  - Auth & Role Middleware (JWT)                                                 |
|  - Schedule Conflict Detection Algorithm                                        |
|  - Dynamic Waitlist Engine (Auto Promotion)                                     |
|  - QR Cryptographic Verification & Check-in                                     |
|  - Health Probes (/health) for Kubernetes Liveness & Readiness                  |
+---------------------------------------+-----------------------------------------+
                                        |  Port 3306 (TCP)
                                        v
+---------------------------------------------------------------------------------+
|                     DATABASE CONTAINER / POD (MySQL 8.0)                        |
|  - Users (Students, Admins, Departments)                                        |
|  - Events (Date, Timings, Venue, Capacity)                                      |
|  - Registrations (Status, Waitlist Position, QR Token, Attendance)              |
|  - Persistent Storage Volume (PVC)                                              |
+---------------------------------------------------------------------------------+
```

---

## 4. Key Algorithmic Modules

### 4.1 Smart Schedule Conflict Detection Algorithm
When a student requests registration for Event $E_{new}$ occurring on Date $D$:
1. The backend retrieves all active confirmed registrations for user $U$ where $Date(E_{existing}) == D$.
2. It evaluates the interval overlap formula:
   $$\text{Conflict} = (Start_{new} < End_{existing}) \land (End_{new} > Start_{existing})$$
3. If true, registration is rejected with HTTP 409 Conflict, returning visual telemetry of the conflicting event so the student cannot double-book their schedule.

### 4.2 Dynamic FIFO Waitlist & Auto-Promotion Engine
1. Each event defines a strict maximum `capacity`.
2. When confirmed registrations equal `capacity`, subsequent applicants receive status `waitlisted` with `waitlist_position = N + 1`.
3. If a confirmed participant cancels their pass:
   - Current registration is marked `cancelled`.
   - The queue finds applicant with `waitlist_position == 1`.
   - The waitlisted student is automatically elevated to `confirmed` with `waitlist_position = 0`.
   - All subsequent waitlisted candidates have their positions decremented by 1.

### 4.3 QR Cryptographic Gate Check-In
1. On confirmed registration, a cryptographically random token `QR-EVT{id}-USR{id}-{salt}` is generated.
2. The client renders an encrypted high-density QR canvas pass.
3. At the venue, an administrator scans the pass via the integrated camera scanner or token reader.
4. The system validates whether the ticket is confirmed and has not yet checked in, updating `attendance_status = 'present'` and recording `check_in_time = NOW()`.

---

## 5. DevOps & Container Technologies Implementation

### 5.1 Docker Multi-Stage Containerization
- **Backend Image:** Employs `node:20-alpine`, runs under an unprivileged `node` user, and exposes a native Docker `HEALTHCHECK` running every 15s.
- **Frontend Image:** Uses a two-stage build: Stage 1 builds optimized minified static assets (`dist/`), and Stage 2 copies assets into an `nginx:alpine` runtime serving HTTP on port 80 with reverse proxying to `http://backend:5000`.

### 5.2 Kubernetes (Minikube) Orchestration
- **Deployments:** Configured with `replicas: 3` for backend and `replicas: 2` for frontend, demonstrating load balancing and high availability.
- **Services:** Decoupled networking using ClusterIP for internal database and backend traffic, and NodePort (Port 30080) for external client ingress.
- **Self-Healing:** Continuous Liveness and Readiness probes (`/health`) automatically restart unhealthy containers and purge failing pods from the service endpoint pool.
- **Horizontal Pod Autoscaling (HPA):** Dynamically scales pods between 2 and 6 based on 60% CPU threshold.

### 5.3 CI/CD Pipeline (GitHub Actions)
The workflow file `.github/workflows/ci-cd.yml` automates the software delivery lifecycle:
1. **CI Stage:** Checks out code, configures Node.js 20, runs unit/logic tests (`backend/test.js`), and verifies React production bundle builds.
2. **CD Stage:** Triggered upon merge to `main`, builds multi-platform Docker images, authenticates via `GITHUB_TOKEN`, and pushes tagged images to GitHub Container Registry (`ghcr.io`).
3. **Manifest Validation Stage:** Executes `kubectl apply --dry-run=client` across all Kubernetes YAML manifests to guarantee deployment syntax correctness prior to production rollout.

---

## 6. Experimental Demonstration & Viva Preparation

| Question | Short Viva Answer |
|---|---|
| **What is your project?** | A containerized web-based College Event Management System featuring schedule conflict detection, QR attendance, and automated CI/CD deployment on Kubernetes. |
| **Why Docker?** | To package the frontend, backend, and database with all dependencies into isolated containers, ensuring portability and eliminating "works on my machine" issues. |
| **Why Kubernetes?** | To orchestrate and manage containerized pods, providing automated self-healing, rolling updates, service discovery, and horizontal scaling. |
| **Why CI/CD?** | To automate building, testing, containerizing, and deploying code changes via GitHub Actions, eliminating manual deployment errors. |
| **What is a Pod?** | The smallest deployable unit in Kubernetes that encapsulates one or more application containers sharing network and storage. |
| **What is Self-Healing?** | When a container or pod crashes, Kubernetes detects the failure through liveness probes and automatically restarts or reschedules a replacement pod. |

---

## 7. Conclusion

The Smart College Event Management System successfully bridges domain-specific college event operational challenges with modern cloud-native DevOps principles. By combining algorithmic conflict prevention, automated waitlists, and QR check-ins with Docker containerization, Kubernetes orchestration, and GitHub Actions CI/CD automation, the project demonstrates a resilient, production-grade cloud computing implementation.
