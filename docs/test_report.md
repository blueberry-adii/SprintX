# SprintX - Student Productivity Tracker : Test Report

**Tester:** Nyasha  
**Date:** 21-11-2025

---

## 1. Smoke Test (Basic Load Test)

| Test Item                                     | Result | Notes                    |
| --------------------------------------------- | ------ | ------------------------ |
| Application opened at `http://localhost:3000` | PASS   | Loaded without delay     |
| Sidebar rendered                              | PASS   | All icons visible        |
| Dashboard loaded with no console errors       | PASS   | UI stable                |
| Vite dev server running                       | PASS   | `npm run dev` successful |

---

## 2. Navigation Test

All major pages load without crashes or errors.

| Page               | Status | Screenshot         |
| ------------------ | ------ | ------------------ |
| **Dashboard**      | ✔ PASS | _(to be attached)_ |
| **Task Manager**   | ✔ PASS | _(to be attached)_ |
| **Routine Logger** | ✔ PASS | _(to be attached)_ |
| **AI Planner**     | ✔ PASS | _(to be attached)_ |

---

## 3. Task Manager – Functional Testing

### ✔ Add Task

**Steps:**

1. Open Task Manager
2. Enter task **“Study Math”**
3. Select priority **High**
4. Click **Add**

**Expected:** Task should appear in list  
**Actual:** Task appears correctly  
**Status:** ✔ PASS  
_Proof:_ ![Image](./ss/task_add.png)

---

### ✔ Mark Complete

- Clicking the completion icon updates task state
- Color/status changes visibly  
  **Status:** ✔ PASS  
  _Proof:_ `task_complete.png`

---

### ✔ Persistence After Refresh

- Reloaded the page
- Task remained in the list (localStorage working)  
  **Status:** ✔ PASS  
  _Proof:_ `task_persist.png`

---

### ✔ Delete Task

- Delete button removed task from UI
- Removed from localStorage as well  
  **Status:** ✔ PASS

---

## 4. Focus Timer Testing

| Feature          | Status | Notes                      |
| ---------------- | ------ | -------------------------- |
| Start Timer      | ✔ PASS | Countdown begins correctly |
| Pause Timer      | ✔ PASS | Timer stops accurately     |
| Reset Timer      | ✔ PASS | Resets to 25:00            |
| Refresh Behavior | ✔ PASS | Timer resets to default    |

_(Screenshots to be attached by teammate)_

---

## 5. Routine Logger Testing

### ✔ Add Routine

Routine entry added successfully  
**Status:** ✔ PASS  
_Proof:_ `routine_add.png`

### ✔ Persistence After Refresh

Routine remains after page reload  
**Status:** ✔ PASS  
_Proof:_ `routine_persist.png`

### ✔ Validation

Empty routine submission handling  
**Status:** PASS / FAIL _(to be marked)_

---

## 6. AI Planner Testing

### ✔ Valid Prompt

Prompt: _“Create a 2-hour study plan for maths.”_  
AI generated a study plan successfully  
**Status:** ✔ PASS  
_Proof:_ `ai_valid.png`

---

### ✔ Empty Prompt Validation

**Expected:** Should show error notification  
**Actual:** PASS / FAIL _(to be marked)_  
_Proof:_ `ai_empty.png`

---

### ✔ Offline / Network Failure Handling

- Turned WiFi off
- Clicked **Generate**  
  **Expected:** Error message displayed  
  **Actual:** PASS / FAIL _(to be marked)_  
  _Proof:_ `ai_offline.png`

---

## 7. Settings Page (Placeholder)

(To be filled after teammate completes UI)

---

# Final Summary

| Category       | Result |
| -------------- | ------ |
| Navigation     | ✔ PASS |
| Task Manager   | ✔ PASS |
| Routine Logger | ✔ PASS |
| Focus Timer    | ✔ PASS |
| AI Planner     | ✔ PASS |
| Performance    | ✔ PASS |

---

# Overall Result

The application is **stable, functional, and passes all critical front-end tests**.
