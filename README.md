# Academy Intelligence Hub (Major Web)
## รายงานโครงการพัฒนาโปรแกรมคอมพิวเตอร์ (Full Project Specification)

---

### 1. กิตติกรรมประกาศ (Acknowledgement)
โครงการได้รับการพัฒนาภายใต้การดูแลและสนับสนุนด้านโครงสร้างข้อมูลโดยระบบ **Supabase Ecosystem** และขอขอบพระคุณเครือข่ายความร่วมมือทางวิชาการระหว่างนักพัฒนา เพื่อสร้างแพลตฟอร์มศูนย์กลางข้อมูลวิศวกรรมสำหรับนักเรียนระดับมัธยมศึกษาตอนปลาย

### 2. บทคัดย่อ (Abstract)
**ภาษาไทย**: Academy Intelligence Hub เป็นแพลตฟอร์มปฏิบัติการด้านการศึกษาที่เน้นการบริหารจัดการข้อมูลคณะและมหาวิทยาลัยในรูปแบบ Tactical Dashboard โดยมีฟีเจอร์หลักคือการดึงชุดข้อมูลคุณสมบัติเกณฑ์การรับสมัคร (Intelligence Database) มาวิเคราะห์และแสดงผลแบบเรียลไทม์ พร้อมระบบสนับสนุนการสื่อสารและการวางแผนกลยุทธ์ผ่านปฏิทินปฏิบัติการ

**English**: The Academy Intelligence Hub is an educational operations platform designed as a tactical dashboard for university admission management. It features a real-time synchronized Intelligence Database, a communication hub for project collaboration, and a strategic scheduling system for high-stakes academic planning.

**คำสำคัญ (Keywords)**: Academic Intelligence, Tactical Dashboard, Supabase Real-time, University Admissions.

### 3. บทนำ (Introduction)
ในปัจจุบัน ข้อมูลเกณฑ์การรับสมัครเข้าศึกษาระดับมหาวิทยาลัยมีความซับซ้อนและกระจัดกระจาย "Major Web" จึงถูกพัฒนาขึ้นเพื่อเป็นศูนย์กลางข้อมูลวิศวกรรม (Engineering Hub) ที่มีการจัดระเบียบข้อมูลแบบ Dossier ประหยัดเวลาในการค้นหา และเพิ่มประสิทธิภาพในการทำงานร่วมกันเป็นทีมผ่านระบบกลุ่มสื่อสาร

### 4. สารบัญ (Table of Contents)
1. [กิตติกรรมประกาศ](#1-กิตติกรรมประกาศ-acknowledgement)
2. [บทคัดย่อ](#2-บทคัดย่อ-abstract)
3. [วัตถุประสงค์และเป้าหมาย](#5-วัตถุประสงค์และเป้าหมาย-objectives--goals)
4. [รายละเอียดของการพัฒนา](#6-รายละเอียดของการพัฒนา-development-details)
5. [กลุ่มผู้ใช้โปรแกรม](#7-กลุ่มผู้ใช้โปรแกรม-target-audience)
6. [ปัญหาและอุปสรรค](#9-ปัญหาและอุปสรรค-problems--obstacles)
7. [ภาคผนวก](#14-ภาคผนวก-appendix)

### 5. วัตถุประสงค์และเป้าหมาย (Objectives & Goals)
- เพื่อสร้างฐานข้อมูลเกณฑ์การรับสมัครมหาวิทยาลัยที่สามารถปรับปรุงข้อมูลได้แบบเรียลไทม์
- เพื่อสนับสนุนการทำงานเป็นกลุ่ม (Recruitment & Collaboration) ผ่านระบสื่อสารพิกัดความถี่
- เพื่อติดตามความคืบหน้าของภารกิจทางการศึกษาผ่านปฏิทินยุทธวิธี (Tactical Calendar)

### 6. รายละเอียดของการพัฒนา (Development Details)

#### 6.1 เนื้อเรื่องย่อ (Story Board) & ภาพประกอบ
โปรแกรมมีโครงสร้างเป็นโมดูลาร์ (Modular) แบ่งสัดส่วนตามภารกิจ:
- **Major Intel Grid**: แสดงผลรายละเอียดคณะแบบ Unit Brick
- **Mission Loadout**: รายการคณะที่ถูกเลือก (Deployed Targets) ในรูปแบบ Ribbon Sidebar
- **Communication Hub**: ระบบสื่อสารแบบ Real-time Group Chat

#### 6.2 ทฤษฎีหลักการและเทคโนโลยีที่ใช้ (Theory & Technology)
- **Data Synchronization**: ใช้ระบบ Real-time Subscription จาก Supabase เพื่อรักษาความสดของข้อมูล
- **Industrial UI/UX Design**: การออกแบบเน้น Minimalist (Black & White) เพื่อลดการรบกวนทางสายตาและเพิ่มความขรึมขลังในระดับปฏิบัติการ
- **Algorithm: Dynamic Hierarchy Reconstruction**:
  - **Input**: ชุดข้อมูลแบบระนาบ (Flat Data) จากตาราง `major_intel`
  - **Process**: 
    1. วนลูปผ่านอาเรย์ข้อมูลดิบ 
    2. ใช้ Hash Map (uniMap) เพื่อจัดกลุ่ม Faculty ภายใต้ University 
    3. ตรวจสอบการซ้ำซ้อนของ Node และจัดระเบียบ Array of Objects ใหม่
  - **Output**: โครงสร้างข้อมูลแบบ Tree ที่ UI สามารถนำไป Render ได้ทันทีแบบ Recursive

#### 6.3 เครื่องมือที่ใช้ในการพัฒนา (Development Tools)
- **Frontend**: HTML5, Vanilla JavaScript (ES6+), CSS3
- **Design System**: Bootstrap 5 + LINE Seed Font Family
- **Backend & Database**: Supabase (PostgreSQL)
- **Deployment**: Local Environment / GitHub Services / Vercel host

#### 6.4 รายละเอียดโปรแกรม (Software Specification)
- **Input Specification**: 
  - `auth_id`: รหัสระบุตัวตนผู้ใช้
  - `intel_payload`: ชุดข้อมูลคณะประกอบด้วย (Uni, Fac, Major, Tuition, Tags)
- **Output Specification**:
  - `Unit Brick Grid`: การแสดงผลการ์ดข้อมูลแบบสมมาตร
  - `Mission Control Ribbon`: แถบสถานะเป้าหมายที่เลือกไว้
- **Functional**: ระบบลงทะเบียน (Authentication), การจัดการโปรไฟล์แบบละเอียด, การดึงข้อมูลจาก Cloud Database

#### 6.5 ขอบเขตและข้อจำกัด (Scope & Limitations)
- เน้นชุดข้อมูลคณะวิศวกรรมศาสตร์และวิทยาศาสตร์ของมหาวิทยาลัยชั้นนำ (CU) เป็นหลัก
- ระบบทำงานได้ดีที่สุดในความละเอียดหน้าจอแบบ Desktop สำหรับ Tactical View

### 7. กลุ่มผู้ใช้โปรแกรม (Target Audience)
นักเรียนระดับมัธยมศึกษาตอนปลายที่เน้นการเตรียมตัวเข้าสู่คณะสายวิศวกรรมศาสตร์และเทคโนโลยี

### 8. คู่มือการใช้งานอย่างละเอียด (User Operations Manual)
1. **การลงทะเบียน**: เข้าสู่ระบบผ่านหน้า Login หากยังไม่มีบัญชีให้ไปที่ Register เพื่อสร้าง Operative ID
2. **การสำรวจข้อมูล**: ไปที่โมดูล Academy เพื่อดูรายชื่อมหาวิทยาลัยและคณะผ่านระบบค้นหา
3. **การเลือกเป้าหมาย (Deployment)**: คลิกปุ่ม DEPLOY บนการ์ดเมเจอร์ที่สนใจ คณะจะถูกเพิ่มเข้าไปใน Mission Control Ribbon ทันที
4. **การดูรายงานเชิงลึก**: คลิกที่ชื่อคณะใน Grid เพื่อเปิด Intelligence Dossier ดูเกณฑ์คะแนนและค่าเทอม
5. **การทำงานร่วมกัน**: ใช้หน้า Communication เพื่อสร้างยูนิตโปรเจกต์และแชทกับเพื่อนร่วมทีมแบบเรียลไทม์

### 9. ผลของการทดสอบโปรแกรม (Testing Results)
- ระบบสามารถโหลดข้อมูลจาก Supabase ภายใต้ความล่าช้า (Latency) ต่ำกว่า 500ms
- การส่งข้อความแชทและอัปเดตปฏิทินแสดงผลแบบเรียลไทม์ครบถ้วนทุกเครื่องที่เชื่อมต่อ

### 10. ปัญหาและอุปสรรค (Problems & Obstacles)
- การคัดกรองข้อมูลคณะที่ซับซ้อน (แก้ไขโดยการใช้ระบบ SQL Filtering และ JSONB Storage)
- การจัดการสิทธิ์เข้าถึงข้อมูลระดับแถว (แก้ไขโดยการกำหนด RLS Policies ใน Supabase)

### 11. แนวทางในการพัฒนา (Future Directions)
- เพิ่มระบบการแจ้งเตือนผ่าน Mobile Push Notification สำหรับวันปิดรับสมัคร
- ขยายฐานข้อมูลครอบคลุมคณะสายศิลป์และสถาปัตยกรรมศาสตร์จากสถาบันอื่นๆ

### 12. ข้อสรุป (Conclusion)
Major Web: Academy Intelligence Hub เป็นเครื่องมือที่มีประสิทธิภาพในการรวมรวบคลังความรู้และปฏิบัติการทางวิชาการ ช่วยให้นักพัฒนาและผู้ใช้งานสามารถเข้าถึงข้อมูลเกณฑ์การรับสมัครได้อย่างแม่นยำ

### 13. เอกสารอ้างอิง (References)
- Supabase Documentation (Auth, Storage, Database)
- Bootstrap 5 Component Documentation
- FullCalendar v6 API Documentation

### 14. สถานที่ติดต่อผู้พัฒนา (Developer Contact)
**Mr. Raphee Rattanamanoonporn (Ray) | Ms. Rochaya Chawengkijwanich (View) | Mr Papawit Saeliw (August)**
Satit Prasarnmit Demonstration School | Ai Major

### 15. ภาคผนวก (Appendix)
- **คู่มือการติดตั้ง**: โปรดอ่านไฟล์ `README.md` และดำเนินการตามขั้นตอน [Deployment](#-deployment--configuration)
- **ข้อตกลงการใช้งาน (Disclaimer)**: ข้อมูลเกณฑ์การรับสมัครเป็นการประมาณการตามประกาศล่าสุด โปรดตรวจสอบข้อมูลเป็นทางการจากมหาวิทยาลัยอีกครั้ง
- **Poster**: อยู่ในระหว่างการจัดทำฝ่ายออกแบบสื่อประชาสัมพันธ์
