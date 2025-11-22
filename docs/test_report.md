# 🌟 **StudentFlow – Student Productivity Tracker**  
### **Comprehensive Quality Assurance Test Report**  
**Tester:** Nyasha Chauhan
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

![Dashboard](./ss/dashboard.png)

**Status:** ✔ PASS  
Dashboard charts and widgets rendered correctly with no lag.

---

# 3️⃣ **Task Manager Testing**

### ✔ **Add Task**
- Input: “Study Math”, Priority: High  
- Task appears immediately  

![Task Add](./ss/task_add.png)

### ✔ **Mark Complete**
- UI state updates visually  

![Task Complete](./ss/task_complete.png)

### ✔ **Persistence Check**
- Task remains after page refresh  

![Task Persistence](./ss/task_persist.png)

### ✔ **Task Manager Page**

![Task Manager](./ss/taskManager.png)

**Status:** ✔ PASS

---

# 4️⃣ **Focus Timer Testing**

| Action | Expected Behavior | Result |
|--------|--------------------|--------|
| Default Load | Timer shows initial value | ✔ PASS |
| Start Timer | Countdown begins smoothly | ✔ PASS |
| Pause Timer | Halts immediately | ✔ PASS |
| Reset Timer | Resets to base time | ✔ PASS |

![Timer Default](./ss/timer_default.png)  
![Timer Running](./ss/timer_running.png)  
![Timer Paused](./ss/timer_paused.png)  
![Timer Reset](./ss/timer_reset.png)

---

# 5️⃣ **Routine Logger Testing**

### ✔ Add Routine  

![Routine Add](./ss/routine_add.png)

### ✔ Persistence After Refresh  

![Routine Persist](./ss/routine_persist.png)

### ✔ Routine Logger Overview  

![Routine Logger](./ss/routineLogger.png)

**Status:** ✔ PASS

---

# 6️⃣ **AI Insights (Smart Planner) Testing**

### ✔ **AI Insights Page Loaded**

![AI Insights Page](./ss/ai_insights_page.png)

### ✔ **Valid Prompt Response**
Prompt: *“Create a 2-hour study plan for maths.”*  

![AI Valid](./ss/ai_valid.png)

### ✔ **General AI Insights**

![AI Insights](./ss/ai_insights.png)

**Status:** ✔ PASS  
AI module responds correctly with meaningful content.

---

# 7️⃣ **Profile Page Testing**

### ✔ Profile Page  

![Profile](./ss/profile.png)

### ✔ Edit Profile Section  

![Profile Edit](./ss/profile_edit.png)

**Status:** ✔ PASS

---

# 8️⃣ **Settings Page Testing**

### ✔ Settings Page Overview  

![Settings](./ss/settings.png)

### ✔ Settings Toggles  

![Settings Toggle](./ss/settings_toggle.png)

**Status:** ✔ PASS  

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
StudentFlow is a **stable, fully functional, visually consistent** productivity platform ready for deployment and demonstration.

