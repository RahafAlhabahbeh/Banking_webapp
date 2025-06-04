
# Banking Web Application

## 🛠️ How to Run This Project

### Backend Setup

1. Open a terminal and navigate to the `bankingBackend` folder:
```bash
cd bankingBackend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

⚠️ Make sure port `3001` is not used by another service.

---

### Frontend Setup

1. Open another terminal and navigate to the `banking-ui` folder:
```bash
cd banking-ui
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the Vite development server:
```bash
npm run dev
```

⚠️ Make sure it runs on port `5173`.

---

### Access the App

- Open your browser and go to:
```
http://localhost:5173
```

Make sure the backend (`http://localhost:3001`) is running for API requests to work.

---

### Test Server Connection

To test if the backend is working correctly, try visiting:
```
http://localhost:3001/test-db
```

It should return a success message if the database is connected.

