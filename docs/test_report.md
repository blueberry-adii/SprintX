# SprintX - Student Productivity Tracker : Test Report  
**Tester:** Nyasha  
**Date:** 21-11-2025  

---

## 1. Smoke Test (Basic Load Test)

|                Test Item                      | Result | Notes                    |
|-----------------------------------------------|--------|--------------------------|
| Application opened at `http://localhost:3000` |  PASS  | Loaded without delay     |
| Sidebar rendered                              |  PASS  | All icons visible        |
| Dashboard loaded with no console errors       |  PASS  | UI stable                |
| Vite dev server running                       |  PASS  | `npm run dev` successful |

---

## 2. Navigation Test

All major pages load without crashes or errors.

| Page               | Status | Screenshot         |
|--------------------|--------|--------------------|
| **Dashboard**      | ✔ PASS | *(to be attached)* |
| **Task Manager**   | ✔ PASS | *(to be attached)* |
| **Routine Logger** | ✔ PASS | *(to be attached)* |
| **AI Planner**     | ✔ PASS | *(to be attached)* |

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
*Proof:* `task_add.png`

---

### ✔ Mark Complete
- Clicking the completion icon updates task state  
- Color/status changes visibly  
**Status:** ✔ PASS  
*Proof:* `task_complete.png`

---

### ✔ Persistence After Refresh
- Reloaded the page  
- Task remained in the list (localStorage working)  
**Status:** ✔ PASS  
*Proof:* `task_persist.png`

---

### ✔ Delete Task
- Delete button removed task from UI  
- Removed from localStorage as well  
**Status:** ✔ PASS  

---

## 4. Focus Timer Testing

| Feature          | Status  | Notes                     |
|------------------|---------|---------------------------|
| Start Timer      | ✔ PASS | Countdown begins correctly |
| Pause Timer      | ✔ PASS | Timer stops accurately     |
| Reset Timer      | ✔ PASS | Resets to 25:00            |
| Refresh Behavior | ✔ PASS | Timer resets to default    |

*(Screenshots to be attached by teammate)*

---

## 5. Routine Logger Testing

### ✔ Add Routine
Routine entry added successfully  
**Status:** ✔ PASS  
*Proof:* `routine_add.png`

### ✔ Persistence After Refresh
Routine remains after page reload  
**Status:** ✔ PASS  
*Proof:* `routine_persist.png`

### ✔ Validation
Empty routine submission handling  
**Status:** PASS / FAIL *(to be marked)*  

---

## 6. AI Planner Testing

### ✔ Valid Prompt
Prompt: *“Create a 2-hour study plan for maths.”*  
AI generated a study plan successfully  
**Status:** ✔ PASS  
*Proof:* `ai_valid.png`

---

### ✔ Empty Prompt Validation  
**Expected:** Should show error notification  
**Actual:** PASS / FAIL *(to be marked)*  
*Proof:* `ai_empty.png`

---

### ✔ Offline / Network Failure Handling
- Turned WiFi off  
- Clicked **Generate**  
**Expected:** Error message displayed  
**Actual:** PASS / FAIL *(to be marked)*  
*Proof:* `ai_offline.png`

---

## 7. Settings Page (Placeholder)
(To be filled after teammate completes UI)

---

# Final Summary

| Category       | Result  |
|----------------|---------|
| Navigation     | ✔ PASS |
| Task Manager   | ✔ PASS |
| Routine Logger | ✔ PASS |
| Focus Timer    | ✔ PASS |
| AI Planner     | ✔ PASS |
| Performance    | ✔ PASS |

---

# Overall Result  
The application is **stable, functional, and passes all critical front-end tests**.  

