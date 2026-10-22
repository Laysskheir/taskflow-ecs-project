# خطة تعلّم ECS من الصفر إلى النشر

هذه الخطة مرتبطة بمشروع TaskFlow الموجود في المستودع. ننفذ كل مرحلة عمليًا، ولا ننتقل إلى المرحلة التالية قبل أن نفهم سبب الإعدادات ونتحقق من النتيجة.

## المرحلة 1 — التطبيق محليًا
- فهم بنية NestJS: Module وController وService وDTO وEntity.
- تجربة CRUD لإدارة المهام.
- فهم الفرق بين Liveness وReadiness.
- تشغيل الاختبارات والبناء محليًا.

## المرحلة 2 — Docker
- فهم Image وContainer وDockerfile وBuild Context.
- شرح WORKDIR وCMD وENTRYPOINT وEXPOSE.
- بناء صورة متعددة المراحل وتشغيلها بمستخدم غير root.
- فهم Environment Variables وLogs وSignals.
- تشغيل API وPostgreSQL باستخدام Docker Compose.

## المرحلة 3 — قاعدة البيانات
- فهم PostgreSQL وTypeORM وMigrations.
- لماذا نعطّل synchronize؟
- تطبيق migration والتراجع عنها.
- فهم أن بيانات قاعدة البيانات لا يجب أن تعتمد على عمر Container.

## المرحلة 4 — ECR
- إنشاء Repository.
- تسجيل الدخول ودفع Docker Image.
- استخدام Tags محددة.
- فهم صلاحيات السحب من ECR ودور Task Execution Role.

## المرحلة 5 — الشبكات
- VPC وCIDR وSubnets وRoute Tables.
- Public مقابل Private Subnets.
- Internet Gateway وNAT Gateway وVPC Endpoints.
- Security Groups وتدفق الاتصال بين ALB وECS وRDS.
- awsvpc وPrivate IP وPublic IP.

## المرحلة 6 — IAM والأسرار
- Task Role مقابل Task Execution Role.
- مبدأ أقل صلاحية ممكنة.
- Secrets Manager أو Parameter Store.
- لماذا لا نضع كلمات السر في Git أو Docker Image؟

## المرحلة 7 — Task Definition
- Family وRevision.
- CPU وMemory وContainer Port وImage URI.
- Environment Variables وSecrets.
- Logging وHealth Check وRestart Policy.
- Volumes وEphemeral Storage وContainer Dependencies.

## المرحلة 8 — Cluster وService وFargate
- Cluster وTask وService.
- Desired Count مقابل Running Count.
- تشغيل Task مستقلة مقابل ECS Service.
- Capacity Providers وFargate.
- Deployment events وتشخيص فشل المهام.

## المرحلة 9 — Application Load Balancer
- Listener وTarget Group وHealth Checks.
- ربط الـ ALB بالـ ECS Service.
- إبقاء التطبيق وقاعدة البيانات خلف قواعد شبكة ضيقة.
- إضافة HTTPS عند توفر نطاق وشهادة مناسبتين.

## المرحلة 10 — Logs وMonitoring
- CloudWatch Logs وMetrics.
- ECS Service Events وStopped Reason.
- مراقبة CPU والذاكرة.
- استخدام ECS Exec عندما يكون متاحًا ومسموحًا.
- إعداد تنبيهات مفيدة بدل الاكتفاء بتجميع السجلات.

## المرحلة 11 — Scaling
- تغيير Desired Count يدويًا.
- Service Auto Scaling وTarget Tracking.
- Min/Max capacity وScale-out وScale-in.
- اختبار الحمل ومراقبة سلوك الخدمة.

## المرحلة 12 — Deployments وRollback
- تسجيل Revision جديدة.
- تحديث Service إلى إصدار جديد.
- Rolling Deployment.
- Deployment Circuit Breaker وRollback.
- الفرق بين Rolling وBlue/Green.

## المرحلة 13 — CI/CD
- GitHub Actions: اختبار وبناء الصورة.
- دفع الصورة إلى ECR.
- استخدام GitHub OIDC للحصول على صلاحيات AWS مؤقتة عند السماح بذلك.
- تسجيل Task Definition جديدة وتحديث ECS Service.
- التحقق من استقرار النشر وإيقافه أو التراجع عند الفشل.

## المرحلة 14 — Terraform أو OpenTofu
- إدارة VPC وSecurity Groups وECR وIAM وALB وECS وRDS بالكود.
- فهم State وPlan وApply وDestroy.
- مراجعة التغييرات قبل تنفيذها.
- إبقاء الأسرار والحالة الحساسة خارج Git.

## قواعد السلامة والتكلفة
- نبدأ بأصغر موارد مناسبة للتجربة.
- لا نفتح كل المنافذ أو نمنح Administrator لمجرد حل خطأ.
- لا نجعل PostgreSQL عامة على الإنترنت.
- نتحقق من صلاحيات KodeKloud Lab قبل الاعتماد على خدمة معينة.
- بعد كل مختبر، نحذف الموارد المدفوعة غير المطلوبة ونتأكد من عدم بقاء ALB أو NAT Gateway أو RDS أو خدمات Fargate تعمل دون حاجة.
- نميّز بين مشروع تعلّم يحاكي الإنتاج وبيئة إنتاج فعلية تم اختبار أمنها واعتماديتها وتكلفتها.
