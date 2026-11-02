/* كود المنطق البرمجي بلغة جافا سكريبت لوظيفة مادة BWP401 في الجامعة الافتراضية السورية SVU */

// الانتظار حتى يتم تحميل جميع عناصر واجهة مستخدم الصفحة بالكامل قبل تنفيذ الكود
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. نظام تبديل الوضع الداكن مع حماية ذاكرة التخزين المحلية للمتصفح (قاعدة إضافية للمشروع)
    // جلب الزر المسؤول عن تبديل الوضع الداكن والفاتح من الصفحة عبر المعرف الخاص به
    const darkModeToggle = document.getElementById("darkModeToggle");
    
    // التحقق من أن الزر موجود فعلياً في الصفحة الحالية لتجنب حدوث أخطاء برمجية
    if (darkModeToggle) {
        
        // التحقق من وجود التفضيل المسجل مسبقاً في متصفح المستخدم وضبط المظهر بناءً عليه
        if (localStorage.getItem("theme") === "dark") {
            // إضافة كلاس الوضع الداكن لجسم الصفحة بالكامل
            document.body.classList.add("dark-mode");
            // تغيير النص الظاهر على الزر ليتناسب مع الوضع الحالي
            darkModeToggle.textContent = "الوضع الفاتح ☀️";
        }

        // إضافة مستمع حدث عند النقر على الزر لتغيير الوضع فورياً
        darkModeToggle.addEventListener("click", function() {
            // تبديل وجود كلاس الوضع الداكن في جسم الصفحة (إضافة إذا كان غائباً وحذف إذا كان حاضراً)
            document.body.classList.toggle("dark-mode");
            
            // فحص إذا كان كلاس الوضع الداكن نشطاً الآن بعد التبديل
            if (document.body.classList.contains("dark-mode")) {
                // حفظ خيار المستخدم الحالي في ذاكرة المتصفح كوضع داكن
                localStorage.setItem("theme", "dark");
                // تحديث النص ليرشد المستخدم لكيفية العودة للوضع الفاتح
                this.textContent = "الوضع الفاتح ☀️";
            } else {
                // حفظ خيار المستخدم الحالي في ذاكرة المتصفح كوضع فاتح
                localStorage.setItem("theme", "light");
                // تحديث النص ليرشد المستخدم لكيفية الانتقال للوضع الداكن
                this.textContent = "الوضع الداكن 🌙";
            }
        });
    }

    // 2. منطق الفلترة التفاعلية للبطاقات في الصفحة الرئيسية وصفحة الاستكشاف (المتطلب الرابع من الوظيفة)
    // الفلترة الفورية للتصنيفات في الصفحة الرئيسية عن طريق الأزرار والشارات التفاعلية
    // جلب جميع الأزرار التي تحمل كلاس شارات الفلترة
    const filterButtons = document.querySelectorAll(".filter-badge-btn");
    // جلب جميع بطاقات الفعاليات المتاحة في الصفحة الرئيسية
    const homeCards = document.querySelectorAll(".event-card-item");

    // المرور على كل زر من أزرار الفلترة لتعيين ميكانيكية النقر عليه
    filterButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            
            // إزالة كلاس التفعيل البريمري النشط من جميع الأزرار وتحويلها إلى وضع الإطار فقط
            filterButtons.forEach(b => b.classList.replace("btn-primary", "btn-outline-primary"));
            // إضافة كلاس التفعيل البريمري النشط للزر الحالي الذي تم النقر عليه فقط لإبرازه
            this.classList.replace("btn-outline-primary", "btn-primary");

            // جلب قيمة الفلتر المحددة والمخزنة في الخاصية المخصصة للزر الحالي
            const selectedFilter = this.getAttribute("data-filter");

            // المرور على كافة بطاقات الفعاليات لتحديد ما يجب إظهاره وما يجب إخفاؤه
            homeCards.forEach(card => {
                // إذا كان خيار الفلترة هو الكل أو كانت فئة البطاقة تطابق الفلتر المحدد
                if (selectedFilter === "all" || card.getAttribute("data-category") === selectedFilter) {
                    // إظهار البطاقة في الواجهة بشكل طبيعي
                    card.style.display = "block";
                } else {
                    // إخفاء البطاقة تماماً من واجهة العرض
                    card.style.display = "none";
                }
            });
        });
    });

    // 3. شريط أدوات البحث والفلترة متعددة المعايير (خاص بصفحة الفعاليات: events.html)
    // جلب حقل إدخال نص البحث عبر معرفه الخاص
    const searchInput = document.getElementById("searchInput");
    // جلب قائمة اختيار الفئات المنسدلة عبر معرفها الخاص
    const categorySelect = document.getElementById("categorySelect");
    // جلب جميع بطاقات الفعاليات المخصصة لصفحة الفعاليات الكاملة
    const eventPageCards = document.querySelectorAll(".event-page-card");

    // دالة برمجية مخصصة للقيام بعملية الفلترة المزدوجة بناءً على الاسم والفئة معاً
    function filterEventsPage() {
        // تحويل النص المكتوب في حقل البحث إلى أحرف صغيرة لتجنب مشاكل حالة الأحرف، أو جعلها فارغة إن لم يوجد الحقل
        const query = searchInput ? searchInput.value.toLowerCase() : "";
        // جلب القيمة المحددة من قائمة الفئات، وإن لم توجد يتم افتراض الخيار الافتراضي وهو الكل
        const cat = categorySelect ? categorySelect.value : "all";

        // المرور على جميع بطاقات صفحة الفعاليات لتطبيق شروط التصفية والبحث
        eventPageCards.forEach(card => {
            // جلب عنوان الفعالية من الخاصية المخصصة وتحويله لأحرف صغيرة للمطابقة الدقيقة
            const cardTitle = card.getAttribute("data-title").toLowerCase();
            // جلب فئة التصنيف الخاصة بهذه البطاقة المحددة
            const cardCat = card.getAttribute("data-category");

            // التحقق من أن عنوان الفعالية يحتوي على النص المكتوب في حقل البحث
            const matchesSearch = cardTitle.includes(query);
            // التحقق من أن الفئة المختارة هي الكل أو أنها تطابق تماماً فئة البطاقة الحالية
            const matchesCategory = (cat === "all" || cardCat === cat);

            // يجب أن تتحقق شروط البحث وشروط الفئة معاً لإظهار البطاقة للمستخدم
            if (matchesSearch && matchesCategory) {
                // عرض البطاقة للمستخدم لكونها تطابق معايير البحث والتصفية المحددة
                card.style.display = "block";
            } else {
                // إخفاء البطاقة لأنها لا تتطابق مع معايير البحث المحددة
                card.style.display = "none";
            }
        });
    }

    // تفعيل مستمع الأحداث لحقل البحث ليعمل فوراً عند قيام المستخدم بالكتابة والتعديل
    if (searchInput) searchInput.addEventListener("input", filterEventsPage);
    // تفعيل مستمع الأحداث للقائمة المنسدلة ليعمل فوراً عند تغيير الفئة المختارة من قبل المستخدم
    if (categorySelect) categorySelect.addEventListener("change", filterEventsPage);

    // 4. منطق التحقق من صحة مدخلات النموذج من جهة العميل (خاص بصفحة اتصل بنا: contact.html)
    // جلب نموذج الاتصال عبر معرفه الخاص من الصفحة
    const contactForm = document.getElementById("contactForm");
    // جلب العنصر الحاضن المخصص لعرض رسائل التنبيه والخطأ والنجاح للمستخدم
    const alertPlaceholder = document.getElementById("alertPlaceholder");

    // التحقق من وجود نموذج الاتصال في الصفحة الحالية لتفادي الأخطاء البرمجية أثناء التنقل
    if (contactForm) {
        // إضافة مستمع حدث عند محاولة إرسال النموذج من قبل المستخدم
        contactForm.addEventListener("submit", function(e) {
            // منع السلوك الافتراضي لإرسال النموذج وتحديث الصفحة للسماح لنا بفحص البيانات أولاً
            e.preventDefault(); 
            // تنظيف الحاضنة وإزالة أي تنبيهات أو رسائل خطأ سابقة قبل الفحص الجديد
            alertPlaceholder.innerHTML = ""; 

            // جلب القيم المدخلة في حقول الاسم والبريد والرسالة مع تنظيف المساحات الفارغة من الأطراف
            const name = document.getElementById("userName").value.trim();
            const email = document.getElementById("userEmail").value.trim();
            const message = document.getElementById("userMessage").value.trim();

            // تعبير نمطي قياسي لفحص والتحقق من الصياغة الصحيحة والقانونية لعناوين البريد الإلكتروني
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // التحقق من وجود أي حقل فارغ من الحقول الإلزامية المطلوبة في النموذج
            if (name === "" || email === "" || message === "") {
                // استدعاء دالة إظهار التنبيه وعرض رسالة خطأ باللون الأحمر للمستخدم تفيد بنقص البيانات
                showAlert("عذراً! يرجى ملء كافة الحقول الإلزامية التي تحتوي على علامة (*).", "danger");
                // إيقاف تنفيذ الدالة فوراً وعدم الانتقال للخطوات التالية
                return;
            }

            // اختبار البريد الإلكتروني المدخل للتأكد من مطابقته للتعبير النمطي القياسي
            if (!emailPattern.test(email)) {
                // استدعاء دالة إظهار التنبيه وعرض رسالة تحذير باللون الأحمر تفيد بأن الصيغة غير صالحة
                showAlert("صيغة البريد الإلكتروني غير صحيحة! يرجى كتابة بريد حقيقي مثل name@example.com", "danger");
                // إيقاف تنفيذ الدالة فوراً لمنع معالجة البريد الخاطئ
                return;
            }

            // في حال تخطي كافة الفحوصات بنجاح، يتم إظهار تنبيه نجاح منبثق متوافق مع تصميم بوتستراب الأخضر
            showAlert("🚀 تم التحقق من البيانات وإرسال رسالتك بنجاح! سيقوم فريق الطلاب بالتواصل معك قريباً.", "success");
            // إعادة تعيين النموذج وتصفير كافة المدخلات النصية لتهيئته لاستقبال رسالة جديدة
            contactForm.reset(); 
        });
    }

    // دالة بناء وتوليد التنبيهات الديناميكية المتوافقة مع إطار عمل بوتستراب لعرضها في الواجهة
    function showAlert(message, type) {
        // إنشاء عنصر حاوية جديد من نوع ديف برمجياً
        const wrapper = document.createElement('div');
        // بناء الهيكل النصي للتنبيه مع دمج نوع التنبيه (خطر أو نجاح) ومحتوى الرسالة وزر الإغلاق
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible fade show rounded-pill px-4 shadow-sm" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');
        // إضافة عنصر التنبيه المولد حديثاً إلى العنصر الحاضن الرئيسي المخصص للتنبيهات في الصفحة
        alertPlaceholder.append(wrapper);
    }
});

