# MINI-PROJECT SHORT TECHNICAL REPORT
**Course:** Cross-Platform Mobile App Development (VKU)  
**Mini-Project Title:** Mini-Project 1: Offline Data Collection with Hybrid Mobile Architecture (PWA & Capacitor Android)  
**Team / Student Name:** Lê Cảm (Mã SV: 23IT022)  
**Submission Date:** 21/09/2026  

---

## 1. GENERAL INFORMATION & DELIVERABLE LINKS
* **Team Members:**
  1. **Lê Cảm** — Student ID: **23IT022** — Role: **Solo Developer (100% Contribution: System Architecture, PWA UI/UX, Dexie IndexedDB, Capacitor 7 Native Plugins, Cloudflare Edge API)** — Contribution: **100%**
* **🔗 Live Demo URL (Primary):** [https://vku-field-survey-capacitor.pages.dev](https://vku-field-survey-capacitor.pages.dev)  
* **🔗 Live Demo URL (Mirror):** [https://camle-vku-field-survey.pages.dev](https://camle-vku-field-survey.pages.dev)  
* **☁️ Central Cloud Edge API:** [https://vku-field-survey-capacitor.lecam.workers.dev](https://vku-field-survey-capacitor.lecam.workers.dev)  
* **💻 GitHub Repository:** [https://github.com/CAMLC25/vku-field-survey-capacitor](https://github.com/CAMLC25/vku-field-survey-capacitor)  
* **📦 Pre-built Android APK:** [`vku-field-survey-debug.apk`](./vku-field-survey-debug.apk) *(7.4 MB — Biên dịch Gradle Wrapper, sẵn sàng cài đặt trên Android 8.0 - 15)*  
* **📄 Technical Report Formats:** [Word (`TECHNICAL_REPORT.docx`)](./TECHNICAL_REPORT.docx) | [PDF (`TECHNICAL_REPORT.pdf`)](./TECHNICAL_REPORT.pdf) | [Markdown (`TECHNICAL_REPORT.md`)](./TECHNICAL_REPORT.md)  

---

## 2. FEATURE IMPLEMENTATION CHECKLIST

| # | Required Feature | Status | Implementation Details & Acceptance Level |
|:---:|---|:---:|---|
| **1** | **Responsive Mobile-First Viewport** | ✅ Complete | Giao diện chuẩn Mobile-First, tương thích hoàn hảo notch/tai thỏ qua safe-area insets. Thanh điều hướng 3 tab chân trang tiện lợi. Hỗ trợ chuyển đổi song ngữ tức thì (Tiếng Việt / English). |
| **2** | **Local Offline Persistence (ACID)** | ✅ Complete | Sử dụng Dexie.js (IndexedDB) quản lý 2 bảng `surveys` và `syncQueue`. Khởi động và ghi nhận 100% không cần mạng (<30ms). Lưu trữ ảnh nhị phân dạng Blob/Data URL an toàn. |
| **3** | **Automatic Sequential Background Sync** | ✅ Complete | Tích hợp Background Sync API (`sync-surveys`) kết hợp `@capacitor/network` và sự kiện `online`. Duyệt tuần tự từng biên bản với độ trễ 300ms chống nghẽn socket di động. |
| **4** | **Hardware Access: Native Camera** | ✅ Complete | Tích hợp `@capacitor/camera` trên Android Native và HTML5 Canvas fallback trên Web. Tự động nén ảnh xuống chuẩn 1280px (~180KB JPEG), giảm 90% dung lượng. Hỗ trợ Lightbox Modal phóng to ảnh. |
| **5** | **Hardware Access: GPS Geolocation** | ✅ Complete | Tích hợp `@capacitor/geolocation`. Thu thập tọa độ vĩ độ/kinh độ chính xác, ánh xạ ra địa chỉ chi tiết cơ sở VKU (Khu V, K, A, B, Thư viện) và tích hợp nút 1-chạm mở trực tiếp Google Maps. |
| **6** | **Hardware Access: Network Monitoring** | ✅ Complete | Tích hợp `@capacitor/network` theo dõi phần cứng mạng thời gian thực. Kết hợp Active Ping Probe `/api/health` loại bỏ hiện tượng "mạng ảo" (false-positive online). |
| **7** | **Local Notifications & Secure Storage** | ✅ Complete | Tích hợp `@capacitor/local-notifications` với kênh Android `vku-survey-channel` (rung/chuông khi lưu offline và đồng bộ xong). Sử dụng `@capacitor/preferences` (Android SharedPreferences) bảo vệ phiên làm việc. |
| **8** | **Idempotent Data Dispatch** | ✅ Complete | Sử dụng client-generated UUIDv4 làm khóa chính duy nhất trên Cloudflare KV. Khi gửi lại (retry), máy chủ ghi đè an toàn (upsert), triệt tiêu hoàn toàn nguy cơ nhân đôi dữ liệu. |
| **9** | **Role-Based Data Isolation (RBAC)** | ✅ Complete | Cán bộ kiểm định chỉ quản lý các bản ghi nháp do mình tạo (`createdByEmail`). Quản trị viên (Admin) giám sát dữ liệu toàn trường, quản trị tài khoản và xuất báo cáo CSV UTF-8. |
| **10** | **Packaging Installable Android APK** | ✅ Complete | Đóng gói Capacitor 7 hoàn chỉnh, cấu hình quyền `AndroidManifest.xml`. Biên dịch thành công tệp APK độc lập `vku-field-survey-debug.apk` (~7.4 MB) qua Gradle Wrapper. |

---

## 3. TECHNICAL ARCHITECTURE & PROJECT STRUCTURE

### 3.1. Cấu Trúc Thư Mục Dự Án (Directory Structure)
```
vku-field-survey-capacitor/
├── android/                         # Dự án Native Android đóng gói Capacitor 7 (Gradle)
│   ├── app/src/main/AndroidManifest.xml  # Cấp quyền Camera, Fine Location, Notifications
│   └── build/outputs/apk/debug/     # Tệp APK sau khi biên dịch
├── public/                          # Tài nguyên PWA tĩnh (Web App Manifest, Icons 192/512px)
├── src/
│   ├── components/                  # Giao diện React (SurveyForm, SurveyList, Header, NavigationBar)
│   ├── config/                      # Cấu hình API và endpoint Cloudflare backend
│   ├── db/                          # Cấu hình Dexie.js IndexedDB ('vku-field-survey') & syncQueue
│   ├── hooks/                       # React hooks quản lý kết nối, đồng bộ và ngôn ngữ
│   ├── pages/                       # HomePage, HistoryPage, AdminDashboardPage, LoginPage
│   ├── services/                    # Geolocation, Camera, Network, LocalNotifications, Storage, Sync
│   ├── types/                       # TypeScript interfaces (Survey, User, LocationResult)
│   └── utils/                       # Location resolver (tọa độ & địa chỉ VKU), Image compression
├── worker.js                        # Cloudflare Edge Worker API & KV Namespace Storage
├── capacitor.config.ts              # Cấu hình Capacitor Native Runtime
├── TECHNICAL_REPORT.md              # Báo cáo kỹ thuật Markdown
├── TECHNICAL_REPORT.docx            # Báo cáo kỹ thuật bản Microsoft Word
├── TECHNICAL_REPORT.pdf             # Báo cáo kỹ thuật bản Adobe PDF
└── vku-field-survey-debug.apk       # Tệp cài đặt Android APK hoàn chỉnh (7.4 MB)
```

### 3.2. Luồng Quản Lý Trạng Thái (State Management Flow)
* **Tầng Giao Diện (UI Layer):** Sử dụng React 18 functional components kết hợp Tailwind CSS. Tận dụng `useLiveQuery` từ Dexie để giao diện tự động phản ứng và cập nhật tức thì theo thời gian thực (reactive updates) mỗi khi có bản ghi mới được thêm, sửa hoặc xóa trong IndexedDB mà không cần nạp lại trang.
* **Tầng Dữ Liệu Ngoại Tuyến (Offline Storage Layer):** Dexie IndexedDB là nguồn chân lý duy nhất (Single Source of Truth) của máy khách. Khi lập biên bản, dữ liệu lưu ngay vào bảng `surveys` kèm trạng thái `PENDING_SYNC` và khóa UUIDv4 được đẩy vào hàng đợi `syncQueue`.
* **Tầng Đám Mây (Cloud Edge Layer):** Cloudflare Workers tiếp nhận các gói tin POST qua REST API, lưu trữ phân tán trên Cloudflare KV (`SURVEYS_KV`). Hỗ trợ đồng bộ hai chiều (`pullSurveysFromCloud()`) khi cán bộ chuyển đổi thiết bị.

### 3.3. Chiến Lược Xử Lý Ngoại Lệ & Khả Năng Chịu Lỗi (Exception Handling Strategies)
* **Khắc phục lỗi treo Promise Service Worker:** Khi thiết bị mất mạng sâu, lệnh `await navigator.serviceWorker.ready` có thể bị treo vô hạn trong WebKit/Chromium. Dự án bọc lệnh đăng ký sync bằng `Promise.race` kèm Timeout 1.000ms: nếu Service Worker chưa sẵn sàng, ứng dụng vẫn xác nhận lưu thành công vào IndexedDB và dự phòng kích hoạt đồng bộ sau.
* **Chống hiện tượng mạng ảo (Active Network Probing):** `navigator.onLine` thường báo mạng khả dụng ngay cả khi kết nối vào Wi-Fi không có Internet. Ứng dụng triển khai hàm `checkServerHealth()` gửi HTTP GET siêu nhẹ tới `/api/health` kèm `?_t=Date.now()` (timeout 3s). Nếu không nhận được HTTP 200, hệ thống giữ nguyên trạng thái ngoại tuyến an toàn và hoãn tiến trình đồng bộ.
* **Dự phòng định vị an toàn (Graceful Geolocation Fallback):** Khi chạy trên môi trường không có GPS vệ tinh hoặc bị từ chối quyền, `resolveSurveyCoordinates()` tự động ánh xạ vị trí chuẩn xác dựa trên mã tòa nhà (`Khu V`, `Khu K`, `Khu A`, `Khu B`) và gắn kèm địa chỉ trường VKU để dữ liệu biên bản luôn hợp lệ.

---

## 4. EMPIRICAL EVIDENCE & SCREENSHOTS

### 4.1. Minh Chứng 1: Màn Hình Khởi Động & Giám Sát Kết Nối Thời Gian Thực
* **Mô tả:** Màn hình Tổng quan Điều hành (KPI Home) thống kê số lượng biên bản theo 4 khu tòa nhà VKU, tỷ lệ thiết bị đạt chuẩn và danh sách việc cần xử lý. Huy hiệu trạng thái mạng hiển thị động: **`TRỰC TUYẾN (ONLINE)`** (màu xanh lá) khi có kết nối Internet thật hoặc **`NGOẠI TUYẾN (OFFLINE)`** (màu hổ phách) khi ngắt kết nối.
* **Thành phần kỹ thuật:** `@capacitor/network`, `NetworkStatusListener`, `ActivePingProbe`.

### 4.2. Minh Chứng 2: Form Lập Biên Bản Khảo Sát & Thẻ Định Vị GPS Hiện Trường
* **Mô tả:** Giao diện cho phép chọn nhanh cơ sở vật chất bằng 1 chạm: 4 Tòa nhà VKU, 5 Tầng và 10 Phòng học tiêu chuẩn. Tích hợp thẻ GPS hiển thị trực tiếp:
  - Tọa độ kinh độ / vĩ độ chính xác: `15.97526° N, 108.25324° E (±25m)`.
  - Địa chỉ hành chính cụ thể: `📍 Khu V, Trường ĐH CNTT&TT Việt - Hàn, 470 Trần Đại Nghĩa, Q. Ngũ Hành Sơn, TP. Đà Nẵng`.
  - Nhãn nhận diện: `🛰️ GPS Trực tiếp` hoặc `🏛️ Khuôn viên VKU`.
* **Thành phần kỹ thuật:** `@capacitor/geolocation`, `HTML5 Canvas Compressor`, `resolveSurveyCoordinates()`.

### 4.3. Minh Chứng 3: Sổ Biên Bản Khảo Sát Ngoại Tuyến & Mở Vị Trí Google Maps
* **Mô tả:** Danh sách biên bản được gắn nhãn trạng thái rõ ràng: `ĐÃ GỬI MÁY CHỦ` (Xanh), `CHỜ GỬI` (Hổ phách), `LỖI GỬI` (Đỏ). Mỗi thẻ biên bản hiển thị ảnh thumbnail tư liệu (48x48px), nhấn để phóng to toàn màn hình. Khối địa chỉ GPS hiển thị nút bấm **`Mở Google Maps ↗`** điều hướng thẳng tới vị trí khảo sát trên bản đồ vệ tinh.
* **Thành phần kỹ thuật:** `Dexie.js IndexedDB`, `@capacitor/local-notifications`, `Lightbox Modal`.

### 4.4. Minh Chứng 4: Bảng Điều Hành Quản Trị Viên (Admin Center) & Xuất Báo Cáo CSV
* **Mô tả:** Bảng quản trị trung tâm dành cho Ban Quản lý Cơ sở vật chất:
  - Thống kê toàn diện sự cố cấp độ cao (Mức 1 & 2), thiết bị bảo trì (Mức 3) và vận hành tốt (Mức 4 & 5).
  - Cột VỊ TRÍ hiển thị tên tòa nhà, phòng, địa chỉ chi tiết và liên kết bản đồ Google Maps.
  - Bộ lọc theo tòa nhà, tình trạng hư hỏng, hỗ trợ cấp tài khoản cán bộ mới và nút bấm **Xuất CSV** định dạng UTF-8 có BOM.
* **Thành phần kỹ thuật:** `Cloudflare Workers KV REST API`, `AdminDashboardPage`, `CSV UTF-8 Generator`.

---

## 5. TECHNICAL CHALLENGES & RESOLUTIONS

### 5.1. Thách Thức 1: Nghẽn Băng Thông & Nguy Cơ Trùng Lặp Bản Ghi Khi Đồng Bộ Hàng Loạt
* **Hiện tượng:** Cán bộ khảo sát ghi nhận 15–20 biên bản trong khu vực mất mạng. Khi bước ra vùng có Wi-Fi, việc gửi đồng thời toàn bộ qua `Promise.all()` làm nghẽn socket mạng di động, gây lỗi timeout hàng loạt. Đồng thời, nếu người dùng bấm "Gửi tất cả" nhiều lần, server có nguy cơ tạo ra các bản ghi trùng lặp.
* **Giải pháp khắc phục:**
  1. **Động cơ Đồng bộ Tuần tự (Sequential Sync Engine):** Sử dụng vòng lặp `for...of` gửi từng biên bản một, kết hợp độ trễ 300ms (`await delay(300)`) giữa các lượt gửi để ổn định socket và cung cấp phản hồi trực quan trên thanh tiến trình.
  2. **Kiểm soát Bất biến (Idempotency Key):** Sử dụng mã UUIDv4 sinh tại máy khách làm khóa chính trên Cloudflare KV. Khi nhận cùng một ID, máy chủ thực hiện thao tác *upsert* (cập nhật nếu đã có, tạo mới nếu chưa) và trả về mã HTTP 200, triệt tiêu hoàn toàn nguy cơ trùng lặp dữ liệu.

### 5.2. Thách Thức 2: Báo Mạng Ảo (False-Positive Online) & Bốc Hơi Bộ Nhớ Đệm Ảnh Trên iOS WebKit
* **Hiện tượng:** Trình duyệt di động (đặc biệt là Safari WebKit trên iOS) thường báo `navigator.onLine = true` ngay cả khi chỉ mới kết nối vào cổng captive portal không có Internet, khiến yêu cầu tải lên thất bại và chuyển nhầm trạng thái thành `FAILED`. Ngoài ra, cơ chế dọn dẹp bộ nhớ của iOS có thể hủy các URL `blob:` tạm thời (Blob eviction), khiến ảnh hiện trường bị mất khi mở lại app.
* **Giải pháp khắc phục:**
  1. **Active Health Ping Probe:** Xây dựng dịch vụ mạng kết hợp giữa sự kiện phần cứng của `@capacitor/network` với lệnh HTTP ping thực tế tới `/api/health` (timeout 3 giây). Chỉ khi máy chủ đám mây phản hồi thành công mới chuyển sang trạng thái trực tuyến.
  2. **Durable Base64 & Cloud Storage Hydration:** Nén ảnh trực tiếp sang chuỗi Base64 Data URL bền vững khi lưu trữ trên IndexedDB và Cloudflare KV, giải quyết triệt để lỗi mất ảnh do thu hồi Blob của WebKit.

---

*Đà Nẵng, Ngày 21 Tháng 09 Năm 2026*  
**Sinh viên thực hiện:** **Lê Cảm — Mã SV: 23IT022**  
*Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn (VKU)*
