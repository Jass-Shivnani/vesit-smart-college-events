# Smart College Event Management System with CI/CD
### Advanced Cloud Computing & Container Technologies Mini-Project

**Institution:** Vivekanand Education Society's Institute of Technology (VESIT)  
**Academic Class & Group:** D17A • Batch 2, Group 11  
**Team Members:**
- **Prachi Lund (Roll No. 39)**
- **Riya Khialani (Roll No. 34)**
- **Ankita Kukreja (Roll No. 36)**
- **Shivam Makhija (Roll No. 41)**

---

## 📌 Project Overview
The **Smart College Event Management System** is a containerized, cloud-native event participation platform designed to replace fragmented Google Forms and paper rosters with an automated, scalable web application.

Moving beyond standard CRUD systems, the platform introduces:
1. 🚨 **Smart Schedule Conflict Detection:** Algorithmic prevention of overlapping event registrations ($Start_A < End_B \land End_A > Start_B$).
2. 🧠 **Queue-Based Waitlisting & Auto-Promotion:** Manages full-capacity events through a dynamic FIFO queue with automatic promotion upon seat cancellation.
3. 📱 **QR-Code Digital Passes & Venue Gate Scanner:** Real-time cryptographic QR ticket verification for event attendance.
4. 📊 **Admin Analytics Dashboard:** Live KPI cards, registration bar charts, attendance percentage tracking, and department engagement breakdown.
5. 🐳 **Docker Multi-Stage Containerization:** Production Dockerfiles for frontend (React + Nginx) and backend (Node.js Alpine).
6. ☸️ **Kubernetes (Minikube) Orchestration:** Multi-replica backend deployment, health probes, PersistentVolumeClaims, and Horizontal Pod Autoscalers (HPA).
7. 🚀 **Automated CI/CD Pipeline:** GitHub Actions workflow executing automated tests, Docker image builds, and GitHub Container Registry (GHCR) publishing.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS (Glassmorphism), Lucide Icons, QR Canvas |
| **Backend** | Node.js, Express.js (REST API), JWT Auth, Universal Database Adapter |
| **Database** | MySQL 8.0 with automated migrations (and zero-config in-memory fallback for local dev) |
| **Containerization** | Docker, Docker Compose, Multi-stage Dockerfiles |
| **Orchestration** | Kubernetes, Minikube, Pods, Deployments, ClusterIP & NodePort Services, HPA |
| **CI/CD** | GitHub, GitHub Actions, GitHub Container Registry (GHCR) |

---

## ⚡ Quick Start (Local Run in 1 Command)

No Docker or MySQL required on your local machine to test immediately:

```bash
# 1. Clone or navigate to the repository
cd "c:/Jass/ACC DEVP/Riya"

# 2. Run the unified development runner
npm start
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

---

## 🐳 Running with Docker Compose

To run the full multi-container stack (MySQL + Backend + Frontend/NGINX):

```bash
# Build and start all 3 containers
docker-compose up --build

# Stop all containers and clean volumes
docker-compose down -v
```

Services exposed:
- **Frontend / NGINX:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **MySQL Database:** `localhost:3306`

---

## ☸️ Deploying to Kubernetes (Minikube)

```bash
# 1. Start Minikube
minikube start --driver=docker

# 2. Deploy secrets and storage
kubectl apply -f k8s/mysql-secret.yaml
kubectl apply -f k8s/mysql-pvc.yaml

# 3. Deploy MySQL, Backend (3 Replicas), and Frontend
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/hpa.yaml

# 4. Check pod status
kubectl get pods

# 5. Open frontend in browser
minikube service frontend-service
```

---

## 🧪 Automated CI/CD Testing

Run the automated integration and unit test suite:

```bash
npm test
```

Expected output:
```
🧪 Starting ACC Devops Automated Tests...
✅ Test 1.1 Passed: Overlapping events detected correctly.
✅ Test 1.2 Passed: Non-conflicting time slots allowed.
✅ Test 1.3 Passed: Adjacent events allowed.
✅ Test 2 Passed: Queue-based waitlist promotion operates FIFO correctly.
🎉 ALL CI/CD INTEGRATION TESTS PASSED SUCCESSFULLY! Ready for deployment.
```

---

## 📚 Deliverables & Documentation
- **Academic Project Report:** [`report.md`](file:///c:/Jass/ACC%20DEVP/Riya/report.md)
- **Presentation & Viva Script:** [`presentation_notes.md`](file:///c:/Jass/ACC%20DEVP/Riya/presentation_notes.md)
- **Kubernetes Minikube Guide:** [`k8s/k8s-setup.md`](file:///c:/Jass/ACC%20DEVP/Riya/k8s/k8s-setup.md)
- **CI/CD Workflow:** [`.github/workflows/ci-cd.yml`](file:///c:/Jass/ACC%20DEVP/Riya/.github/workflows/ci-cd.yml)
