FROM python:3.11-slim

WORKDIR /app

# نسخ الملفات مع الهيكل الصحيح
COPY requirements.txt .
COPY app ./app

# تثبيت المتطلبات
RUN pip install --no-cache-dir -r requirements.txt

# إنشاء مجلد instance مع الصلاحيات
RUN mkdir -p /app/app/instance && \
    chmod -R 777 /app/app/instance

# متغيرات البيئة
ENV FLASK_APP=app/app.py
ENV FLASK_ENV=production
ENV DATABASE_URL=sqlite:////app/app/instance/data.db

EXPOSE 5000

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]