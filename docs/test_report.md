# 🌟 **StudentFlow – Student Productivity Tracker**  
### **Comprehensive Quality Assurance Test Report**  
**Tester:** Nyasha  
**Date:** 21-11-2025  

---

# 🧪 **Quality Summary**
All major modules were tested for functionality, usability, persistence, error handling, and navigation stability.  

---

# 1️⃣ **Smoke Test**

| Test Case | Expected Outcome | Result | Notes |
|-----------|------------------|--------|--------|
| Launch AWS Deployment | App loads without errors | ✔ PASS | No console warnings |
| Sidebar Rendering | All navigation links appear correctly | ✔ PASS | Smooth transitions |
| Route Stability | All pages load with no crashes | ✔ PASS | Stable rendering |

---

# 2️⃣ **Dashboard Testing**

### **Objective:** Validate analytics, productivity metrics, charts & UI.

📸 `./ss/dashboard.png`

**Status:** ✔ PASS  
Dashboard charts and widgets rendered correctly with no lag.

---

# 3️⃣ **Task Manager Testing**

### ✔ **Add Task**
- Input: “Study Math”, Priority: High  
- Task appears immediately  
📸 `./ss/task_add.png`

### ✔ **Mark Complete**
- UI state updates visually  
📸 `./ss/task_complete.png`

### ✔ **Persistence Check**
- Task remains after page refresh  
📸 `./ss/task_persist.png`

### ✔ **Task Manager Page**
📸 `./ss/taskManager.png`

**Status:** ✔ PASS

---

# 4️⃣ **Focus Timer Testing**

| Action | Expected Behavior | Result |
|--------|--------------------|--------|
| Default Load | Timer shows initial value | ✔ PASS |
| Start Timer | Countdown begins smoothly | ✔ PASS |
| Pause Timer | Halts immediately | ✔ PASS |
| Reset Timer | Resets to base time | ✔ PASS |

📸 `./ss/timer_default.png`  
📸 `./ss/timer_running.png`  
📸 `./ss/timer_paused.png`  
📸 `./ss/timer_reset.png`

---

# 5️⃣ **Routine Logger Testing**

### ✔ Add Routine  
📸 `./ss/routine_add.png`

### ✔ Persistence After Refresh  
📸 `./ss/routine_persist.png`

### ✔ Routine Logger Overview  
📸 `./ss/routineLogger.png`

**Status:** ✔ PASS

---

# 6️⃣ **AI Insights (Smart Planner) Testing**

### ✔ **AI Insights Page Loaded**
📸 `./ss/ai_insights_page.png`

### ✔ **Valid Prompt Response**
Prompt: *“Create a 2-hour study plan for maths.”*  
📸 `./ss/ai_valid.png`

### ✔ **General AI Insights**
📸 `./ss/ai_insights.png`

**Status:** ✔ PASS  
AI module responds correctly with meaningful content.

---

# 7️⃣ **Profile Page Testing**

### ✔ Profile Page  
📸 `./ss/profile.png`

### ✔ Edit Profile Section  
📸 `./ss/profile_edit.png`

**Status:** ✔ PASS  
Information cards and layout load consistently.

---

# 8️⃣ **Settings Page Testing**

### ✔ Settings Page Overview  
📸 `./ss/settings.png`

### ✔ Settings Toggles  
📸 `./ss/settings_toggle.png`

**Status:** ✔ PASS  
All components responsive and error-free.

---

# 9️⃣ **Logout Testing**

| Test | Expected Outcome | Result |
|------|------------------|--------|
| Logout Functionality | Redirects user & ends session | ✔ PASS |



---

# 🏆 **FINAL SUMMARY**

| Module | Result |
|--------|---------|
| Dashboard | ✔ PASS |
| Task Manager | ✔ PASS |
| Focus Timer | ✔ PASS |
| Routine Logger | ✔ PASS |
| AI Insights | ✔ PASS |
| Profile | ✔ PASS |
| Settings | ✔ PASS |
| Logout | ✔ PASS |

---

# ✅ **OVERALL CONCLUSION**
StudentFlow is a **stable, fully functional, visually consistent** productivity platform.  


