# 🚀 Despliegue de la Fase I (MVP Histórico)

> [!WARNING]  
> Documento congelado correspondiente a la **Fase I (v1)**. Para ver las instrucciones de despliegue activas de la Fase II, consulta **[`docs/v2/DEPLOYMENT.md`](../v2/DEPLOYMENT.md)**.

---

## 🏗️ Construcción y Despliegue Monolítico Inicial

En la Fase I, el frontend se construía como un artefacto estático único con Vite y se servía mediante Nginx en el puerto 80.

### 1. Build de Producción Local
```bash
npm install
npm run build
```

### 2. Construcción del Contenedor Docker
```bash
docker build -t parking-frontend:v1 .
```

### 3. Ejecución del Contenedor
```bash
docker run -d -p 80:80 --name parking-frontend-v1 parking-frontend:v1
```

### 4. Endpoints de Verificación Runtime
```text
GET /health
GET /index.html
```
